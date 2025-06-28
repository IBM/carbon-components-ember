<ThemeSwitcher />

# Checkbox

Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.

```gjs live preview
import { fn } from '@ember/helper';
import { Accordion, Checkbox, RadioGroup } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const eq = (a, b) => a === b;

<template>
    <ThemeSupport />
    {{#let (newObj) as |context|}}
        <Checkbox
            @disabled={{true}}
            @checked={{true}}
            @onChange={{fn (set context 'checked')}}
            @label='disabled'
        />
        <Checkbox
            @disabled={{true}}
            @checked={{false}}
            @onChange={{fn (set context 'checked')}}
            @label='disabled and not checked'
        />
        <Checkbox
            @checked={{context.checked}}
            @onChange={{fn (set context 'checked')}}
        >
            Label in block
        </Checkbox>
        <p>
            checked:
            {{context.checked}}
        </p>
    {{/let}}
</template>
```
## API Reference

<details>
<summary><h3>Checkbox</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/checkbox' 
    @name='default' 
  />
</template>
```
</details>
