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
}

export type ChatEventType =
  | 'send'
  | 'receive'
  | 'change:view'
  | 'change:history'
  | 'change:workspace'
  | 'restart';

export type ChatEventHandler<T = unknown> = (detail: T) => void;

let nextMessageId = 0;
function generateMessageId(): string {
  nextMessageId += 1;
  return `ai-chat-message-${nextMessageId}`;
}

/**
 * Ember-native orchestration layer for the `ai-chat/*` component family -
 * the equivalent of `@carbon/ai-chat`'s React app
 * (`packages/ai-chat/src/chat`: `AppShell` + `services/` + the Redux
 * `store/`). Registered under the `carbon.` namespace like this addon's
 * other services (`carbon.notifications`, `carbon.dialog-manager`) - inject
 * with `@service('carbon.ai-chat-session')`.
 *
 * See AGENTS.md's "Porting Carbon AI Chat" -> "Orchestration layer" section
 * for the full React -> Ember mapping table and the list of upstream
 * responsibilities deliberately left out of this first pass (human-agent
 * handoff, persistence/rehydration, custom panels, multi-instance
 * namespacing, theming - docs-app's own `ThemeSupport` already owns that
 * last one here).
 */
export default class ChatSessionService extends Service {
  @tracked messages: ChatMessage[] = [];
  @tracked draft = '';
  /** Mirrors upstream's `ViewState` open/closed flag (launcher vs. shell). */
  @tracked open = false;
  @tracked showHistory = false;
  @tracked showWorkspace = false;
  /** Mirrors upstream's `UPDATE_INPUT_STATE` `isReadonly` flag. */
  @tracked isReadonly = false;

  #listeners = new Map<ChatEventType, Set<ChatEventHandler<any>>>();

  /** Equivalent of `instance.on()`. */
  on<T = unknown>(type: ChatEventType, handler: ChatEventHandler<T>): this {
    let handlers = this.#listeners.get(type);
    if (!handlers) {
      handlers = new Set();
      this.#listeners.set(type, handlers);
    }
    handlers.add(handler as ChatEventHandler<any>);
    return this;
  }

  /** Equivalent of `instance.off()`. */
  off<T = unknown>(type: ChatEventType, handler: ChatEventHandler<T>): this {
    this.#listeners.get(type)?.delete(handler as ChatEventHandler<any>);
    return this;
  }

  /** Equivalent of the event bus's internal `emit`/`fire`. */
  emit<T = unknown>(type: ChatEventType, detail?: T): void {
    for (const handler of this.#listeners.get(type) ?? []) {
      handler(detail);
    }
  }

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
    this.emit('receive', message);
    return message;
  };

  /**
   * Equivalent of `STREAMING_ADD_CHUNK`. Upstream's real
   * `InboundStreamingCoordinator` also tracks per-response generations and
   * abort controllers for cancellation - deliberately cut here, see
   * AGENTS.md.
   */
  appendChunk = (id: string, delta: string): void => {
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
  };

  get isStreaming(): boolean {
    return this.messages.some((message) => message.streaming);
  }

  /** Equivalent of dispatching `RESTART_CONVERSATION`. */
  restart = (): void => {
    this.messages = [];
    this.draft = '';
    this.emit('restart');
  };
}
