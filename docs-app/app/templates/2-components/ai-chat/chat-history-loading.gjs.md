<ThemeSwitcher />

# ChatHistoryLoading

Loading placeholder rendered inside a
[`ChatHistoryContent`](./chat-history-content.md) while chat history is
being fetched: four short skeleton lines followed by four two-line skeleton
paragraphs.

```gjs live preview
import { ChatHistoryContent, ChatHistoryLoading } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem; block-size: 20rem;'>
    <ChatHistoryContent>
      <ChatHistoryLoading />
    </ChatHistoryContent>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryLoading</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-loading'
    @name='default'
  />
</template>
```
</details>
