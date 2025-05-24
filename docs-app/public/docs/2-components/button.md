# Button

<ThemeSwitcher />


```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Button, Checkbox, Input } from 'carbon-components-ember/components';
import { set, newObj } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { not, eq } from 'ember-truth-helpers';

function doSomething() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

<template>
  <ThemeSupport />
  <br>
    {{#let (newObj) as |context|}}
        <Button
            @type='primary'
            @onClick={{fn (set context 'clicked') true}}
        >
            Primary Button
        </Button>
        <br>
        <br>
        <Button
            @type='primary'
            @ghost={{true}}
            @onClick={{fn (set context 'clicked') true}}
        >
            Ghost Button
        </Button>
        <br>
        <br>
        <Button
            @type='primary'
            @tertiary={{true}}
            @onClick={{fn (set context 'clicked') true}}
        >
            Tertiary Button
        </Button>
        <br>
        <br>
        <Button
            @type='secondary'
            @size='sm'
            @onClick={{fn (set context 'clicked') true}}
        >
            Secondary Small Button
        </Button>
        <br>
        <br>
        <Button @type='primary' @size='xl' @onClick={{doSomething}}>
            Button with loading indicator if onClick returns a promise
        </Button>
    {{/let}}
</template>
```


## API Reference

<details>
<summary><h3>Button</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/button' 
    @name='default' 
  />
</template>
```
</details>
