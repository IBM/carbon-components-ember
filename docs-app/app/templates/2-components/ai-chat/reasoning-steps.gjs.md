<ThemeSwitcher />

# ReasoningSteps

`ReasoningSteps` and its yielded `ReasoningStep` render a collapsible list of
model-reasoning steps for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat) —
the same disclosure shape as `ChainOfThought`, but without step numbering or
status icons.

```gjs live preview
import { ReasoningSteps } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <ReasoningSteps @open={{true}} as |Step|>
    <Step @title='Considering the question'>
      Breaking the request down into smaller parts.
    </Step>
    <Step @title='Checking for edge cases'>
      Verifying assumptions before answering.
    </Step>
  </ReasoningSteps>
</template>
```

## Controlled steps

Passing `@controlled={{true}}` to `ReasoningSteps` propagates `@controlled`
to every yielded step: each step's own `@open` becomes the sole source of
truth, and a click only calls `@onToggle`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { ReasoningSteps } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked open = false;

  toggle = (next) => {
    this.open = next;
  };

  <template>
    <ThemeSupport />
    <ReasoningSteps @open={{true}} @controlled={{true}} as |Step|>
      <Step @title='Controlled step' @open={{this.open}} @onToggle={{this.toggle}}>
        This step's visibility is fully owned by the host application.
      </Step>
    </ReasoningSteps>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>ReasoningSteps</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/reasoning-steps'
    @name='default'
  />
</template>
```
</details>
