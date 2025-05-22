<ThemeSwitcher />

# Toggle

```gjs live preview
import { Toggle } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';
import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
const context = new TrackedObject({});

<template>
    <ThemeSupport />
    <br>
    <Toggle @name='toggle is off' @value={{false}} /><br>
    <Toggle @name='toggle is on' @value={{true}} /><br>
    <Toggle @name='toggle is disabled' @disabled={{true}} /><br>
    <Toggle @name='toggle is readonly' @readonly={{true}} /><br>
    <Toggle
      @name='toggle with click'
      @value={{context.checked}}
      @onChange={{fn (mut context.checked) (not context.checked)}}
    />
</template>
```

## API Reference

<details>
<summary><h3>Toggle</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/toggle' 
    @name='default' 
  />
</template>
```
</details>
