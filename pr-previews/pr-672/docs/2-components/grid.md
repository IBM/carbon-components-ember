# Grid
<ThemeSwitcher />

The 2x Grid is a flexible, 16-column grid system that can be used to build
custom layouts. It exposes three components: `Grid`, `GridRow`, and
`GridColumn`. A `Grid` renders one or more `GridRow`s, and each `GridRow`
renders one or more `GridColumn`s.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid, GridRow, GridColumn } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid>
    <GridRow>
      <GridColumn>Column 1</GridColumn>
      <GridColumn>Column 2</GridColumn>
      <GridColumn>Column 3</GridColumn>
      <GridColumn>Column 4</GridColumn>
    </GridRow>
  </Grid>

  <br />
  <br />

  <Grid>
    <GridRow>
      <GridColumn @sm={{2}} @md={{4}} @lg={{6}}>Span 2 of 4 / 4 of 8 / 6 of 16</GridColumn>
      <GridColumn @sm={{2}} @md={{4}} @lg={{10}}>Span 2 of 4 / 4 of 8 / 10 of 16</GridColumn>
    </GridRow>
  </Grid>
</template>
```

## Column span shorthand

`GridColumn` accepts a value for each breakpoint (`sm`, `md`, `lg`, `xlg`,
`max`):

- `true` &mdash; the column takes up an equal share of the remaining space
- a `number` &mdash; the column spans that many columns
- an object like `{{hash span=4 offset=2}}` &mdash; the column spans `span`
  columns and is offset by `offset` columns

## API Reference

<details>
<summary><h3>Grid</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/grid'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>GridRow</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/grid/row'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>GridColumn</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/grid/column'
    @name='default'
  />
</template>
```
</details>
