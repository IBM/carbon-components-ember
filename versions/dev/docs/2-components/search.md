<ThemeSwitcher />

# Search

```gjs live preview
import { SearchInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <SearchInput @label="search" /><br>
    <SearchInput @placeholder="search something" /><br>
    <SearchInput @value="my search" /><br>
    <SearchInput /><br>
</template>
```

## API Reference

<details>
<summary><h3>Search</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/search-input' 
    @name='default' 
  />
</template>
```
</details>
