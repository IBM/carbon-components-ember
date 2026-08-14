<ThemeSwitcher />

# FluidTextInput

FluidTextInput is a text input variant with fluid styling - a full-width
bottom divider and inline validation message, intended for use in fluid
forms.

```gjs live preview
import { FluidTextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell('');
const update = (newValue) => (value.current = newValue);

<template>
    <ThemeSupport />
    <div style="max-width: 400px">
      <FluidTextInput @labelText="Label" @placeholder="Placeholder text" />
      <br />
      <FluidTextInput @labelText="Controlled" @value={{value.current}} @onChange={{update}} />
      <br/>
      value: {{value.current}}
      <br />
      <FluidTextInput @labelText="With a counter" @enableCounter={{true}} @maxCount={{20}} />
      <br />
      <FluidTextInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
      <br />
      <FluidTextInput @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
      <br />
      <FluidTextInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
      <br />
      <FluidTextInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
      <br />
      <FluidTextInput @labelText="Password" @isPassword={{true}} @placeholder="Enter your password" />
    </div>
</template>
```

## With Toggletip

```gjs live preview
import { FluidTextInput, ToggletipLabel, Toggletip } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <div style="max-width: 400px">
      <FluidTextInput @placeholder="Placeholder text">
        <:labelText>
          <ToggletipLabel>Label</ToggletipLabel>
          <Toggletip @align="top-left" as |t|>
            <t.Button @label="Show information">
              <Information />
            </t.Button>
            <t.Content>
              <p>Additional field information here.</p>
            </t.Content>
          </Toggletip>
        </:labelText>
      </FluidTextInput>
    </div>
</template>
```

## API Reference

<details>
<summary><h3>FluidTextInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/fluid-text-input'
    @name='default'
  />
</template>
```
</details>
