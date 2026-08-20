<ThemeSwitcher />

# Search

Search allows users to enter a term to be used to find specific content, filtering out results that don't match.

```gjs live preview
import { Search } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Search @labelText="Search" /><br>
    <Search @labelText="Search" @placeholder="search something" /><br>
    <Search @labelText="Search" @value="my search" /><br>
    <Search @labelText="Small search" @size="sm" /><br>
    <Search @labelText="Disabled search" @disabled={{true}} /><br>
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
    @module='declarations/components/search' 
    @name='default' 
  />
</template>
```
</details>
