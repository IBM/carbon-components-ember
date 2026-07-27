<ThemeSwitcher />

# NumberInput

NumberInput allows the user to enter a number, and to increment/decrement the value using stepper buttons.

```gjs live preview
import { NumberInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const update = (value) => {
  context.value = value;
}

<template>
    <ThemeSupport />
    <NumberInput @label="Quantity" @helperText="Optional" />
    <br />
    <NumberInput @label="Controlled" @value={{context.value}} @onChange={{update}} />
    <br/>
    value: {{context.value}}
    <br />
    <NumberInput @label="Small" @size="sm" />
    <br />
    <NumberInput @label="Large" @size="lg" />
    <br />
    <NumberInput @label="Min/max" @min={{0}} @max={{10}} @defaultValue={{5}} @helperText="Between 0 and 10" />
    <br />
    <NumberInput @label="Step by 5" @step={{5}} @defaultValue={{10}} />
    <br />
    <NumberInput @label="Without steppers" @hideSteppers={{true}} />
    <br />
    <NumberInput @label="Invalid" @defaultValue={{20}} @max={{10}} @invalidText="Value must be 10 or less" />
    <br />
    <NumberInput @label="Warning" @warn={{true}} @warnText="This value may cause issues" />
    <br />
    <NumberInput @label="Disabled" @disabled={{true}} @defaultValue={{42}} />
    <br />
    <NumberInput @label="Read-only" @readOnly={{true}} @defaultValue={{42}} />
</template>
```

## API Reference

<details>
<summary><h3>NumberInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/number-input'
    @name='default'
  />
</template>
```
</details>
