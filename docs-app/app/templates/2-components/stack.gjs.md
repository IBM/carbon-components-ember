# Stack
<ThemeSwitcher />

The Stack component is a useful layout utility in a component-based model.
This allows components to not use margin and instead delegate the
responsibility of positioning and layout to parent components.

Stack uses the spacing scale from the Design Language in order to determine
how much space there should be between items rendered by the Stack
component. It also supports a custom `gap` argument which will allow a
user to provide a custom value for the gap of the layout. This component
supports both horizontal and vertical orientations.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Stack } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Stack @gap={{6}} @orientation='horizontal'>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Stack>

  <br />
  <br />

  <Stack @gap={{6}}>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Stack>
</template>
```

## API Reference

<details>
<summary><h3>Stack</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/stack'
    @name='default'
  />
</template>
```
</details>
