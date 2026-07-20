<ThemeSwitcher />

# Radio

```gjs live preview
import { Radio, RadioButtonGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const update = (radio) => {
  context.checked = true;
}

const updateSelected = (s) => {
  context.selected = s;
}

<template>
    <ThemeSupport />
    <br />
    <Radio @isChecked={{false}} @labelText="radio" ></Radio> <br/>
    <Radio @isChecked={{true}} @labelText="radio is checked" /> <br/>
    <Radio @isChecked={{context.checked}} @onChange={{update}} @labelText="click me"/> <br/>
      is selected: {{context.checked}}
    <br/>
    <RadioButtonGroup @legendText="Radio button group" as |Radio|>
        <Radio @labelText="option 1 is default" @isDefault={{true}} />
        <Radio @labelText="option 2"/>
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup
      @legendText="Vertical group"
      @orientation="vertical"
      @defaultSelected="b"
      as |Radio|
    >
      <Radio @value="a" @labelText="option 1" />
      <Radio @value="b" @labelText="option 2 is default"/>
    </RadioButtonGroup>
    <br/>
    selected: {{context.selected}}
    <br/>
    <RadioButtonGroup @onSelect={{updateSelected}} @orientation="vertical" >
      <:heading>Radio Group with heading</:heading>
      <:default as |Radio|>
        <Radio @value="a" @labelText="vertical option 1" />
        <Radio @value="b" @labelText="option 2"/>
      </:default>
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup
      @legendText="Group with helper text"
      @helperText="Helper text goes here"
      as |Radio|
    >
      <Radio @value="a" @labelText="option 1" />
      <Radio @value="b" @labelText="option 2"/>
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup
      @legendText="Invalid group"
      @invalid={{true}}
      @invalidText="Invalid selection"
      as |Radio|
    >
      <Radio @value="a" @labelText="option 1" />
      <Radio @value="b" @labelText="option 2"/>
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup
      @legendText="Group with warning"
      @warn={{true}}
      @warnText="Please notice the warning"
      as |Radio|
    >
      <Radio @value="a" @labelText="option 1" />
      <Radio @value="b" @labelText="option 2"/>
    </RadioButtonGroup>
    <br/>
    <RadioButtonGroup
      @legendText="Read only group"
      @readOnly={{true}}
      @defaultSelected="a"
      as |Radio|
    >
      <Radio @value="a" @labelText="option 1" />
      <Radio @value="b" @labelText="option 2"/>
    </RadioButtonGroup>
</template>
```

## API Reference

<details>
<summary><h3>Radio</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/radio' 
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
    @module='declarations/components/radio/group' 
    @name='default' 
  />
</template>
```
</details>
