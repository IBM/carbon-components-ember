<ThemeSwitcher />

# ListItem

A `ListItem` renders a single `<li>` element with the styles needed for it to
work as a child of [`OrderedList`](/components/ordered-list) or
[`UnorderedList`](/components/unordered-list). It has no arguments of its own
- any attributes passed to it (`id`, `class`, etc.) are applied to the
underlying `<li>`.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { ListItem, UnorderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <UnorderedList>
    <ListItem>Item 1</ListItem>
    <ListItem>Item 2</ListItem>
    <ListItem>Item 3</ListItem>
  </UnorderedList>
</template>
```

## Within an OrderedList

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

`ListItem` can contain a nested `OrderedList` or `UnorderedList` to build
multi-level lists.

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

## API Reference

<details>
<summary><h3>ListItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/list-item' 
    @name='default' 
  />
</template>
```
</details>
