<ThemeSwitcher />

# ChatShell

`ChatShell` is the layout shell for a
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat)
window — header, message history, input, and optional history/workspace side
panels. Content is supplied entirely through named blocks; `ChatShell` itself
owns no conversation state.

`@showHistory`/`@showWorkspace` are always-controlled booleans — there is no
uncontrolled/default-open variant, matching upstream's own API.

The `input` block is entirely caller-supplied too — `ChatShell` doesn't own a
text field or send button. Upstream's actual prompt input is a separate
`prompt-line` component that hasn't been ported yet, so the demo below wires
up a plain `TextInput` + `Button` instead, just to show a real, typeable
input rather than static placeholder text.

```gjs live preview
import { Button, ChatShell, TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject, trackedArray } from '@ember/reactive/collections';

const state = trackedObject({ showHistory: false, showWorkspace: false, draft: '' });
const messages = trackedArray(['Hello! How can I help?']);

const toggleHistory = () => {
  state.showHistory = !state.showHistory;
};

const toggleWorkspace = () => {
  state.showWorkspace = !state.showWorkspace;
};

const updateDraft = (value) => {
  state.draft = value;
};

const send = () => {
  if (!state.draft.trim()) return;
  messages.push(state.draft);
  state.draft = '';
};

<template>
  <ThemeSupport />
  <Button @size='sm' @onClick={{toggleHistory}}>Toggle history</Button>
  <Button @size='sm' @onClick={{toggleWorkspace}}>Toggle workspace</Button>
  <br />
  <br />
  <div style='block-size: 28rem; max-inline-size: 480px;'>
    <ChatShell
      @showHistory={{state.showHistory}}
      @showWorkspace={{state.showWorkspace}}
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
        {{#each messages as |message|}}
          <p style='padding: 0.5rem 1rem;'>{{message}}</p>
        {{/each}}
      </:messages>
      <:input>
        <div style='display: flex; gap: 0.5rem; align-items: flex-end; padding: 1rem;'>
          <TextInput
            @labelText='Message'
            @hideLabel={{true}}
            @placeholder='Type a message…'
            @value={{state.draft}}
            @onChange={{updateDraft}}
          />
          <Button @size='sm' @onClick={{send}}>Send</Button>
        </div>
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
