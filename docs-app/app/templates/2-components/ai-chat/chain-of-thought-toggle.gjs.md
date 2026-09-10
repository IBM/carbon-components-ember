<ThemeSwitcher />

# ChainOfThoughtToggle

A standalone disclosure button for a `ChainOfThought` panel. Upstream keeps
the two components DOM-decoupled (they only agree via `@panelId`/
`aria-controls`), so this port does too — wire `@onToggle` to whatever
should happen, typically setting a `ChainOfThought`'s own `@open`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { ChainOfThought, ChainOfThoughtToggle } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked open = false;

  toggle = (next) => {
    this.open = next;
  };

  <template>
    <ThemeSupport />
    <ChainOfThoughtToggle @open={{this.open}} @panelId='cot-panel' @onToggle={{this.toggle}} />
    <ChainOfThought @open={{this.open}} @panelId='cot-panel' as |Step|>
      <Step @title='Searching the web' @stepNumber={{1}}>Found 3 results.</Step>
    </ChainOfThought>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>ChainOfThoughtToggle</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chain-of-thought-toggle'
    @name='default'
  />
</template>
```
</details>
