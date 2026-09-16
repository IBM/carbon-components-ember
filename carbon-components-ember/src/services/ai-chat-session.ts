/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
 * handoff, persistence/rehydration, custom panels, theming - docs-app's own
 * `ThemeSupport` already owns that last one here).
 */
export class ChatSession {
  /** The id this instance was created for. See `ChatSessionService#for()`. */
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  @tracked messages: ChatMessage[] = [];
  @tracked draft = '';
  /** Mirrors upstream's `ViewState` open/closed flag (launcher vs. shell). */
  @tracked open = false;
  @tracked showHistory = false;
  @tracked showWorkspace = false;
  /** Mirrors upstream's `UPDATE_INPUT_STATE` `isReadonly` flag. */
  @tracked isReadonly = false;

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
  };

  /** Equivalent of dispatching `SET_HISTORY_PANEL_OPEN`. */
  toggleHistory = (): void => {
    this.showHistory = !this.showHistory;
    this.emit('change:history', { showHistory: this.showHistory });
  };

  /** Equivalent of dispatching `SET_WORKSPACE_PANEL_OPEN`. */
  toggleWorkspace = (): void => {
    this.showWorkspace = !this.showWorkspace;
    this.emit('change:workspace', { showWorkspace: this.showWorkspace });
  };

  setDraft = (value: string): void => {
    this.draft = value;
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
   * fact.
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
  };

  /** Equivalent of processing a `FinalResponseChunk`. */
  finalizeStreaming = (id: string): void => {
    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, streaming: false } : message,
    );
    this.#streamControllers.delete(id);
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
  };
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
      this.#sessions.set(id, session);
    }
    return session;
  };

  /** The single-widget-page convenience: `for(DEFAULT_CHAT_SESSION_ID)`. */
  get default(): ChatSession {
    return this.for();
  }
}
