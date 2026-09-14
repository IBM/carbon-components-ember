<ThemeSwitcher />

# ChatHistoryContent

Scroll container for a [`ChatHistoryPanel`](./chat-history-panel.md) (or a
[`ChatHistoryLoading`](./chat-history-loading.md)), showing an optional
live-announced results count above the list.

```gjs live preview
import { ChatHistoryContent } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem; block-size: 8rem;'>
    <ChatHistoryContent @resultsCount={{3}}>
      <p style='padding-inline-start: 1rem;'>list content goes here</p>
    </ChatHistoryContent>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryContent</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-content'
    @name='default'
  />
</template>
```
</details>
