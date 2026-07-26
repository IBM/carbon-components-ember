# OrderedList
<ThemeSwitcher />

Ordered lists are groupings of related content where the order of the items within the group is meaningful.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
  </OrderedList>
</template>
```

## Nested

Ordered lists can be nested inside of each other using the `@nested` argument.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList>
    <li>
      Ordered List level 1
      <OrderedList @nested={{true}}>
        <li>Ordered List level 2</li>
        <li>
          Ordered List level 2
          <OrderedList @nested={{true}}>
            <li>Ordered List level 3</li>
            <li>Ordered List level 3</li>
          </OrderedList>
        </li>
      </OrderedList>
    </li>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
  </OrderedList>
</template>
```

## Native list styles

Use the `@native` argument to render the list using the browser's native ordered list numbering instead of the custom Carbon counter.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList @native={{true}}>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
    <li>
      Ordered List level 1
      <OrderedList @nested={{true}}>
        <li>Ordered List level 2</li>
        <li>Ordered List level 2</li>
        <li>Ordered List level 2</li>
        <li>Ordered List level 2</li>
      </OrderedList>
    </li>
    <li>Ordered List level 1</li>
    <li>Ordered List level 1</li>
  </OrderedList>
</template>
```


## API Reference

<details>
<summary><h3>OrderedList</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/ordered-list' 
    @name='default' 
  />
</template>
```
</details>
