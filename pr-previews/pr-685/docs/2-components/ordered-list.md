# OrderedList
<ThemeSwitcher />

Ordered lists are groupings of related content where the order of the items within the group is meaningful.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
  </OrderedList>
</template>
```

## Nested

Ordered lists can be nested inside of each other using the `@nested` argument.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList>
    <ListItem>
      Ordered List level 1
      <OrderedList @nested={{true}}>
        <ListItem>Ordered List level 2</ListItem>
        <ListItem>
          Ordered List level 2
          <OrderedList @nested={{true}}>
            <ListItem>Ordered List level 3</ListItem>
            <ListItem>Ordered List level 3</ListItem>
          </OrderedList>
        </ListItem>
      </OrderedList>
    </ListItem>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
  </OrderedList>
</template>
```

## Native list styles

Use the `@native` argument to render the list using the browser's native ordered list numbering instead of the custom Carbon counter.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <OrderedList @native={{true}}>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>
      Ordered List level 1
      <OrderedList @nested={{true}}>
        <ListItem>Ordered List level 2</ListItem>
        <ListItem>Ordered List level 2</ListItem>
        <ListItem>Ordered List level 2</ListItem>
        <ListItem>Ordered List level 2</ListItem>
      </OrderedList>
    </ListItem>
    <ListItem>Ordered List level 1</ListItem>
    <ListItem>Ordered List level 1</ListItem>
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
