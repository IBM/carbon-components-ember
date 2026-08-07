<ThemeSwitcher />

# SelectItem

`SelectItem` renders a native `<option>` element for use inside a native
`<select>` (or [`Select`](./index.md)).

```gjs live preview
import { SelectItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <select class="cds--select-input">
    <SelectItem @value="option-1" @text="Option 1" />
    <SelectItem @value="option-2" @text="Option 2" />
    <SelectItem @value="option-3" @text="Option 3" />
  </select>
</template>
```

## Disabled

```gjs live preview
import { SelectItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <select class="cds--select-input">
    <SelectItem @value="option-1" @text="Option 1" />
    <SelectItem @value="option-2" @text="Option 2" @disabled={{true}} />
  </select>
</template>
```

## Grouped with SelectItemGroup

```gjs live preview
import { SelectItem, SelectItemGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <select class="cds--select-input">
    <SelectItemGroup @label="Group 1">
      <SelectItem @value="option-1" @text="Option 1" />
      <SelectItem @value="option-2" @text="Option 2" />
    </SelectItemGroup>
    <SelectItemGroup @label="Group 2" @disabled={{true}}>
      <SelectItem @value="option-3" @text="Option 3" />
      <SelectItem @value="option-4" @text="Option 4" />
    </SelectItemGroup>
  </select>
</template>
```

## API Reference

<details>
<summary><h3>SelectItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/select-item'
    @name='default'
  />
</template>
```
</details>
