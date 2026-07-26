<ThemeSwitcher />

# TextInput

TextInput allows the user to enter a single line of text.

```gjs live preview
import { TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const update = (value) => {
  context.value = value;
}

<template>
    <ThemeSupport />
    <TextInput @labelText="Name" @placeholder="Enter your name" @helperText="Optional" />
    <br />
    <TextInput @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
    <br/>
    value: {{context.value}}
    <br />
    <TextInput @labelText="Small" @size="sm" />
    <br />
    <TextInput @labelText="Large" @size="lg" />
    <br />
    <TextInput @labelText="With a counter" @enableCounter={{true}} @maxCount={{20}} @helperText="Up to 20 characters" />
    <br />
    <TextInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
    <br />
    <TextInput @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
    <br />
    <TextInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
    <br />
    <TextInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
</template>
```

## API Reference

<details>
<summary><h3>TextInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/text-input'
    @name='default'
  />
</template>
```
</details>
