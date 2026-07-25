# LayoutDirection
<ThemeSwitcher />

The `LayoutDirection` component sets the reading direction (`ltr` or `rtl`)
for a part of the page. It renders a wrapper element with a `dir` attribute,
which the browser natively cascades to descendant elements. `LayoutDirection`
components can be nested to override the direction for a specific section of
content.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <LayoutDirection @dir='rtl'>
    <p>مرحبا بالعالم</p>
  </LayoutDirection>
</template>
```

## Custom element type

Use `@as` to change the element type used to render the wrapper (defaults to
`div`).

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <LayoutDirection @as='span' @dir='ltr'>
    Hello world
  </LayoutDirection>
</template>
```

## Nesting

Nest `LayoutDirection` components to switch direction for part of a larger,
oppositely-directioned block of content.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <LayoutDirection @dir='ltr'>
    <p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum.
    </p>
    <LayoutDirection @dir='rtl'>
      <p>
        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
        التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
      </p>
    </LayoutDirection>
    <p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum.
    </p>
  </LayoutDirection>
</template>
```

## API Reference

<details>
<summary><h3>LayoutDirection</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/layout-direction'
    @name='default'
  />
</template>
```
</details>

## References

- [Carbon Design System - LayoutDirection](https://react.carbondesignsystem.com/?path=/docs/components-layoutdirection--overview)
- [Carbon React source](https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/LayoutDirection)
