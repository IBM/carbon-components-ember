<ThemeSwitcher />

# ChatHistoryHeader

Title bar for a [`ChatHistory`](./chat-history.md)'s `header` block, with an
optional close button.

```gjs live preview
import { ChatHistoryHeader } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ closed: false });
const handleClose = () => (context.closed = true);

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryHeader @headerTitle='Chats' @showCloseAction={{true}} @onClose={{handleClose}} />
    <p>closed: {{context.closed}}</p>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryHeader</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-header'
    @name='default'
  />
</template>
```
</details>
