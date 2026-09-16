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

Producing an assistant reply is left to the host application, matching
upstream's own `customSendMessage` boundary — the demo below listens for the
service's `'send'` event and calls `receive()`/`appendChunk()`/
`finalizeStreaming()` itself, simulating a streamed response. It also checks
`getAbortSignal()` between chunks, so clicking the "Stop generating" button
that appears while streaming (wired to `cancelStreaming()`) actually breaks
the host's own reply loop, not just the service's internal bookkeeping.

```gjs live preview
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { SessionShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const REPLY = 'This is a simulated streamed reply from the host application.';

class SessionShellDemo extends Component {
  @service('carbon.ai-chat-session') sessions;

  // No @instanceId is passed to <SessionShell /> below, so it resolves the
  // registry's default session - the same one .default resolves here.
  get session() {
    return this.sessions.default;
  }

  constructor(owner, args) {
    super(owner, args);
    // The service is an app-wide singleton, so a remount must reset it
    // before reseeding, and must unregister its own listener on teardown -
    // on()/off() are manual by design (matching upstream's instance.on/off),
    // so any consumer registering a handler owns cleaning it up.
    this.session.restart();
    this.session.receive('Hello! How can I help?');
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

  <template>
    <ThemeSupport />
    <div style='block-size: 32rem; max-inline-size: 400px; position: relative;'>
      <SessionShell @closedLabel='Open chat' @messagesAriaLabel='Chat messages' />
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
- **`<:history>`/`<:workspace>` are yielded outward**, left for the caller to
  fill in (e.g. the `ai-chat/chat-history` family) rather than this
  component owning that content directly. A filler that needs the same
  session this shell drives resolves it with the same `@instanceId`.
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
- **Scope cuts**, documented in full in AGENTS.md's "Porting Carbon AI Chat"
  → "Orchestration layer" section: human-agent handoff, persistence/
  rehydration, custom panels, and most of upstream's ~50 Redux action types
  are not ported in this first pass — only message send/receive, streaming
  chunk append + cancellation, panel open state, multi-instance isolation,
  and a minimal `on()`/`off()`/`emit()` event bus.

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
