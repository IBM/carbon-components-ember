/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { associateDestroyableChild, registerDestructor } from '@ember/destroyable';

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  text: string;
  /** True while an assistant message is still receiving streamed chunks. */
  streaming?: boolean;
  /** True once `cancelStreaming()` has stopped a still in-progress response. */
  cancelled?: boolean;
}

export type ChatEventType =
  | 'send'
  | 'receive'
  | 'cancel'
  | 'change:view'
  | 'change:history'
  | 'change:workspace'
  | 'restart';

export type ChatEventHandler<T = unknown> = (detail: T) => void;

/** The id `ChatSessionService#for()` resolves to when no id is given. */
export const DEFAULT_CHAT_SESSION_ID = 'default';

let nextMessageId = 0;
function generateMessageId(): string {
  nextMessageId += 1;
  return `ai-chat-message-${nextMessageId}`;
}

const MESSAGE_ID_PATTERN = /^ai-chat-message-(\d+)$/;

/**
 * A rehydrated message can carry an id minted by an *earlier* page load's
 * counter (which always restarts at 0). Without this, the next `send()`/
 * `receive()` after a restore would reuse an id already present in the
 * restored array, corrupting `{{#each ... key='id'}}` identity and letting
 * `appendChunk()` write into the wrong message.
 */
function bumpMessageIdCounter(messages: ChatMessage[]): void {
  for (const message of messages) {
    const match = MESSAGE_ID_PATTERN.exec(message.id);
    if (match) {
      const parsed = Number(match[1]);
      if (parsed > nextMessageId) {
        nextMessageId = parsed;
      }
    }
  }
}

/**
 * Storage backend for `enablePersistence()` - deliberately just the 3
 * methods of the real `Storage` interface, so `window.sessionStorage`/
 * `window.localStorage` already satisfy it with no wrapping. Kept
 * synchronous only (no `Promise`-returning variant) since there is no real
 * consumer needing an async (e.g. network/IndexedDB) backend yet - add one
 * if/when there is, matching this file's existing "don't speculatively
 * build" precedent (e.g. `on()`'s missing `.once()`).
 */
export type ChatSessionStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const STORAGE_VERSION = 1;
const DEFAULT_STORAGE_KEY = 'carbon-ai-chat-session';

interface PersistedChatSession {
  version: number;
  messages: ChatMessage[];
  draft: string;
  open: boolean;
  showHistory: boolean;
  showWorkspace: boolean;
}

/**
 * One isolated conversation's worth of state - what used to live directly
 * on `ChatSessionService` before multi-instance isolation. Everything here
 * (messages, draft, panel flags, the event bus) is scoped to a single `id`;
 * two `ChatSession`s never see each other's sends, listeners, or panel
 * state. See `ChatSessionService#for()`.
 *
 * Ember-native orchestration layer for the `ai-chat/*` component family -
 * the equivalent of `@carbon/ai-chat`'s React app
 * (`packages/ai-chat/src/chat`: `AppShell` + `services/` + the Redux
 * `store/`).
 *
 * See AGENTS.md's "Porting Carbon AI Chat" -> "Orchestration layer" section
 * for the full React -> Ember mapping table and the list of upstream
 * responsibilities deliberately left out of this first pass (human-agent
 * handoff, custom panels, theming - docs-app's own `ThemeSupport` already
 * owns that last one here) and the "Persistence" subsection for
 * `enablePersistence()`'s design.
 */
export class ChatSession {
  /** The id this instance was created for. See `ChatSessionService#for()`. */
  readonly id: string;

  constructor(id: string) {
    this.id = id;
    registerDestructor(this, () => {
      if (this.#persistTimer !== undefined) {
        clearTimeout(this.#persistTimer);
      }
    });
  }

  @tracked messages: ChatMessage[] = [];
  @tracked draft = '';
  /** Mirrors upstream's `ViewState` open/closed flag (launcher vs. shell). */
  @tracked open = false;
  @tracked showHistory = false;
  @tracked showWorkspace = false;
  /** Mirrors upstream's `UPDATE_INPUT_STATE` `isReadonly` flag. */
  @tracked isReadonly = false;
  /** `true` once `enablePersistence()` has restored a previously-persisted session. */
  @tracked wasRehydrated = false;

  #listeners = new Map<ChatEventType, Set<ChatEventHandler<any>>>();
  /**
   * One `AbortController` per still-streaming response, for
   * `getAbortSignal()`/`cancelStreaming()`. Equivalent of upstream's
   * `InboundStreamingCoordinator`'s `messageAbortControllers` map, minus
   * the `response_id`/`item_id` aliasing `StreamingTracker` layers on top
   * of it - this service has no wire protocol with a second id to
   * resolve, `appendChunk()`'s `id` is always whatever `receive()`
   * returned, so that aliasing is deliberately not ported. See AGENTS.md.
   */
  #streamControllers = new Map<string, AbortController>();
  /**
   * Response ids `cancelStreaming()`/`restart()` have already stopped.
   * Equivalent of upstream's `validateChunkGeneration` guard against a
   * stale chunk resurrecting a cancelled response - kept as a permanent
   * per-id set rather than a single incrementing generation counter,
   * since message ids here are never reused.
   */
  #cancelledResponses = new Set<string>();
  #storage?: ChatSessionStorage;
  #storageKey = DEFAULT_STORAGE_KEY;
  #persistTimer?: ReturnType<typeof setTimeout>;

  /** Equivalent of `instance.on()`. */
  on = <T = unknown>(type: ChatEventType, handler: ChatEventHandler<T>): this => {
    let handlers = this.#listeners.get(type);
    if (!handlers) {
      handlers = new Set();
      this.#listeners.set(type, handlers);
    }
    handlers.add(handler as ChatEventHandler<any>);
    return this;
  };

  /** Equivalent of `instance.off()`. */
  off = <T = unknown>(type: ChatEventType, handler: ChatEventHandler<T>): this => {
    this.#listeners.get(type)?.delete(handler as ChatEventHandler<any>);
    return this;
  };

  /** Equivalent of the event bus's internal `emit`/`fire`. */
  emit = <T = unknown>(type: ChatEventType, detail?: T): void => {
    // Snapshot rather than iterate the live Set directly, so a handler that
    // calls on()/off() for this same event type during dispatch (e.g. a
    // once-style self-unsubscribe) doesn't mutate the Set mid-iteration.
    for (const handler of [...(this.#listeners.get(type) ?? [])]) {
      handler(detail);
    }
  };

  /** Equivalent of `instance.changeView()` toggling between launcher/shell. */
  toggleOpen = (): void => {
    this.open = !this.open;
    this.emit('change:view', { open: this.open });
    this.persist();
  };

  /** Equivalent of dispatching `SET_HISTORY_PANEL_OPEN`. */
  toggleHistory = (): void => {
    this.showHistory = !this.showHistory;
    this.emit('change:history', { showHistory: this.showHistory });
    this.persist();
  };

  /** Equivalent of dispatching `SET_WORKSPACE_PANEL_OPEN`. */
  toggleWorkspace = (): void => {
    this.showWorkspace = !this.showWorkspace;
    this.emit('change:workspace', { showWorkspace: this.showWorkspace });
    this.persist();
  };

  setDraft = (value: string): void => {
    this.draft = value;
    this.schedulePersist();
  };

  /**
   * Equivalent of `instance.send()`. Appends a user message and emits
   * `'send'` - same boundary upstream draws: producing the assistant's
   * reply is the host application's job (upstream's `customSendMessage`),
   * not this service's. Call `receive()`/`appendChunk()` from a `'send'`
   * listener to react to it.
   */
  send = (text?: string): ChatMessage | undefined => {
    const value = (text ?? this.draft).trim();
    if (!value || this.isReadonly) {
      return undefined;
    }
    const message: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      text: value,
    };
    this.messages = [...this.messages, message];
    if (text === undefined) {
      this.draft = '';
    }
    this.emit('send', message);
    this.persist();
    return message;
  };

  /**
   * Equivalent of dispatching `ADD_MESSAGE` for an assistant response.
   * Pass `{ streaming: true }` for a response that will receive further
   * `appendChunk()` calls (equivalent of upstream's `STREAMING_START`).
   */
  receive = (text: string, options: { streaming?: boolean } = {}): ChatMessage => {
    const message: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      text,
      streaming: Boolean(options.streaming),
    };
    this.messages = [...this.messages, message];
    if (options.streaming) {
      this.#streamControllers.set(message.id, new AbortController());
    }
    this.emit('receive', message);
    this.persist();
    return message;
  };

  /**
   * `AbortSignal` for a still-streaming response, for the host to wire into
   * its own network request (e.g. `fetch(url, { signal })`) so
   * `cancelStreaming()` actually stops inbound data, not just this
   * service's own bookkeeping. `undefined` once the response has
   * finalized/cancelled, or if it was never started with
   * `{ streaming: true }`.
   */
  getAbortSignal = (id: string): AbortSignal | undefined => {
    return this.#streamControllers.get(id)?.signal;
  };

  /**
   * Equivalent of `STREAMING_ADD_CHUNK`. Drops a chunk for a response
   * `cancelStreaming()` already stopped (see `#cancelledResponses`) rather
   * than resurrecting it - a host's in-flight streaming loop can still be
   * mid-`await` when cancellation happens and keep calling this after the
   * fact. Persistence is debounced here (unlike every other mutator) since
   * a streamed reply can call this every ~50-100ms per chunk.
   */
  appendChunk = (id: string, delta: string): void => {
    if (this.#cancelledResponses.has(id)) {
      return;
    }
    this.messages = this.messages.map((message) =>
      message.id === id
        ? { ...message, text: message.text + delta, streaming: true }
        : message,
    );
    this.schedulePersist();
  };

  /** Equivalent of processing a `FinalResponseChunk`. */
  finalizeStreaming = (id: string): void => {
    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, streaming: false } : message,
    );
    this.#streamControllers.delete(id);
    this.persist();
  };

  get isStreaming(): boolean {
    return this.messages.some((message) => message.streaming);
  }

  /**
   * Equivalent of `InboundStreamingCoordinator.streamingMessageID` - the
   * response currently receiving chunks, if any. Assumes at most one
   * active stream at a time, matching `isStreaming`'s existing
   * single-boolean model - this port has no concurrent-response support.
   */
  get streamingMessageId(): string | null {
    return this.messages.find((message) => message.streaming)?.id ?? null;
  }

  /**
   * Equivalent of upstream's user-triggered "Stop generating" action -
   * `InboundStreamingCoordinator`'s cancellation path (minus the
   * `response_id`/`item_id` aliasing, see `#streamControllers`'s doc
   * comment). Defaults to the currently-streaming response when no `id`
   * is given. Aborts the response's `AbortSignal` (`getAbortSignal()`) so
   * a host's own network request actually stops, marks the message no
   * longer streaming, and flags it `cancelled` so a consumer can render a
   * "stopped" affordance.
   */
  cancelStreaming = (id?: string): void => {
    const targetId = id ?? this.streamingMessageId;
    if (!targetId || !this.#streamControllers.has(targetId)) {
      return;
    }
    this.#cancelledResponses.add(targetId);
    this.#streamControllers.get(targetId)?.abort();
    this.#streamControllers.delete(targetId);
    let cancelledMessage: ChatMessage | undefined;
    this.messages = this.messages.map((message) => {
      if (message.id !== targetId) {
        return message;
      }
      cancelledMessage = { ...message, streaming: false, cancelled: true };
      return cancelledMessage;
    });
    if (cancelledMessage) {
      this.emit('cancel', cancelledMessage);
    }
    this.persist();
  };

  /**
   * Equivalent of dispatching `RESTART_CONVERSATION`. Iterates
   * `#streamControllers` (a plain, untracked `Map`) rather than the
   * `@tracked messages` array to find in-flight streams to abort - reading
   * `messages` here and then writing it a few lines later would trip
   * Ember's backtracking-rerender assertion when `restart()` runs during a
   * render computation (e.g. from a component constructor, as the docs
   * demo and its regression test both do).
   */
  restart = (): void => {
    for (const [id, controller] of this.#streamControllers) {
      this.#cancelledResponses.add(id);
      controller.abort();
    }
    this.#streamControllers.clear();
    this.messages = [];
    this.draft = '';
    this.emit('restart');
    this.persist();
  };

  /**
   * Ember equivalent of upstream's `UserSessionStorageService` +
   * `HYDRATE_CHAT`/`HYDRATE_MESSAGE_HISTORY`, combined into one opt-in call
   * (this service has no separate "UI view state" vs. "message history"
   * subsystem to split across upstream's two mechanisms - see AGENTS.md's
   * "Persistence" subsection for the full design rationale). Attempts an
   * immediate restore from `storage` (`window.sessionStorage` by default -
   * matching upstream's own choice, made specifically to avoid needing a
   * public cookie-policy notice under EU law), then persists
   * session-relevant tracked state back to it after every later mutation
   * for as long as persistence stays enabled. Returns whether a previously-
   * persisted session was actually restored (also mirrored onto
   * `wasRehydrated`).
   *
   * A consumer that also calls `restart()` unconditionally at construction
   * time (the pattern this service's own docs demo used *before* this
   * method existed, to make a remount idempotent) must call
   * `enablePersistence()` first and only seed a fresh conversation when it
   * returns `false` - calling `restart()` unconditionally after enabling
   * persistence wipes the just-restored session on every mount, since
   * `restart()` persists its own (now-empty) state like every other
   * mutator. See the docs demo (`session-shell.gjs.md`) for the correct
   * order.
   *
   * Since this service is a singleton, a host that calls this from a
   * component's constructor (the documented pattern above) will call it
   * again on every remount - including one that happens to land inside a
   * pending debounced write from `setDraft()`/`appendChunk()`. If `storage`
   * and `key` are unchanged from what's already active, this is a no-op
   * (aside from flushing that pending write) rather than a discard-and-
   * rehydrate: there's nothing to re-point persistence at, and reverting to
   * the last-*flushed* snapshot would silently drop the last few hundred
   * milliseconds of already-in-memory state (`schedulePersist()`'s debounce
   * window). A real change of `storage`/`key` still
   * cancels any pending write for the *old* target (abandoning it is
   * correct there) and rehydrates from the new one.
   */
  enablePersistence = (
    storage: ChatSessionStorage = window.sessionStorage,
    key: string = this.id === DEFAULT_CHAT_SESSION_ID
      ? DEFAULT_STORAGE_KEY
      : `${DEFAULT_STORAGE_KEY}:${this.id}`,
  ): boolean => {
    if (this.#storage === storage && this.#storageKey === key) {
      this.persist();
      return this.wasRehydrated;
    }
    if (this.#persistTimer !== undefined) {
      clearTimeout(this.#persistTimer);
      this.#persistTimer = undefined;
    }
    this.#storage = storage;
    this.#storageKey = key;
    this.wasRehydrated = this.rehydrate();
    return this.wasRehydrated;
  };

  /** Stops automatic persistence. Does not clear anything already stored - see `clearPersistedSession()`. */
  disablePersistence = (): void => {
    this.#storage = undefined;
    if (this.#persistTimer !== undefined) {
      clearTimeout(this.#persistTimer);
      this.#persistTimer = undefined;
    }
  };

  /**
   * Equivalent of `UserSessionStorageService#clearSession()`. No-op while
   * persistence is disabled. Does *not* disable persistence itself - the
   * very next mutation (matching upstream's own separation between
   * clearing a session and unsubscribing from the store) re-persists
   * whatever the current tracked state is. Pair with `disablePersistence()`
   * first if a stored session should actually stay gone.
   */
  clearPersistedSession = (): void => {
    try {
      this.#storage?.removeItem(this.#storageKey);
    } catch (error) {
      console.error('Failed to clear persisted chat session', error);
    }
  };

  /**
   * Writes the current session-relevant tracked state to storage
   * immediately, canceling any pending debounced write from
   * `appendChunk()`/`setDraft()`. Every other mutator already calls this
   * itself once persistence is enabled - exposed publicly too, so a host
   * can force a final write (e.g. from a `beforeunload` handler).
   */
  persist = (): void => {
    if (this.#persistTimer !== undefined) {
      clearTimeout(this.#persistTimer);
      this.#persistTimer = undefined;
    }
    if (!this.#storage) {
      return;
    }
    const snapshot: PersistedChatSession = {
      version: STORAGE_VERSION,
      messages: this.messages,
      draft: this.draft,
      open: this.open,
      showHistory: this.showHistory,
      showWorkspace: this.showWorkspace,
    };
    try {
      this.#storage.setItem(this.#storageKey, JSON.stringify(snapshot));
    } catch (error) {
      console.error('Failed to persist chat session', error);
    }
  };

  /**
   * Internal - debounces `persist()` for the two high-frequency mutators
   * (`appendChunk()`, `setDraft()`). Not prefixed `#` like the fields above
   * since this addon's babel config doesn't enable private *methods*
   * (only private fields) - matches this file's existing convention of
   * plain, unprefixed "internal" methods.
   */
  schedulePersist(): void {
    if (!this.#storage) {
      return;
    }
    if (this.#persistTimer !== undefined) {
      clearTimeout(this.#persistTimer);
    }
    this.#persistTimer = setTimeout(() => {
      this.#persistTimer = undefined;
      this.persist();
    }, 250);
  }

  rehydrate(): boolean {
    if (!this.#storage) {
      return false;
    }
    let raw: string | null;
    try {
      raw = this.#storage.getItem(this.#storageKey);
    } catch (error) {
      console.error('Failed to read persisted chat session', error);
      return false;
    }
    if (!raw) {
      return false;
    }
    try {
      const persisted = JSON.parse(raw) as PersistedChatSession;
      // Equivalent of upstream's own "session is from a previous version,
      // throw it away" guard in `loadSession()`, rather than risk restoring
      // a shape this version of the service doesn't understand.
      if (persisted.version !== STORAGE_VERSION) {
        this.clearPersistedSession();
        return false;
      }
      // A message persisted mid-stream (page closed before the reply
      // finished) has no host loop left to finalize it - restoring it as
      // still-`streaming` would make `isStreaming` true forever. Same
      // sanitize-on-load principle as upstream's own `launcherIsExpanded:
      // false` override in `loadSession()`.
      const messages = persisted.messages.map((message) =>
        message.streaming ? { ...message, streaming: false } : message,
      );
      bumpMessageIdCounter(messages);
      this.messages = messages;
      this.draft = persisted.draft;
      this.open = persisted.open;
      this.showHistory = persisted.showHistory;
      this.showWorkspace = persisted.showWorkspace;
      return true;
    } catch (error) {
      console.error('Failed to restore persisted chat session', error);
      this.clearPersistedSession();
      return false;
    }
  }
}

/**
 * Registry of `ChatSession`s, keyed by an arbitrary string id - the Ember
 * equivalent of upstream's `NamespaceService` (multi-instance isolation).
 * Registered under the `carbon.` namespace like this addon's other
 * services (`carbon.notifications`, `carbon.dialog-manager`) - inject with
 * `@service('carbon.ai-chat-session')`.
 *
 * A single-widget page never needs an id: `service.default` (equivalent to
 * `service.for()`) resolves the same session every time, matching this
 * service's pre-multi-instance API 1:1. A page with several independent
 * chat widgets gives each one its own id (e.g. a `SessionShell`'s
 * `@instanceId` arg) - `service.for('support')` and `service.for('sales')`
 * never share messages, drafts, panel state, or event-bus listeners.
 *
 * See AGENTS.md's "Porting Carbon AI Chat" -> "Orchestration layer" ->
 * "Multi-instance isolation" section for why this is a registry on one
 * singleton rather than a non-singleton factory per widget.
 */
export default class ChatSessionService extends Service {
  #sessions = new Map<string, ChatSession>();

  /** Get-or-create the `ChatSession` for `id` (`DEFAULT_CHAT_SESSION_ID` if omitted). */
  for = (id: string = DEFAULT_CHAT_SESSION_ID): ChatSession => {
    let session = this.#sessions.get(id);
    if (!session) {
      session = new ChatSession(id);
      associateDestroyableChild(this, session);
      this.#sessions.set(id, session);
    }
    return session;
  };

  /** The single-widget-page convenience: `for(DEFAULT_CHAT_SESSION_ID)`. */
  get default(): ChatSession {
    return this.for();
  }
}
