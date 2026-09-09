# Layer
<ThemeSwitcher />

The `Layer` component renders content on a specific Carbon layer. Each layer
has a set of token values associated with it, which other components (like
`Tile`) key off of to determine their own background. You can use these
tokens directly, or use contextual tokens from Carbon's styles package like
`$layer` or `$field`.

`Layer`s can be nested up to three levels deep; past that, the level stays
clamped at the third level. Ember has no equivalent of React's ambient
`LayerContext`, so a bare `<Layer>` always renders as the first level of
nesting; to nest `Layer`s more than one level deep, use the component
yielded to the block, which is pre-bound to the correct next level.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Layer } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <div style='background: var(--cds-background); padding: 1rem'>
    <div style='background: var(--cds-layer); padding: 1rem'>Layer one (implicit)</div>
    <Layer as |L|>
      <div style='background: var(--cds-layer); padding: 1rem; margin-top: 1rem'>Layer two</div>
      <L>
        <div style='background: var(--cds-layer); padding: 1rem; margin-top: 1rem'>Layer three</div>
      </L>
    </Layer>
  </div>
</template>
```

## With background

Passing `@withBackground` applies a background color using the layer's
background token, so you don't need to set one manually.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Layer } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <Layer @withBackground={{true}} style='padding: 1rem'>
    Layer with a background applied automatically
  </Layer>
</template>
```

## Setting a custom level

Override the rendered level with `@level` (`0`, `1`, or `2`), for example to
reset back to the first layer regardless of nesting.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Layer } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <Layer as |L|>
    <div style='background: var(--cds-layer); padding: 1rem'>Layer two</div>
    <L @level={{0}}>
      <div style='background: var(--cds-layer); padding: 1rem; margin-top: 1rem'>Reset to layer one</div>
    </L>
  </Layer>
</template>
```

## API Reference

<details>
<summary><h3>Layer</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/layer' 
    @name='default' 
  />
</template>
```
</details>
