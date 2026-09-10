<ThemeSwitcher />

# AiChatCardSteps

`AiChatCardSteps` renders a vertical list of steps — e.g. an agent's
reasoning or progress trail — for use inside an
[`AiChatCard`](./card.md)'s `<:body>` block. Each step's `kind` is one of
`IconIndicator`'s kinds (`'failed'`, `'caution-major'`, `'caution-minor'`,
`'undefined'`, `'succeeded'`, `'normal'`, `'in-progress'`, `'incomplete'`,
`'not-started'`, `'pending'`, `'unknown'`, `'informative'`); `'in-progress'`
renders a spinner instead of an icon. A step with no `kind` renders only its
`label`.

```gjs live preview
import { AiChatCard, AiChatCardSteps } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const steps = [
  { title: 'Understanding request', kind: 'succeeded' },
  {
    title: 'Searching knowledge base',
    description: 'Checking 12 sources',
    kind: 'in-progress',
    label: 'Running',
  },
  { title: 'Drafting response', kind: 'not-started' },
  { title: 'Plain step with no indicator' },
];

<template>
  <ThemeSupport />
  <AiChatCard style='max-inline-size: 24rem;'>
    <:header><h5>Agent progress</h5></:header>
    <:body>
      <AiChatCardSteps @steps={{steps}} />
    </:body>
  </AiChatCard>
</template>
```

## API Reference

<details>
<summary><h3>AiChatCardSteps</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/card-steps'
    @name='default'
  />
</template>
```
</details>
