<ThemeSwitcher />

# ReasoningStepsToggle

A standalone disclosure button for a `ReasoningSteps` panel, DOM-decoupled
from it (same as `ChainOfThoughtToggle`/`ChainOfThought`).

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { ReasoningSteps, ReasoningStepsToggle } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked open = false;

  toggle = (next) => {
    this.open = next;
  };

  <template>
    <ThemeSupport />
    <ReasoningStepsToggle @open={{this.open}} @panelId='rs-panel' @onToggle={{this.toggle}} />
    <ReasoningSteps @open={{this.open}} id='rs-panel' as |Step|>
      <Step @title='Considering the question'>
        Breaking the request down into smaller parts.
      </Step>
    </ReasoningSteps>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>ReasoningStepsToggle</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/reasoning-steps-toggle'
    @name='default'
  />
</template>
```
</details>
