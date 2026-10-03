# Layout
<ThemeSwitcher />

The `Layout` component provides a way to set layout contexts for specific
parts of an application. It uses Carbon's experimental `layout` Sass module to
control layout-related settings like size and density for all components
rendered within it that support these options.

All children components that support it will react to the `size` and
`density` you pass to `Layout`. Note that not all components support the
entire spectrum of options available; in these cases a component will
typically cap out at the maximum or minimum size it supports. If a component
is outside of a layout context, or `size` / `density` isn't set, it falls back
to its default rendering.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Layout } from 'carbon-components-ember/components';
import { TextInput } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Layout @size='sm' @density='condensed'>
    <TextInput @labelText='Label' @placeholder='Placeholder' />
  </Layout>
</template>
```

## LayoutConstraint

In order to apply specific constraints to children components that might
differ from their own preference, the `LayoutConstraint` utility component
can be used. The constraints for a group (`size` and `density`) are passed as
an object with any of these keys: `min`, `default`, `max`.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { LayoutConstraint } from 'carbon-components-ember/components';
import { TextInput } from 'carbon-components-ember/components';
import { hash } from '@ember/helper';
<template>
  <ThemeSupport />
  <br>
  <LayoutConstraint @size={{hash default='sm' min='sm' max='lg'}}>
    <TextInput @labelText='Label' @placeholder='Placeholder' />
  </LayoutConstraint>
</template>
```

## API Reference

<details>
<summary><h3>Layout</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/layout'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>LayoutConstraint</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/layout'
    @name='LayoutConstraint'
  />
</template>
```
</details>
