<ThemeSwitcher />

# PasswordInput

PasswordInput allows the user to enter a single line of text that is masked
by default, with a toggle button to reveal or hide the value.

```gjs live preview
import { PasswordInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

<template>
    <ThemeSupport />
    <PasswordInput @labelText="Password" @placeholder="Enter your password" @helperText="Optional help text" />
    <br />
    <PasswordInput @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
    <br/>
    value: {{context.value}}
    <br />
    <PasswordInput @labelText="Extra small" @size="xs" />
    <br />
    <PasswordInput @labelText="Small" @size="sm" />
    <br />
    <PasswordInput @labelText="Large" @size="lg" />
    <br />
    <PasswordInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid password is required" />
    <br />
    <PasswordInput @labelText="Warning" @warn={{true}} @warnText="This password may cause issues" />
    <br />
    <PasswordInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
    <br />
    <PasswordInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
    <br />
    <PasswordInput @labelText="Inline" @inline={{true}} @helperText="Optional help text" />
    <br />
    <PasswordInput
      @labelText="Custom toggle labels"
      @showPasswordLabel="Reveal password"
      @hidePasswordLabel="Conceal password"
    />
    <br />
    <PasswordInput
      @labelText="Visible by default"
      @type="text"
      @helperText="Starts with the value shown"
    />
</template>
```

## API Reference

<details>
<summary><h3>PasswordInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/password-input'
    @name='default'
  />
</template>
```
</details>

## References

- [Carbon Design System: Password input](https://carbondesignsystem.com/components/text-input/usage/)
- [React Storybook](https://react.carbondesignsystem.com/?path=/docs/components-passwordinput--overview)
