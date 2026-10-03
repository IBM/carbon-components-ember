<ThemeSwitcher />

# FormGroup

`FormGroup` renders a `<fieldset>` with a `<legend>`, used to group related
form controls together under a shared heading.

```gjs live preview
import { FormGroup, TextInput, RadioButtonGroup, RadioButton, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <FormGroup @legendText='FormGroup Legend' style='max-width: 400px'>
    <TextInput @id='one' @labelText='First Name' />
    <br />
    <TextInput @id='two' @labelText='Last Name' />
    <br />
    <RadioButtonGroup
      @legendText='Radio button heading'
      @name='formgroup-default-radio-button-group'
      @defaultSelected='radio-1'
      as |Radio|
    >
      <Radio @labelText='Option 1' @value='radio-1' @id='radio-1' />
      <Radio @labelText='Option 2' @value='radio-2' @id='radio-2' />
      <Radio @labelText='Option 3' @value='radio-3' @id='radio-3' />
    </RadioButtonGroup>
    <br />
    <Button>Submit</Button>
  </FormGroup>
</template>
```

## Disabled

Passing `@disabled={{true}}` disables the `<fieldset>`, which disables every
form control nested inside of it.

```gjs live preview
import { FormGroup, TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <FormGroup @legendText='Disabled FormGroup' @disabled={{true}}>
    <TextInput @id='disabled-one' @labelText='First Name' />
  </FormGroup>
</template>
```

## Invalid state and message

Passing `@invalid={{true}}` marks the `<fieldset>` as invalid via
`data-invalid`. `@message={{true}}` renders `@messageText` below the group's
contents, commonly used to surface a validation message.

```gjs live preview
import { FormGroup, TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <FormGroup
    @legendText='Invalid FormGroup'
    @invalid={{true}}
    @message={{true}}
    @messageText='A valid value is required'
  >
    <TextInput @id='invalid-one' @labelText='First Name' @invalid={{true}} />
  </FormGroup>
</template>
```

## API Reference

<details>
<summary><h3>FormGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/form-group'
    @name='default'
  />
</template>
```
</details>
