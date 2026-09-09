# Dropdown
<ThemeSwitcher />

`Dropdown` is a single-select field that opens a listbox of items on click.
It renders Carbon's `ListBox` markup directly - the menu is a plain
descendant of the field, positioned with Carbon's own CSS - and manages its
own open/highlight state internally.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Dropdown } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
<template>
  <ThemeSupport />
  <div style='width: 300px'>
    <Dropdown
      @titleText='Dropdown label'
      @label='Choose an option'
      @items={{array 'Option 1' 'Option 2' 'Option 3' 'Option 4'}}
    />
  </div>
</template>
```

## Controlled selection

Pass `@selectedItem` to control the selection yourself; pair it with
`@onChange` to react to the user picking a new item. `@initialSelectedItem`
seeds the selection for the uncontrolled case instead.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Dropdown } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ selected: 'Option 2' });

const handleChange = (data) => {
  context.selected = data.selectedItem;
};

<template>
  <ThemeSupport />
  <div style='width: 300px'>
    <Dropdown
      @titleText='Dropdown label'
      @label='Choose an option'
      @items={{array 'Option 1' 'Option 2' 'Option 3'}}
      @selectedItem={{context.selected}}
      @onChange={{handleChange}}
    />
    <p style='margin-top: 1rem'>Selected: {{context.selected}}</p>
  </div>
</template>
```

## Invalid and warning states

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Dropdown } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
<template>
  <ThemeSupport />
  <div style='width: 300px; display: flex; flex-direction: column; gap: 1rem'>
    <Dropdown
      @titleText='Dropdown label'
      @label='Choose an option'
      @items={{array 'Option 1' 'Option 2' 'Option 3'}}
      @invalid={{true}}
      @invalidText='This field requires a selection'
    />
    <Dropdown
      @titleText='Dropdown label'
      @label='Choose an option'
      @items={{array 'Option 1' 'Option 2' 'Option 3'}}
      @warn={{true}}
      @warnText='This selection may need review'
    />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>Dropdown</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/dropdown' 
    @name='default' 
  />
</template>
```
</details>
