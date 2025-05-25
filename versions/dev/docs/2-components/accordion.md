<ThemeSwitcher />

# Accordion

An accordion component is an element that organizes content into collapsible sections, enabling users to expand or collapse them for efficient information presentation and navigation.

```gjs live preview
import { fn } from '@ember/helper';
import { Accordion, Checkbox, RadioGroup } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const eq = (a, b) => a === b;

<template>
  <ThemeSupport />
    {{#let (newObj) as |context|}}
        <RadioGroup @onSelect={{fn (set context 'align')}}>
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
        </RadioGroup>
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
## API Reference

<details>
<summary><h3>Accordion</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/accordion' 
    @name='default' 
  />
</template>
```
</details>
