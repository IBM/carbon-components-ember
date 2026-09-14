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
`finalizeStreaming()` itself, simulating a streamed response.

```gjs live preview
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { SessionShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const REPLY = 'This is a simulated streamed reply from the host application.';

class SessionShellDemo extends Component {
  @service('carbon.ai-chat-session') session;

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
    const words = REPLY.split(' ');
    for (const [index, word] of words.entries()) {
      await new Promise((resolve) => setTimeout(resolve, 60));
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

## Design notes

- **One injection point.** `SessionShell` is the only component in this
  family that injects `carbon.ai-chat-session` — everything it renders
  receives session state as ordinary `@arg`s, matching AGENTS.md's "React
  context → a service, or the parent component instance yielded down to
  children" convention rather than threading the service through every
  descendant.
- **`<:history>`/`<:workspace>` are yielded outward**, left for the caller to
  fill in (e.g. the `ai-chat/chat-history` family) rather than this
  component owning that content directly.
- **Scope cuts**, documented in full in AGENTS.md's "Porting Carbon AI Chat"
  → "Orchestration layer" section: human-agent handoff, persistence/
  rehydration, custom panels, multi-instance namespacing, and most of
  upstream's ~50 Redux action types are not ported in this first pass — only
  message send/receive, streaming chunk append, panel open state, and a
  minimal `on()`/`off()`/`emit()` event bus.

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
