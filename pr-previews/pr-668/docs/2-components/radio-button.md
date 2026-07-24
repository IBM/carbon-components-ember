<ThemeSwitcher />

# RadioButton

Radio buttons are used when there is a list of two or more options that are mutually exclusive and the user must select exactly one choice.

```gjs live preview
import { RadioButton, RadioButtonGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const update = (value) => {
  context.checked = value;
}

const updateSelected = (value) => {
  context.selected = value;
}

<template>
    <ThemeSupport />
    <br />
    <RadioButton @checked={{false}} @labelText="radio" />
    <br/>
    <RadioButton @checked={{true}} @labelText="radio is checked" />
    <br/>
    <RadioButton @checked={{context.checked}} @onChange={{update}} @labelText="click me" />
    <br/>
    is checked: {{context.checked}}
    <br/>
    <RadioButton @disabled={{true}} @labelText="disabled" />
    <br/>
    <RadioButtonGroup @legendText="Radio button group" as |Radio|>
        <Radio @value="option-1" @defaultChecked={{true}} @labelText="Option 1 is default" />
        <Radio @value="option-2" @labelText="Option 2" />
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup @legendText="Vertical group" @orientation="vertical" as |Radio|>
        <Radio @value="option-1" @defaultChecked={{true}} @labelText="Vertical option 1 is default" />
        <Radio @value="option-2" @labelText="Option 2" />
    </RadioButtonGroup>
    <br/>
    selected: {{context.selected}}
    <br/>
    <RadioButtonGroup @onChange={{updateSelected}} @orientation="vertical">
      <:heading>Radio button group with a custom heading</:heading>
      <:default as |Radio|>
        <Radio @value="a" @labelText="Option A" />
        <Radio @value="b" @labelText="Option B" />
      </:default>
    </RadioButtonGroup>
</template>
```

## API Reference

<details>
<summary><h3>RadioButton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/radio-button'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>RadioButtonGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/radio-button/group'
    @name='default'
  />
</template>
```
</details>
