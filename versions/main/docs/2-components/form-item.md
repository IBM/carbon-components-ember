<ThemeSwitcher />

# FormItem

`FormItem` is a simple layout wrapper that provides consistent spacing
between a form control and its label/helper text. It renders a `<div>` with
the `cds--form-item` class around its contents and passes through any HTML
attributes.

```gjs live preview
import { FormItem, FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <FormItem>
      <FormLabel @id="name-input">Name</FormLabel>
      <input id="name-input" class="cds--text-input" type="text" />
    </FormItem>
</template>
```

## Custom attributes

Any HTML attributes, including `class`, passed to `FormItem` are applied to
the rendered `<div>`.

```gjs live preview
import { FormItem, FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <FormItem class="custom-form-item">
      <FormLabel @id="email-input">Email</FormLabel>
      <input id="email-input" class="cds--text-input" type="email" />
    </FormItem>
</template>
```

## API Reference

<details>
<summary><h3>FormItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/form-item'
    @name='default'
  />
</template>
```
</details>
