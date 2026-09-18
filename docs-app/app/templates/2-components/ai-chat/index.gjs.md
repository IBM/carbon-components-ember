<ThemeSwitcher />

# AI Chat

This addon ports [Carbon's AI Chat](https://www.npmjs.com/package/@carbon/ai-chat)
to Ember: a family of presentational components — [`Launcher`](./launcher.md),
[`ChatShell`](./chat-shell.md), [`PromptLineShell`](./prompt-line-shell.md),
[`PromptLine`](./prompt-line.md), [`Processing`](./processing.md), message
content components, and more — plus [`SessionShell`](./session-shell.md), the
orchestration container that wires them all up to a `carbon.ai-chat-session`
service. `SessionShell` is the entry point most consumers should start from.

## Full demo app

For a larger, standalone assembly of this family — a full-window layout with
custom response types, writeable-element content, and a custom workspace
panel, plus a corner-anchored floating launcher, both backed by independent,
persisted chat sessions — see the
[full Carbon AI Chat demo app](../../ai-chat-demo), comparable in scope to
upstream's own
[`demo/` package](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/demo).

```gjs live preview
import { Link } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <Link @href='../../ai-chat-demo' @size='lg'>
    Open the full demo →
  </Link>
</template>
```
