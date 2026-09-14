<ThemeSwitcher />

# ChatHistoryPanelItem

A single chat history entry: a selectable row with a name and an
overflow-actions menu, or (when `@rename` is set) swapped for a
[`ChatHistoryPanelItemInput`](./chat-history-panel-item-input.md). Usually
obtained via [`ChatHistoryPanelItems`](./chat-history-panel-items.md)'s or
[`ChatHistoryPanelMenu`](./chat-history-panel-menu.md)'s yielded block param
rather than imported directly - see [`ChatHistory`](./chat-history.md) for a
fuller, interactive example wiring rename/delete together.

```gjs live preview
import { array, hash } from '@ember/helper';
import { ChatHistoryPanelItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';
import { Edit, TrashCan } from 'carbon-components-ember/icons';

const context = trackedObject({ selected: '(none yet)' });
const handleSelect = (detail) => (context.selected = detail.itemName);

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryPanelItem
      @id='chat-1'
      @name='Trip planning'
      @selected={{true}}
      @showActions={{true}}
      @actions={{array (hash text='Rename' icon=Edit) (hash text='Delete' icon=TrashCan delete=true divider=true)}}
      @onSelect={{handleSelect}}
    />
  </div>
  <p>selected: {{context.selected}}</p>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryPanelItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-panel-item'
    @name='default'
  />
</template>
```
</details>
