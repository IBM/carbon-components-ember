<ThemeSwitcher />

# DatePicker

DatePicker lets a user pick a date, or a range of dates, from a calendar
dropdown, or type one into a plain field. It wraps
[flatpickr](https://flatpickr.js.org/) for the calendar and composes one or
two `DatePickerInput` fields, yielded from the block, to render the field(s)
themselves.

```gjs live preview
import { DatePicker } from 'carbon-components-ember/components';
import { ThemeSupport, didInsert } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ container: null });

const setContainer = (element) => (context.container = element);

const update = (dates) => {
  context.value = dates[0];
}

const minDate = new Date(2024, 0, 10);
const maxDate = new Date(2024, 0, 20);
const readOnlyValue = new Date(2024, 0, 15);

<template>
    <ThemeSupport />
    <div {{didInsert setContainer}}>
      <DatePicker @datePickerType="simple" as |Input|>
        <Input @labelText="Simple date field" @placeholder="mm/dd/yyyy" />
      </DatePicker>
      <br />
      {{#if context.container}}
        <DatePicker @datePickerType="single" @appendTo={{context.container}} @onChange={{update}} as |Input|>
          <Input @labelText="Single date picker" @placeholder="mm/dd/yyyy" />
        </DatePicker>
        <br />
        selected: {{context.value}}
        <br />
        <DatePicker @datePickerType="range" @appendTo={{context.container}} as |Input|>
          <Input @labelText="Start date" @placeholder="mm/dd/yyyy" />
          <Input @labelText="End date" @placeholder="mm/dd/yyyy" />
        </DatePicker>
        <br />
        <DatePicker @datePickerType="single" @appendTo={{context.container}} @dateFormat="Y-m-d" as |Input|>
          <Input @labelText="Custom format (Y-m-d)" @placeholder="yyyy-mm-dd" />
        </DatePicker>
        <br />
        <DatePicker @datePickerType="single" @appendTo={{context.container}} @minDate={{minDate}} @maxDate={{maxDate}} as |Input|>
          <Input @labelText="Min/max date" @placeholder="mm/dd/yyyy" />
        </DatePicker>
        <br />
        <DatePicker @datePickerType="single" @appendTo={{context.container}} @readOnly={{true}} @value={{readOnlyValue}} as |Input|>
          <Input @labelText="Read-only" @placeholder="mm/dd/yyyy" />
        </DatePicker>
        <br />
        <DatePicker @datePickerType="single" @appendTo={{context.container}} as |Input|>
          <Input @labelText="Invalid" @invalid={{true}} @invalidText="A valid date is required" />
        </DatePicker>
        <br />
        <DatePicker @datePickerType="single" @appendTo={{context.container}} as |Input|>
          <Input @labelText="Warning" @warn={{true}} @warnText="Double check this date" />
        </DatePicker>
      {{/if}}
    </div>
</template>
```

## API Reference

<details>
<summary><h3>DatePicker</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/date-picker'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>DatePickerInput</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/date-picker-input'
    @name='default'
  />
</template>
```
</details>
