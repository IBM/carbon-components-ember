<ThemeSwitcher />

# Radio

```gjs live preview
import { Radio, RadioGroup } from 'carbon-components-ember/components';
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
    <RadioGroup as |Radio|>
        <Radio @labelText="option 1 is default" @isDefault={{true}} />
        <Radio @labelText="option 2"/>
    </RadioGroup>
    <br/>
    <RadioGroup @orientation="vertical" as |Radio|>
      <Radio @labelText="vertical option 1 is default" @isDefault={{true}} />
      <Radio @labelText="option 2"/>
    </RadioGroup>
    <br/>
    selected: {{context.selected}}
    <br/>
    <RadioGroup @onSelect={{updateSelected}} @orientation="vertical" >
      <:heading>Radio Group with heading</:heading>
      <:default as |Radio|>
        <Radio @value="a" @labelText="vertical option 1 is default" />
        <Radio @value="b" @labelText="option 2"/>
      </:default>
    </RadioGroup>
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
    @module='declarations/components/radio' 
    @name='default' 
  />
</template>
```
</details>
