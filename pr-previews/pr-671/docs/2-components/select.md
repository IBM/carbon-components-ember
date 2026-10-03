<ThemeSwitcher />

# Select

```gjs live preview
import { Select, Tag } from 'carbon-components-ember/components';
import { fn } from '@ember/helper';
import { TrackedObject } from 'tracked-built-ins';
import { ThemeSupport } from 'docs-support';

const context = new TrackedObject({
  options: ['first', 'second', 'a', 'b']
});
const join = (...args) => args.join(' ');

<template>
    <ThemeSupport />
    <br>
    <Select
        @onSelect={{fn (mut context.selected)}}
        @selected={{context.selected}}
        @options={{context.options}}
        @multiple={{false}}
        as |item|
    >
        {{item}}
    </Select>
    <Tag @type='blue'>
        {{context.selected}}
    </Tag>

    <Select
        @selected={{context.selectedMultiple}}
        @options={{context.options}}
        @multiple={{true}}
        @onSelect={{fn (mut context.selectedMultiple)}}
    />
    <Tag @type='blue'>
        {{join context.selectedMultiple}}
    </Tag>
</template>
```

## API Reference

<details>
<summary><h3>Select</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/select' 
    @name='default' 
  />
</template>
```
</details>
