<ThemeSwitcher />

# Launcher

`Launcher` is the floating button that opens a
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat)
window. It's stateless — it always renders its "open chat" appearance and
fires `@onToggle` on click. The host application owns whether the chat
window is open, and decides whether to keep rendering this button, swap it
for a close button, or render [`ChatShell`](./chat-shell.md) instead.

```gjs live preview
import { Launcher } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ clicks: 0 });

const handleToggle = () => {
  context.clicks = context.clicks + 1;
};

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 2rem; align-items: flex-end; flex-wrap: wrap;'>
    <Launcher @closedLabel='Open chat' @onToggle={{handleToggle}} />
    <Launcher
      @closedLabel='Open chat'
      @unreadMessageCount={{3}}
      @unreadLabel='3 unread messages'
      @onToggle={{handleToggle}}
    />
    <Launcher
      @closedLabel='Open chat'
      @showUnreadIndicator={{true}}
      @onToggle={{handleToggle}}
    />
    <Launcher
      @closedLabel='Open AI chat'
      @aiEnabled={{true}}
      @tooltipPosition='left'
      @onToggle={{handleToggle}}
    />
  </div>
  <br />
  toggled: {{context.clicks}} time(s)
</template>
```

## API Reference

<details>
<summary><h3>Launcher</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/launcher'
    @name='default'
  />
</template>
```
</details>
