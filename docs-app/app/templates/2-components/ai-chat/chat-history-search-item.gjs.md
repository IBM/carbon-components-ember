<ThemeSwitcher />

# ChatHistorySearchItem

A single search-result row (name + date), typically rendered while a
[`ChatHistoryToolbar`](./chat-history-toolbar.md)'s search field has an
active query.

```gjs live preview
import { ChatHistorySearchItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ selected: '(none yet)' });
const handleSelect = (detail) => (context.selected = detail.itemName);

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistorySearchItem @id='chat-1' @name='Trip planning' @date='Sep 12' @onSelect={{handleSelect}} />
    <ChatHistorySearchItem @id='chat-2' @name='Recipe ideas' @date='Sep 10' @onSelect={{handleSelect}} />
  </div>
  <p>selected: {{context.selected}}</p>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistorySearchItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-search-item'
    @name='default'
  />
</template>
```
</details>
