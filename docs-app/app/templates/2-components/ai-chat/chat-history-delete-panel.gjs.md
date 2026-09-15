<ThemeSwitcher />

# ChatHistoryDeletePanel

Confirmation overlay for deleting a chat history item, typically absolutely
positioned over a [`ChatHistoryPanel`](./chat-history-panel.md).

```gjs live preview
import { ChatHistoryDeletePanel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ result: '(none yet)' });
const handleCancel = () => (context.result = 'canceled');
const handleConfirm = (detail) => (context.result = `deleted ${detail.itemId}`);

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem; block-size: 10rem; position: relative; border: 1px solid var(--cds-border-subtle, #e0e0e0);'>
    <ChatHistoryDeletePanel @itemId='chat-1' @onCancel={{handleCancel}} @onConfirm={{handleConfirm}}>
      <:title>Delete "Trip planning"?</:title>
      <:description>This chat will be permanently deleted.</:description>
    </ChatHistoryDeletePanel>
  </div>
  <p>result: {{context.result}}</p>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryDeletePanel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-delete-panel'
    @name='default'
  />
</template>
```
</details>
