# Breadcrumbs
<ThemeSwitcher />

The breadcrumb is a secondary navigation pattern that helps a user understand the hierarchy among levels and navigate back through them.



```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Breadcrumbs } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Breadcrumbs @crumbs={{Array 'a' 'b' 'c'}} @current='b' />
</template>
```


## API Reference

<details>
<summary><h3>Breadcrumbs</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/breadcrumbs' 
    @name='default' 
  />
</template>
```
</details>
