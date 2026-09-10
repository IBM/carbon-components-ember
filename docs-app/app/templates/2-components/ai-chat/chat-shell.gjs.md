<ThemeSwitcher />

# ChatShell

`ChatShell` is the layout shell for a
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat)
window — header, message history, input, and optional history/workspace side
panels. Content is supplied entirely through named blocks; `ChatShell` itself
owns no conversation state.

`@showHistory`/`@showWorkspace` are always-controlled booleans — there is no
uncontrolled/default-open variant, matching upstream's own API.

```gjs live preview
import { Button, ChatShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ showHistory: false, showWorkspace: false });

const toggleHistory = () => {
  context.showHistory = !context.showHistory;
};

const toggleWorkspace = () => {
  context.showWorkspace = !context.showWorkspace;
};

<template>
  <ThemeSupport />
  <Button @size='sm' @onClick={{toggleHistory}}>Toggle history</Button>
  <Button @size='sm' @onClick={{toggleWorkspace}}>Toggle workspace</Button>
  <br />
  <br />
  <div style='block-size: 28rem; max-inline-size: 480px;'>
    <ChatShell
      @showHistory={{context.showHistory}}
      @showWorkspace={{context.showWorkspace}}
      @messagesAriaLabel='Chat messages'
      @historyAriaLabel='Conversation history'
      @workspaceAriaLabel='Workspace panel'
    >
      <:header><strong style='padding-inline-start: 1rem;'>Assistant</strong></:header>
      <:history>
        <p style='padding: 1rem;'>Conversation history goes here.</p>
      </:history>
      <:workspace>
        <p style='padding: 1rem;'>Workspace content goes here.</p>
      </:workspace>
      <:messages>
        <p style='padding: 1rem;'>Hello! How can I help?</p>
      </:messages>
      <:input>
        <p style='padding: 1rem;'>Type a message…</p>
      </:input>
    </ChatShell>
  </div>
</template>
```

## Rounded corners and framing

`@cornerAll` (and the individual `@cornerStartStart`/`@cornerStartEnd`/
`@cornerEndStart`/`@cornerEndEnd` overrides) control the shell's corner
style, and `@showFrame={{false}}` drops the outer border/shadow entirely —
useful when the shell is embedded inside a page that already provides its
own frame.

```gjs live preview
import { ChatShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 1rem; flex-wrap: wrap;'>
    <div style='block-size: 12rem; inline-size: 16rem;'>
      <ChatShell @cornerAll='round' @aiEnabled={{true}}>
        <:header>Rounded, AI-themed</:header>
        <:messages>Content</:messages>
      </ChatShell>
    </div>
    <div style='block-size: 12rem; inline-size: 16rem;'>
      <ChatShell @showFrame={{false}}>
        <:header>Frameless</:header>
        <:messages>Content</:messages>
      </ChatShell>
    </div>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatShell</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-shell'
    @name='default'
  />
</template>
```
</details>
