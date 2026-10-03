<ThemeSwitcher />

# TimePicker

`TimePicker` renders a text `<input>` for entering a time, optionally paired
with one or more `TimePickerSelect` components (e.g. for AM/PM and time
zone) rendered next to it.

```gjs live preview
import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

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

## Controlled

Passing `@value` alongside `@onChange` makes the `<input>` fully controlled.

```gjs live preview
import { TimePicker } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj value='11:00') as |context|}}
    <TimePicker
      @labelText='Select a time'
      @value={{context.value}}
      @onChange={{fn (set context 'value')}}
    />
    <p>value: {{context.value}}</p>
  {{/let}}
</template>
```

## Sizes

`@size` accepts `sm`, `md` (the default), or `lg`.

```gjs live preview
import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePicker @labelText='Small' @size='sm' />
  <br />
  <TimePicker @labelText='Medium' @size='md' />
  <br />
  <TimePicker @labelText='Large' @size='lg' />
</template>
```

## Invalid and warning states

```gjs live preview
import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePicker
    @labelText='Invalid'
    @invalid={{true}}
    @invalidText='Enter a valid time'
  />
  <br />
  <TimePicker
    @labelText='Warning'
    @warning={{true}}
    @warningText='This value may cause issues'
  />
</template>
```

## Disabled and read-only

```gjs live preview
import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePicker @labelText='Disabled' @disabled={{true}} @value='11:00'>
    <TimePickerSelect @id='disabled-select-1'>
      <option value='AM'>AM</option>
      <option value='PM'>PM</option>
    </TimePickerSelect>
  </TimePicker>
  <br />
  <TimePicker @labelText='Read-only' @readOnly={{true}} @value='11:00' />
</template>
```

## Hidden label

```gjs live preview
import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TimePicker @labelText='Select a time' @hideLabel={{true}} />
</template>
```

## API Reference

<details>
<summary><h3>TimePicker</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/time-picker'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>TimePickerSelect</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/time-picker/time-picker-select'
    @name='default'
  />
</template>
```
</details>
