<ThemeSwitcher />

# TimePickerSelect

TimePickerSelect renders a native `<select>` styled to sit alongside a time
picker's text input (for example to choose AM/PM or a timezone), but it can
also be used on its own wherever a plain select control is needed. Pass
`<option>` elements as the block content.

```gjs live preview
import { TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePickerSelect @id='time-picker-select-1'>
    <option value='AM'>AM</option>
    <option value='PM'>PM</option>
  </TimePickerSelect>
</template>
```

## Default value

`@defaultValue` sets the initially selected option for uncontrolled usage.

```gjs live preview
import { TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePickerSelect @id='time-picker-select-timezone' @defaultValue='Time zone 2'>
    <option value='Time zone 1'>Time zone 1</option>
    <option value='Time zone 2'>Time zone 2</option>
  </TimePickerSelect>
</template>
```

## Controlled value

Pass `@value` together with `@onChange` to fully control the selected
option.

```gjs live preview
import { fn } from '@ember/helper';
import { TimePickerSelect } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj period='AM') as |context|}}
    <TimePickerSelect
      @id='time-picker-select-controlled'
      @value={{context.period}}
      @onChange={{fn (set context 'period')}}
    >
      <option value='AM'>AM</option>
      <option value='PM'>PM</option>
    </TimePickerSelect>
    <p>Selected: {{context.period}}</p>
  {{/let}}
</template>
```

## Disabled

```gjs live preview
import { TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePickerSelect @id='time-picker-select-disabled' @disabled={{true}}>
    <option value='AM'>AM</option>
    <option value='PM'>PM</option>
  </TimePickerSelect>
</template>
```

## With TimePicker

TimePickerSelect is designed to be placed alongside a `TimePicker`'s text
input to select things like AM/PM or a timezone (see the
[Carbon TimePicker documentation](https://carbondesignsystem.com/components/time-picker/usage/)).
The Ember `TimePicker` component is not yet implemented; once available,
usage will look like:

```gjs
import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';

<template>
  <TimePicker @id='time-picker' @labelText='Select a time'>
    <TimePickerSelect @id='time-picker-select-1'>
      <option value='AM'>AM</option>
      <option value='PM'>PM</option>
    </TimePickerSelect>
    <TimePickerSelect @id='time-picker-select-2'>
      <option value='Time zone 1'>Time zone 1</option>
      <option value='Time zone 2'>Time zone 2</option>
    </TimePickerSelect>
  </TimePicker>
</template>
```

## API Reference

<details>
<summary><h3>TimePickerSelect</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/time-picker-select'
    @name='default'
  />
</template>
```
</details>
