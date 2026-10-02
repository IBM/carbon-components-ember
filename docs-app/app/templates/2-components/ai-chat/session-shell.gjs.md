<ThemeSwitcher />

# SessionShell

`SessionShell` is this addon's Ember-native equivalent of `@carbon/ai-chat`'s
React `AppShell` — the orchestration container that wires the
`carbon.ai-chat-session` service into the already-ported presentational
[`Launcher`](./launcher.md)/[`ChatShell`](./chat-shell.md)/
[`PromptLineShell`](./prompt-line-shell.md)/[`PromptLine`](./prompt-line.md)/
[`Processing`](./processing.md) components. Those components themselves stay
exactly as ported (stateless, always-controlled); `SessionShell` is the one
place that injects `@service('carbon.ai-chat-session')` and passes session
state down as plain args.

See the [full Carbon AI Chat demo app](../../ai-chat-demo) for a larger,
standalone assembly of these pieces — full-window and floating launcher
layouts, a custom workspace panel, writeable-element content, and example
custom response types — comparable in scope to upstream's own
[`demo/` package](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/demo).

Producing an assistant reply is left to the host application, matching
upstream's own `customSendMessage` boundary — the demo below listens for the
service's `'send'` event and calls `receive()`/`appendChunk()`/
`finalizeStreaming()` itself, simulating a streamed response. It also checks
`getAbortSignal()` between chunks, so clicking the "Stop generating" button
that appears while streaming (wired to `cancelStreaming()`) actually breaks
the host's own reply loop, not just the service's internal bookkeeping.

The demo also calls `enablePersistence()`, so the conversation survives a
real page reload (try sending a message, then reloading this page), and
passes `@historyItems`/`@onHistoryItemSelect`/`@onHistoryItemRename`/
`@onHistoryItemDelete` to show the built-in `<:history>` panel — the item
list itself is host-owned demo data here (this service tracks one live
conversation, not a list of past ones; see AGENTS.md), not something
persistence restores on its own.

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { SessionShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const REPLY = 'This is a simulated streamed reply from the host application.';
const STORAGE_KEY = 'docs-session-shell-demo';

class SessionShellDemo extends Component {
  @service('carbon.ai-chat-session') sessions;

  // No @instanceId is passed to <SessionShell /> below, so it resolves the
  // registry's default session - the same one .default resolves here.
  get session() {
    return this.sessions.default;
  }

  @tracked historyItems = [
    { id: 'trip', name: 'Trip planning' },
    { id: 'recipe', name: 'Recipe ideas' },
  ];
  @tracked selectedHistoryItemId = null;

  constructor(owner, args) {
    super(owner, args);
    // Restores a previously-persisted conversation (survives a real page
    // reload, unlike a plain in-memory SPA route remount) - only seed the
    // welcome message when there was nothing to restore. on()/off() are
    // manual by design (matching upstream's instance.on/off), so any
    // consumer registering a handler owns cleaning it up on teardown.
    const restored = this.session.enablePersistence(window.sessionStorage, STORAGE_KEY);
    if (!restored) {
      this.session.receive('Hello! How can I help?');
    }
    this.session.on('send', this.reply);
    registerDestructor(this, () => this.session.off('send', this.reply));
  }

  reply = async () => {
    const message = this.session.receive('', { streaming: true });
    const signal = this.session.getAbortSignal(message.id);
    const words = REPLY.split(' ');
    for (const [index, word] of words.entries()) {
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (signal?.aborted) {
        return;
      }
      this.session.appendChunk(message.id, (index > 0 ? ' ' : '') + word);
    }
    this.session.finalizeStreaming(message.id);
  };

  @action
  selectHistoryItem(id) {
    this.selectedHistoryItemId = id;
  }

  @action
  renameHistoryItem(id, name) {
    this.historyItems = this.historyItems.map((item) => (item.id === id ? { ...item, name } : item));
  }

  @action
  deleteHistoryItem(id) {
    this.historyItems = this.historyItems.filter((item) => item.id !== id);
  }

  <template>
    <ThemeSupport />
    <div style='block-size: 32rem; max-inline-size: 400px; position: relative;'>
      <SessionShell
        @closedLabel='Open chat'
        @messagesAriaLabel='Chat messages'
        @historyItems={{this.historyItems}}
        @selectedHistoryItemId={{this.selectedHistoryItemId}}
        @onHistoryItemSelect={{this.selectHistoryItem}}
        @onHistoryItemRename={{this.renameHistoryItem}}
        @onHistoryItemDelete={{this.deleteHistoryItem}}
      />
    </div>
  </template>
}

<template><SessionShellDemo /></template>
```

## Multiple independent instances

`@service('carbon.ai-chat-session')` is a registry keyed by id (see
`ChatSessionService#for()`), not a single flat bag of state — passing a
distinct `@instanceId` to each `SessionShell` isolates its messages, draft,
panel state, and event-bus listeners from every other instance on the page.
The demo below renders two independently-open, independently-driven shells
side by side; sending in one never touches the other.

```gjs live preview
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { SessionShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class MultiInstanceDemo extends Component {
  @service('carbon.ai-chat-session') sessions;

  constructor(owner, args) {
    super(owner, args);
    // Each id resolves its own ChatSession - restart() only clears the
    // instance it's called on, so these two seed independently.
    this.sessions.for('support').restart();
    this.sessions.for('support').receive("Hi, I'm the support widget.");
    this.sessions.for('sales').restart();
    this.sessions.for('sales').receive("Hi, I'm the sales widget.");
  }

  <template>
    <ThemeSupport />
    <div style='display: flex; gap: 1rem;'>
      <div style='block-size: 24rem; inline-size: 320px; position: relative;'>
        <SessionShell @instanceId='support' @closedLabel='Open support chat' />
      </div>
      <div style='block-size: 24rem; inline-size: 320px; position: relative;'>
        <SessionShell @instanceId='sales' @closedLabel='Open sales chat' />
      </div>
    </div>
  </template>
}

<template><MultiInstanceDemo /></template>
```

## Design notes

- **One injection point.** `SessionShell` is the only component in this
  family that injects `carbon.ai-chat-session` — everything it renders
  receives session state as ordinary `@arg`s, matching AGENTS.md's "React
  context → a service, or the parent component instance yielded down to
  children" convention rather than threading the service through every
  descendant.
- **`<:workspace>` is yielded outward**, left entirely for the caller to fill
  in — that panel has no built-in assembly. A filler that needs the same
  session this shell drives resolves it with the same `@instanceId`.
- **`<:history>` has a built-in default**: passing `@historyItems` (plus the
  optional `@selectedHistoryItemId`/`@onHistoryItem*` callbacks) renders a
  real `ai-chat/chat-history` assembly with no extra wiring; passing a
  `<:history>` block instead overrides it completely. The item *list* is
  always host-owned (matching upstream's own `customLoadHistory` boundary —
  this service tracks one live conversation, not a list of past ones); only
  the panel's open/close chrome and "new chat" action are session-owned. See
  AGENTS.md's "Persistence and the `chat-history` integration" section.
- **Cancellation.** `cancelStreaming()` aborts the response's
  `AbortSignal` (`getAbortSignal()`), marks the message no longer
  streaming/`cancelled`, and permanently drops any further `appendChunk()`
  call for that response id — a host's in-flight streaming loop can still
  be mid-`await` when cancellation happens. `response_id`/`item_id`
  aliasing (upstream's `StreamingTracker`) is deliberately not ported —
  this session has no wire protocol with a second id to resolve.
- **`@instanceId` resolves which `ChatSession` this shell drives** (see
  "Multiple independent instances" above) — the Ember equivalent of
  upstream's `NamespaceService`. Omit it for a single-widget page.
- **`enablePersistence()`** opts a session into storage-backed rehydration
  (`window.sessionStorage` by default, matching upstream's own
  `UserSessionStorageService` choice — see AGENTS.md for why not
  `localStorage`). Off by default; call it once (e.g. from a host
  component's constructor, as the demo above does) to turn it on.
- **Scope cuts**, documented in full in AGENTS.md's "Porting Carbon AI Chat"
  → "Orchestration layer" section: human-agent handoff, custom panels, and
  most of upstream's ~50 Redux action types are not ported in this first
  pass — only message send/receive, streaming chunk append + cancellation,
  panel open state, multi-instance isolation, persistence, and a minimal
  `on()`/`off()`/`emit()` event bus.

## API Reference

<details>
<summary><h3>SessionShell</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/session-shell'
    @name='default'
  />
</template>
```
</details>
