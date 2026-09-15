<ThemeSwitcher />

# ChatHistoryPanelMenu

A collapsible group of [`ChatHistoryPanelItem`](./chat-history-panel-item.md)s
(e.g. "Today", "Yesterday"), rendered inside a
[`ChatHistoryPanelItems`](./chat-history-panel-items.md). Uncontrolled by
default (starts expanded, toggles itself on click); pass `@expanded` +
`@onToggle` together for a fully controlled group.

```gjs live preview
import { ChatHistoryPanelMenu } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryPanelMenu @title='Yesterday' as |Item|>
      <Item @id='chat-1' @name='Trip planning' />
      <Item @id='chat-2' @name='Recipe ideas' />
    </ChatHistoryPanelMenu>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryPanelMenu</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-panel-menu'
    @name='default'
  />
</template>
```
</details>
