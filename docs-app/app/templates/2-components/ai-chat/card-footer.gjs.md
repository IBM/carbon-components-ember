<ThemeSwitcher />

# AiChatCardFooter

`AiChatCardFooter` renders a row of action buttons for an
[`AiChatCard`](./card.md)'s `<:footer>` block, driven entirely by an
`@actions` array rather than yielded content. When every action's `label`
is empty, it switches to a row of icon-only ghost buttons instead of
labeled buttons — matching upstream's own derivation. Each action's `kind`
maps onto this addon's `Button` component (`'primary'`, `'secondary'`,
`'tertiary'`, `'ghost'`, or `'danger'`); `@onAction` is called with the
clicked action whenever a button is pressed.

```gjs live preview
import { AiChatCard, AiChatCardFooter } from 'carbon-components-ember/components';
import { Edit, TrashCan } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ last: '(none yet)' });

const handleAction = (action) => {
  context.last = action.label || action.id;
};

const labeledActions = [
  { id: 'accept', label: 'Accept', kind: 'primary' },
  { id: 'reject', label: 'Reject', kind: 'secondary' },
];

const iconActions = [
  { id: 'edit', label: '', icon: Edit, tooltipText: 'Edit' },
  { id: 'delete', label: '', icon: TrashCan, tooltipText: 'Delete', kind: 'danger' },
];

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 1rem; flex-wrap: wrap;'>
    <AiChatCard style='max-inline-size: 18rem;'>
      <:header><h5>Confirm action</h5></:header>
      <:body>Do you want to proceed?</:body>
      <:footer>
        <AiChatCardFooter @actions={{labeledActions}} @onAction={{handleAction}} />
      </:footer>
    </AiChatCard>
    <AiChatCard style='max-inline-size: 18rem;'>
      <:header><h5>Icon actions</h5></:header>
      <:body>Actions with no label render as icon-only buttons.</:body>
      <:footer>
        <AiChatCardFooter @actions={{iconActions}} @onAction={{handleAction}} />
      </:footer>
    </AiChatCard>
  </div>
  <br />
  last action: {{context.last}}
</template>
```

## API Reference

<details>
<summary><h3>AiChatCardFooter</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/card-footer'
    @name='default'
  />
</template>
```
</details>
