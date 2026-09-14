<ThemeSwitcher />

# ChatHistoryPanel

A `cds--side-nav`-styled panel listing chat history items, yielding
[`ChatHistoryPanelItems`](./chat-history-panel-items.md) pre-bound with
`@showActions`. Typically rendered inside a
[`ChatHistoryContent`](./chat-history-content.md), itself inside
[`ChatHistory`](./chat-history.md)'s `content` block - see that page for a
fuller, interactive example.

```gjs live preview
import { ChatHistoryPanel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem; block-size: 10rem;'>
    <ChatHistoryPanel as |Items|>
      <Items as |Item|>
        <Item @id='chat-1' @name='Trip planning' @selected={{true}} />
        <Item @id='chat-2' @name='Recipe ideas' />
      </Items>
    </ChatHistoryPanel>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryPanel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-panel'
    @name='default'
  />
</template>
```
</details>
