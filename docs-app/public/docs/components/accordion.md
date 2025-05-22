

```gjs live preview
import Checkbox from 'carbon-components-ember/components/checkbox';
import set from 'carbon-components-ember/helpers/set';
import { fn } from '@ember/helper';
import Accordion from 'carbon-components-ember/components/accordion';
import newObj from 'carbon-components-ember/helpers/new-obj';
import RadioButtonGroup from 'carbon-components-ember/components/radio/group';

<template>
  {{#let (newObj) as |context|}}
  <RadioButtonGroup @onSelect={{fn (set context 'align')}}>
  <:heading>
  orientation
</:heading>
<:default as |Radio|>
  <Radio @value='start'>
  start
  </Radio>
<Radio @isDefault={{true}} @value='end'>
  end
  </Radio>
</:default>
</RadioButtonGroup>
<br />
<Checkbox
@name='disabled'
@label='disabled'
@checked={{context.disabled}}
@onChange={{fn (set context 'disabled')}}
/>
<Checkbox
@name='open'
@label='open'
@checked={{context.open}}
@onChange={{fn (set context 'open')}}
/>
<br />

<Accordion
@align={{context.align}}
@disabled={{context.disabled}}
@open={{context.open}}
as |Item|
>
<Item @title='Title 1'>
  The accordion component delivers large amounts of content in a
small space through progressive disclosure. The user gets key
details about the underlying content and can choose to expand that
content within the constraints of the accordion. Accordions work
especially well on mobile interfaces or whenever vertical space is
at a premium.
</Item>
<Item @title='Title 2'>
  The accordion component delivers large amounts of content in a
small space through progressive disclosure. The user gets key
details about the underlying content and can choose to expand that
content within the constraints of the accordion. Accordions work
especially well on mobile interfaces or whenever vertical space is
at a premium.
</Item>
<Item @title='Title 3'>
  The accordion component delivers large amounts of content in a
small space through progressive disclosure. The user gets key
details about the underlying content and can choose to expand that
content within the constraints of the accordion. Accordions work
especially well on mobile interfaces or whenever vertical space is
at a premium.
</Item>
</Accordion>
{{/let}}
</template>
```
