<ThemeSwitcher />

# ChatHistoryPanelItemInput

Rename input swapped in for a
[`ChatHistoryPanelItem`](./chat-history-panel-item.md) while `@rename` is
set: a text field plus cancel/save icon buttons, auto-focused and selected
on mount. Saves/cancels on Enter/Escape, and on blur.

```gjs live preview
import { ChatHistoryPanelItemInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ result: '(none yet)' });
const handleSave = (value) => (context.result = `saved "${value}"`);
const handleCancel = () => (context.result = 'canceled');

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryPanelItemInput @value='Trip planning' @onSave={{handleSave}} @onCancel={{handleCancel}} />
  </div>
  <p>result: {{context.result}}</p>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryPanelItemInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-panel-item-input'
    @name='default'
  />
</template>
```
</details>
