# UnorderedList
<ThemeSwitcher />

Unordered lists are groupings of related content that have no priority.



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

  <br />
  <br />

  <UnorderedList @nested>
    <ListItem>Item 1</ListItem>
    <ListItem>
      Item 2
      <UnorderedList @nested>
        <ListItem>Nested item 1</ListItem>
        <ListItem>Nested item 2</ListItem>
      </UnorderedList>
    </ListItem>
    <ListItem>Item 3</ListItem>
  </UnorderedList>
</template>
```


## API Reference

<details>
<summary><h3>UnorderedList</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/unordered-list' 
    @name='default' 
  />
</template>
```
</details>
