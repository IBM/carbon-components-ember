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


```gjs live preview
import { Checkbox } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { TrackedObject } from 'tracked-built-ins';

const eq = (a, b) => a === b;
const state = new TrackedObject();

<template>
    <Checkbox
        @checked={{eq state.type 'primary'}}
        @onChange={{fn (set state 'type') 'primary'}}
    >
        Primary
    </Checkbox>
    <Checkbox
        @checked={{eq state.type 'secondary'}}
        @onChange={{fn (set state 'type') 'secondary'}}
    >
        Secondary
    </Checkbox>
    <Checkbox
        @checked={{eq state.type 'danger'}}
        @onChange={{fn (set state 'type') 'danger'}}
    >
        Is Danger
    </Checkbox>
    <Checkbox
        @checked={{state.isSmall}}
        @onChange={{fn (set state 'isSmall') (not state.isSmall)}}
    >
        Is Small
    </Checkbox>
    <Checkbox
        @checked={{state.isTertiary}}
        @onChange={{fn
        (set state 'isTertiary')
        (not state.isTertiary)
    }}
    >
        Is Tertiary
    </Checkbox>
    <Checkbox
        @checked={{state.isDisabled}}
        @onChange={{fn
        (set state 'isDisabled')
        (not state.isDisabled)
    }}
    >
        Is Disabled
    </Checkbox>
    <label for='confirm-text'>
        Confirm Text
    </label>
    <Input
        id='confirm-text'
        {{! template-lint-disable }}
        @onChange={{fn (set state 'confirmText')}}
        @value={{state.confirmText}}
    />
    
        <Button
            @disabled={{state.isDisabled}}
            @type={{state.type}}
            @tertiary={{state.isTertiary}}
            @size='sm'
            @onClick={{fn (set state 'clicked') true}}
            @bubbles={{state.bubbles}}
            @confirmText={{state.confirmText}}
        >
            Button Text
        </Button>
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
