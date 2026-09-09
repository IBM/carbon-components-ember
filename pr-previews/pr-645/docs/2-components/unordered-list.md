# UnorderedList
<ThemeSwitcher />

Unordered lists are groupings of related content that have no priority.



```gjs live preview
import { ThemeSupport } from 'docs-support';
import { UnorderedList } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <UnorderedList>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </UnorderedList>

  <br />
  <br />

  <UnorderedList @nested>
    <li>Item 1</li>
    <li>
      Item 2
      <UnorderedList @nested>
        <li>Nested item 1</li>
        <li>Nested item 2</li>
      </UnorderedList>
    </li>
    <li>Item 3</li>
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
