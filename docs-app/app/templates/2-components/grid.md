# Grid
<ThemeSwitcher />

The 2x Grid is a flexible, 16-column grid system that can be used to build
custom layouts. Carbon ships two layout engines for it, and `Grid` renders
either one:

- **Flexbox grid** (the default, `@mode="flexbox"`) &mdash; a `Grid` renders one
  or more `GridRow`s, and each `GridRow` renders one or more `GridColumn`s.
- **CSS Grid** (`@mode="css-grid"`) &mdash; there are no rows; columns are
  direct children of the `Grid`. This mode additionally supports subgrids,
  percentage spans, and explicit `start`/`end` placement.

`Grid` yields `Grid`, `Column`, `Row` and `ColumnHang` components that are
already bound to the surrounding grid's mode, so the mode is only picked once.

## Flexbox grid

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

`FlexGrid` is available as an explicit, always-flexbox alias of `Grid`, for
parity with Carbon React.

### Column span shorthand

`GridColumn` accepts a value for each breakpoint (`sm`, `md`, `lg`, `xlg`,
`max`):

- `true` &mdash; the column takes up an equal share of the remaining space
- a `number` &mdash; the column spans that many columns
- an object like `{{hash span=4 offset=2}}` &mdash; the column spans `span`
  columns and is offset by `offset` columns

In `css-grid` mode a column additionally accepts a percentage (`'25%'`,
`'50%'`, `'75%'`, `'100%'`) and `start`/`end` grid lines.

## CSS Grid

Pass `@mode="css-grid"` and render the yielded `Column` directly &mdash; the
CSS Grid has no row element.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 1</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 2</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 3</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 4</div>
    </g.Column>
  </Grid>
</template>
```

### Narrow

The container hangs 16px into the gutter, which is useful for typographic
alignment with and without containers.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" @narrow={{true}} as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 1</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 2</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 3</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 4</div>
    </g.Column>
  </Grid>
</template>
```

### Condensed

Collapses the gutter to 1px, which is useful for fluid layouts.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" @condensed={{true}} as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 1</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 2</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 3</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 4</div>
    </g.Column>
  </Grid>
</template>
```

### Full width

Removes the default max width that the grid sets.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" @fullWidth={{true}} as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 1</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 2</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 3</div>
    </g.Column>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column 4</div>
    </g.Column>
  </Grid>
</template>
```

### With row gap

Adds a row gap to the grid that matches the current gutter size, so columns
that wrap onto a new row get consistent vertical spacing.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">1</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">2</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">3</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">4</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">5</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">6</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">7</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">8</div>
    </g.Column>
  </Grid>
</template>
```

### Responsive

Each breakpoint can span a different number of columns, or a percentage of the
grid. A span of `0` hides the column at that breakpoint.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column @sm={{2}} @md={{4}} @lg={{6}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 2 of 4</p>
        <p>Medium: Span 4 of 8</p>
        <p>Large: Span 6 of 16</p>
      </div>
    </g.Column>
    <g.Column @sm={{2}} @md={{2}} @lg={{3}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 2 of 4</p>
        <p>Medium: Span 2 of 8</p>
        <p>Large: Span 3 of 16</p>
      </div>
    </g.Column>
    <g.Column @sm={{0}} @md={{2}} @lg={{3}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 0 of 4</p>
        <p>Medium: Span 2 of 8</p>
        <p>Large: Span 3 of 16</p>
      </div>
    </g.Column>
    <g.Column @sm={{0}} @md={{0}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 0 of 4</p>
        <p>Medium: Span 0 of 8</p>
        <p>Large: Span 4 of 16</p>
      </div>
    </g.Column>
    <g.Column @sm="25%" @md="50%" @lg="75%">
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 25%</p>
        <p>Medium: Span 50%</p>
        <p>Large: Span 75%</p>
      </div>
    </g.Column>
  </Grid>
</template>
```

### Offset

Pass an object with `span` and `offset` to push a column to the right.

```gjs live preview
import { hash } from '@ember/helper';
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column
      @sm={{hash span=1 offset=3}}
      @md={{hash span=2 offset=6}}
      @lg={{hash span=4 offset=12}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">offset</div>
    </g.Column>
    <g.Column
      @sm={{hash span=2 offset=2}}
      @md={{hash span=4 offset=4}}
      @lg={{hash span=8 offset=8}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">offset</div>
    </g.Column>
    <g.Column
      @sm={{hash span=3 offset=1}}
      @md={{hash span=6 offset=2}}
      @lg={{hash span=12 offset=4}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">offset</div>
    </g.Column>
    <g.Column @sm={{hash span=4}} @md={{hash span=8}} @lg={{hash span=16}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">no offset</div>
    </g.Column>
    <g.Column
      @sm={{hash span="25%" offset=1}}
      @md={{hash span="50%" offset=2}}
      @lg={{hash span="75%" offset=4}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">percentage span</div>
    </g.Column>
  </Grid>
</template>
```

### Start and end

Instead of an offset, a column can be placed on explicit grid lines with
`start` and `end`.

```gjs live preview
import { hash } from '@ember/helper';
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column
      @sm={{hash span=1 start=4}}
      @md={{hash span=2 start=7}}
      @lg={{hash span=4 start=13}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">span, start</div>
    </g.Column>
    <g.Column
      @sm={{hash span=2 end=5}}
      @md={{hash span=4 end=9}}
      @lg={{hash span=8 end=17}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">span, end</div>
    </g.Column>
    <g.Column
      @sm={{hash start=1 end=4}}
      @md={{hash start=3 end=9}}
      @lg={{hash start=5 end=17}}
    >
      <div style="padding: .5rem; background: var(--cds-layer-01)">start, end</div>
    </g.Column>
  </Grid>
</template>
```

### Subgrid

A `Grid` nested inside a CSS Grid renders as a subgrid, inheriting the column
tracks of its parent instead of starting a new grid.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column @sm={{2}} @md={{4}} @lg={{3}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Small: Span 2 of 4</p>
        <p>Medium: Span 4 of 8</p>
        <p>Large: Span 3 of 16</p>
      </div>
    </g.Column>
    <g.Column @sm={{2}} @md={{4}} @lg={{10}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Large: Span 10 of 16, containing a subgrid:</p>
      </div>
      <g.Grid as |sub|>
        <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
          <div style="padding: .5rem; background: var(--cds-layer-02)">2 of 10</div>
        </sub.Column>
        <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
          <div style="padding: .5rem; background: var(--cds-layer-02)">2 of 10</div>
        </sub.Column>
        <sub.Column @sm={{0}} @md={{1}} @lg={{2}}>
          <div style="padding: .5rem; background: var(--cds-layer-02)">2 of 10</div>
        </sub.Column>
        <sub.Column @sm={{0}} @md={{1}} @lg={{4}}>
          <div style="padding: .5rem; background: var(--cds-layer-02)">4 of 10</div>
        </sub.Column>
      </g.Grid>
    </g.Column>
    <g.Column @sm={{0}} @md={{0}} @lg={{3}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">
        <p>Large: Span 3 of 16</p>
      </div>
    </g.Column>
  </Grid>
</template>
```

A subgrid picks up its own gutter mode from `@narrow` / `@condensed`, so wide,
narrow and condensed subgrids can be mixed on the same page.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <h5>Wide</h5>
  <Grid @mode="css-grid" as |g|>
    <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
      <g.Grid as |sub|>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">wide</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">wide</div>
        </sub.Column>
      </g.Grid>
    </g.Column>
  </Grid>

  <h5>Narrow</h5>
  <Grid @mode="css-grid" @narrow={{true}} as |g|>
    <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
      <g.Grid @narrow={{true}} as |sub|>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">narrow</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">narrow</div>
        </sub.Column>
      </g.Grid>
    </g.Column>
  </Grid>

  <h5>Condensed</h5>
  <Grid @mode="css-grid" @condensed={{true}} as |g|>
    <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
      <g.Grid @condensed={{true}} as |sub|>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">condensed</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">condensed</div>
        </sub.Column>
      </g.Grid>
    </g.Column>
  </Grid>
</template>
```

### Subgrid with row gap

`@withRowGap` works on subgrids too.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
    <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
      <g.Grid @withRowGap={{true}} as |sub|>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">1</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">2</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">3</div>
        </sub.Column>
        <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
          <div style="padding: .5rem; background: var(--cds-layer-01)">4</div>
        </sub.Column>
      </g.Grid>
    </g.Column>
  </Grid>
</template>
```

### Mixed gutter modes

`ColumnHang` renders content that hangs into the gutter, so text stays aligned
across grids that use different gutter modes.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <Grid @mode="css-grid" as |g|>
    <g.Column @span={{8}}>
      <g.Grid @narrow={{true}} as |sub|>
        <sub.Column>
          <sub.ColumnHang>Text</sub.ColumnHang>
        </sub.Column>
        <sub.Column>
          <sub.ColumnHang>Text</sub.ColumnHang>
        </sub.Column>
        <sub.Column @span={{4}}>
          <sub.Grid @condensed={{true}} as |inner|>
            <inner.Column>
              <inner.ColumnHang>Text</inner.ColumnHang>
            </inner.Column>
            <inner.Column>
              <inner.ColumnHang>Text</inner.ColumnHang>
            </inner.Column>
          </sub.Grid>
        </sub.Column>
      </g.Grid>
    </g.Column>
  </Grid>
</template>
```

### Alignment

`@align` positions the grid within its container. It defaults to `center` and
only applies in `css-grid` mode.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <h5>start</h5>
  <Grid @mode="css-grid" @align="start" as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column</div>
    </g.Column>
  </Grid>
  <h5>end</h5>
  <Grid @mode="css-grid" @align="end" as |g|>
    <g.Column @sm={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01)">Column</div>
    </g.Column>
  </Grid>
</template>
```

### GridSettings

`GridSettings` renders no markup of its own. It yields `Grid`, `Column`, `Row`
and `ColumnHang` already bound to a mode, which is handy when a whole section
of an app should share one grid mode. Passing `@subgrid={{true}}` makes the
yielded `Grid` render as a subgrid of a surrounding CSS Grid.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { GridSettings } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <GridSettings @mode="css-grid" as |g|>
    <g.Grid>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <div style="padding: .5rem; background: var(--cds-layer-01)">Column 1</div>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <div style="padding: .5rem; background: var(--cds-layer-01)">Column 2</div>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <div style="padding: .5rem; background: var(--cds-layer-01)">Column 3</div>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <div style="padding: .5rem; background: var(--cds-layer-01)">Column 4</div>
      </g.Column>
    </g.Grid>
  </GridSettings>
</template>
```

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

<details>
<summary><h3>GridColumnHang</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/grid/column-hang'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>GridSettings</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/grid/settings'
    @name='default'
  />
</template>
```
</details>
