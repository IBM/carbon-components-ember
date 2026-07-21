<ThemeSwitcher />

# TextArea

TextArea allows the user to enter multiple lines of text.

```gjs live preview
import { TextArea } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const update = (value) => {
  context.value = value;
}

<template>
    <ThemeSupport />
    <TextArea @labelText="Comments" @placeholder="Enter your comments" @helperText="Optional" />
    <br />
    <TextArea @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
    <br/>
    value: {{context.value}}
    <br />
    <TextArea @labelText="With a counter" @enableCounter={{true}} @maxCount={{100}} @helperText="Up to 100 characters" />
    <br />
    <TextArea @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
    <br />
    <TextArea @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
    <br />
    <TextArea @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
    <br />
    <TextArea @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
</template>
```

## API Reference

<details>
<summary><h3>TextArea</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/text-area'
    @name='default'
  />
</template>
```
</details>
