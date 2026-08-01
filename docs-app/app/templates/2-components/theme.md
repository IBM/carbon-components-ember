# Theme
<ThemeSwitcher />

The Theme component applies one of the Carbon themes (`white`, `g10`,
`g90`, `g100`) to a section of your page. It renders a wrapper element
with the corresponding Carbon zone class, which re-emits the theme's CSS
custom properties scoped to that element — everything inside picks up the
selected theme's tokens.

The block receives `theme` and `isDark` so nested content can react to
the active theme, mirroring React's `useTheme` hook.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Theme } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <Theme @theme='g100'>
    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g100
    </section>
  </Theme>
  <Theme @theme='g90'>
    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g90
    </section>
  </Theme>
  <Theme @theme='g10'>
    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g10
    </section>
  </Theme>
  <Theme @theme='white'>
    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      white
    </section>
  </Theme>
</template>
```

## Reading the current theme

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Theme } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <Theme @theme='g90' as |ctx|>
    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      Current theme: {{ctx.theme}} ({{if ctx.isDark 'dark' 'light'}})
    </section>
  </Theme>
</template>
```

## API Reference

<details>
<summary><h3>Theme</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/theme' 
    @name='default' 
  />
</template>
```
</details>
