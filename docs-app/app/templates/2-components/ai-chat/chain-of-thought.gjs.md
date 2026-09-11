<ThemeSwitcher />

# ChainOfThought

`ChainOfThought` and its yielded `ChainOfThoughtStep` render a collapsible
list of tool-call-style steps for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
The container's own `@open` toggles the whole panel; each step toggles
independently and shows a status icon (success/failure/processing).

```gjs live preview
import { ChainOfThought } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <ChainOfThought @open={{true}} as |Step|>
    <Step @title='Searching the web' @stepNumber={{1}} @status='success'>
      Found 3 relevant results.
    </Step>
    <Step @title='Reading documentation' @stepNumber={{2}} @status='processing'>
      Still working...
    </Step>
    <Step @title='Summarizing findings' @stepNumber={{3}} @status='failure'>
      Ran out of context.
    </Step>
  </ChainOfThought>
</template>
```

## Static (non-interactive) steps

A step with no body content renders a static, non-clickable header instead
of a disclosure button.

```gjs live preview
import { ChainOfThought } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <ChainOfThought @open={{true}} as |Step|>
    <Step @title='Planning' @stepNumber={{1}} />
  </ChainOfThought>
</template>
```

## Controlled steps

Passing `@controlled={{true}}` to `ChainOfThought` propagates `@controlled`
to every yielded step: each step's own `@open` becomes the sole source of
truth, and a click only calls `@onToggle` without changing anything itself.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { ChainOfThought } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked open = false;

  toggle = (next) => {
    this.open = next;
  };

  <template>
    <ThemeSupport />
    <ChainOfThought @controlled={{true}} as |Step|>
      <Step @title='Controlled step' @open={{this.open}} @onToggle={{this.toggle}}>
        This step's visibility is fully owned by the host application.
      </Step>
    </ChainOfThought>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>ChainOfThought</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chain-of-thought'
    @name='default'
  />
</template>
```
</details>
