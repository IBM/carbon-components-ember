<ThemeSwitcher />

# ChatHistoryToolbar

Toolbar for a [`ChatHistory`](./chat-history.md)'s `toolbar` block: an
optional search field, plus a "new chat" icon button.

```gjs live preview
import { ChatHistoryToolbar } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ search: '', newChats: 0 });
const handleSearch = (value) => (context.search = value);
const handleNewChat = () => (context.newChats = context.newChats + 1);

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryToolbar @onSearch={{handleSearch}} @onNewChat={{handleNewChat}} />
    <p>search: "{{context.search}}", new chats clicked: {{context.newChats}}</p>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryToolbar</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-toolbar'
    @name='default'
  />
</template>
```
</details>
