<ThemeSwitcher />

# SelectItemGroup

`SelectItemGroup` renders a native `<optgroup>` element, used to group
related `<option>` elements together inside a native `<select>`.

```gjs live preview
import { SelectItemGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <select class="cds--select-input">
    <SelectItemGroup @label="Group 1">
      <option value="option-1">Option 1</option>
      <option value="option-2">Option 2</option>
    </SelectItemGroup>
    <SelectItemGroup @label="Group 2" @disabled={{true}}>
      <option value="option-3">Option 3</option>
      <option value="option-4">Option 4</option>
    </SelectItemGroup>
  </select>
</template>
```

## API Reference

<details>
<summary><h3>SelectItemGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/select-item-group'
    @name='default'
  />
</template>
```
</details>
