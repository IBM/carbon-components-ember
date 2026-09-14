<ThemeSwitcher />

# ChatHistoryPanelItems

Plain list wrapper (`role='list'`) for a
[`ChatHistoryPanel`](./chat-history-panel.md)'s items - yields both
[`ChatHistoryPanelItem`](./chat-history-panel-item.md) and
[`ChatHistoryPanelMenu`](./chat-history-panel-menu.md) pre-bound with
`@showActions`, so top-level items and collapsible groups can be mixed
directly in the default block. Usually obtained via `ChatHistoryPanel`'s
yielded block param rather than imported directly.

```gjs live preview
import { ChatHistoryPanelItems } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <ChatHistoryPanelItems as |Item Menu|>
      <Item @id='chat-1' @name='Trip planning' @selected={{true}} />
      <Menu @title='Yesterday' as |NestedItem|>
        <NestedItem @id='chat-2' @name='Recipe ideas' />
      </Menu>
    </ChatHistoryPanelItems>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>ChatHistoryPanelItems</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history-panel-items'
    @name='default'
  />
</template>
```
</details>
