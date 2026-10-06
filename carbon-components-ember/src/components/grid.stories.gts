import { hash } from '@ember/helper';
import { htmlSafe } from '@ember/template';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Grid from './grid.gts';
import GridColumn from './grid/column.gts';
import GridColumnHang from './grid/column-hang.gts';
import GridRow from './grid/row.gts';
import GridSettings from './grid/settings.gts';

import type { TOC } from '@ember/component/template-only';

// Mirrors Carbon React's `Elements/Grid` stories (the CSS Grid). The Flexbox
// grid (React's `Elements/FlexGrid`) lives in `grid/row.stories.gts`.
// Story-only extras from the docs-app page: `SubgridGutterModes` and
// `Alignment`. No parity gaps: every React Grid/Column/ColumnHang/
// GridSettings prop exists here; the grid mode is picked with `@mode`
// instead of importing a different component.

const Box: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

const InnerBox: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

// Marks the true edge of the grid, so gutter differences are visible.
const Frame: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;"
  >
    {{yield}}
  </div>
</template>;

const OUTLINE = htmlSafe(
  'outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;',
);
const HANG = htmlSafe(
  'display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);',
);

const meta = preview.meta({
  title: 'Elements/Grid',
  component: Grid,
  subcomponents: { GridColumn, GridColumnHang, GridRow, GridSettings },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The 2x Grid is a flexible, 16-column grid system that can be used to build custom layouts. Carbon ships two layout engines for it, and \`Grid\` renders either one:

- **Flexbox grid** (the default, \`@mode="flexbox"\`) — a \`Grid\` renders one or more \`GridRow\`s, and each \`GridRow\` renders one or more \`GridColumn\`s. See *Elements/FlexGrid*.
- **CSS Grid** (\`@mode="css-grid"\`, these stories) — there are no rows; columns are direct children of the \`Grid\`. This mode additionally supports subgrids, percentage spans, and explicit \`start\`/\`end\` placement.

\`Grid\` yields \`Grid\`, \`Column\`, \`Row\` and \`ColumnHang\` components that are already bound to the surrounding grid's mode, so the mode is only picked once.

### Column span shorthand

\`GridColumn\` accepts a value for each breakpoint (\`sm\`, \`md\`, \`lg\`, \`xlg\`, \`max\`):

- \`true\` — the column takes up an equal share of the remaining space
- a \`number\` — the column spans that many columns
- an object like \`{{hash span=4 offset=2}}\` — the column spans \`span\` columns and is offset by \`offset\` columns

In \`css-grid\` mode a column additionally accepts a percentage (\`'25%'\`, \`'50%'\`, \`'75%'\`, \`'100%'\`) and \`start\`/\`end\` grid lines.`,
      },
    },
  },
  args: {
    mode: 'css-grid',
    align: 'center',
    condensed: false,
    fullWidth: false,
    narrow: false,
    withRowGap: false,
  },
  argTypes: {
    align: { control: 'radio', options: ['start', 'center', 'end'] },
    mode: { control: 'radio', options: ['css-grid', 'flexbox'] },
  },
  render: (args) => <template>
    <Frame>
      <Grid
        @mode={{args.mode}}
        @align={{args.align}}
        @condensed={{args.condensed}}
        @fullWidth={{args.fullWidth}}
        @narrow={{args.narrow}}
        @withRowGap={{args.withRowGap}}
        as |g|
      >
        <g.Column @sm={{4}}><Box>Column 1</Box></g.Column>
        <g.Column @sm={{4}}><Box>Column 2</Box></g.Column>
        <g.Column @sm={{4}}><Box>Column 3</Box></g.Column>
        <g.Column @sm={{4}}><Box>Column 4</Box></g.Column>
      </Grid>
    </Frame>
  </template>,
});

export const Default = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Pass `@mode="css-grid"` and render the yielded `Column` directly — the CSS Grid has no row element.',
      },
    },
  },
});

Default.test('renders a CSS Grid with columns', async ({ canvasElement }) => {
  const grid = canvasElement.querySelector('.cds--css-grid');
  await expect(grid).not.toBeNull();
  await expect(grid!.querySelectorAll('.cds--css-grid-column')).toHaveLength(4);
  await expect(grid!.querySelector('.cds--sm\\:col-span-4')).not.toBeNull();
});

export const WithRowGap = meta.story({
  args: { withRowGap: true },
  parameters: {
    docs: {
      description: {
        story:
          'Adds a row gap to the grid that matches the current gutter size, so columns that wrap onto a new row get consistent vertical spacing.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>1</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>2</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>3</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>4</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>5</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>6</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>7</Box></g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>8</Box></g.Column>
    </Grid>
  </template>,
});

export const Narrow = meta.story({
  args: { narrow: true },
  parameters: {
    docs: {
      description: {
        story:
          'The container hangs 16px into the gutter, which is useful for typographic alignment with and without containers. The dashed outline marks the true edge of the grid, so it’s easy to see that narrow halves the gutter between columns and lets the first/last column touch the edge, compared to the default grid.',
      },
    },
  },
});

Narrow.test('applies the narrow gutter', async ({ canvasElement }) => {
  await expect(
    canvasElement.querySelector('.cds--css-grid--narrow'),
  ).not.toBeNull();
});

export const Condensed = meta.story({
  args: { condensed: true },
  parameters: {
    docs: {
      description: {
        story:
          'Collapses the gutter to 1px, which is useful for fluid layouts. Compare the near-touching columns to the wide gutter in the default grid, and the still-visible gutter of the narrow grid.',
      },
    },
  },
});

export const FullWidth = meta.story({
  args: { fullWidth: true },
  parameters: {
    docs: {
      description: {
        story: 'Removes the default max width that the grid sets.',
      },
    },
  },
});

export const Responsive = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Each breakpoint can span a different number of columns, or a percentage of the grid. A span of `0` hides the column at that breakpoint.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column @sm={{2}} @md={{4}} @lg={{6}}>
        <Box>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 4 of 8</p>
          <p>Large: Span 6 of 16</p>
        </Box>
      </g.Column>
      <g.Column @sm={{2}} @md={{2}} @lg={{3}}>
        <Box>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 2 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Box>
      </g.Column>
      <g.Column @sm={{0}} @md={{2}} @lg={{3}}>
        <Box>
          <p>Small: Span 0 of 4</p>
          <p>Medium: Span 2 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Box>
      </g.Column>
      <g.Column @sm={{0}} @md={{0}} @lg={{4}}>
        <Box>
          <p>Small: Span 0 of 4</p>
          <p>Medium: Span 0 of 8</p>
          <p>Large: Span 4 of 16</p>
        </Box>
      </g.Column>
      <g.Column @sm="25%" @md="50%" @lg="75%">
        <Box>
          <p>Small: Span 25%</p>
          <p>Medium: Span 50%</p>
          <p>Large: Span 75%</p>
        </Box>
      </g.Column>
    </Grid>
  </template>,
});

export const Subgrid = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A `Grid` nested inside a CSS Grid renders as a subgrid, inheriting the column tracks of its parent instead of starting a new grid.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column @sm={{2}} @md={{4}} @lg={{3}}>
        <Box>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 4 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Box>
      </g.Column>
      <g.Column @sm={{2}} @md={{4}} @lg={{10}}>
        <Box>
          <p>Large: Span 10 of 16, containing a subgrid:</p>
        </Box>
        <g.Grid as |sub|>
          <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
            <InnerBox>2 of 10</InnerBox>
          </sub.Column>
          <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
            <InnerBox>2 of 10</InnerBox>
          </sub.Column>
          <sub.Column @sm={{0}} @md={{1}} @lg={{2}}>
            <InnerBox>2 of 10</InnerBox>
          </sub.Column>
          <sub.Column @sm={{0}} @md={{1}} @lg={{4}}>
            <InnerBox>4 of 10</InnerBox>
          </sub.Column>
        </g.Grid>
      </g.Column>
      <g.Column @sm={{0}} @md={{0}} @lg={{3}}>
        <Box>
          <p>Large: Span 3 of 16</p>
        </Box>
      </g.Column>
    </Grid>
  </template>,
});

Subgrid.test(
  'renders the nested grid as a subgrid',
  async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '.cds--css-grid .cds--subgrid.cds--subgrid--wide',
      ),
    ).not.toBeNull();
  },
);

export const SubgridGutterModes = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A subgrid picks up its own gutter mode from `@narrow` / `@condensed`, so wide, narrow and condensed subgrids can be mixed on the same page.',
      },
    },
  },
  render: () => <template>
    <h2 class="cds--label">Wide</h2>
    <Grid @mode="css-grid" as |g|>
      <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
        <g.Grid as |sub|>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>wide</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>wide</Box></sub.Column>
        </g.Grid>
      </g.Column>
    </Grid>

    <h2 class="cds--label">Narrow</h2>
    <Grid @mode="css-grid" @narrow={{true}} as |g|>
      <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
        <g.Grid @narrow={{true}} as |sub|>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box
            >narrow</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box
            >narrow</Box></sub.Column>
        </g.Grid>
      </g.Column>
    </Grid>

    <h2 class="cds--label">Condensed</h2>
    <Grid @mode="css-grid" @condensed={{true}} as |g|>
      <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
        <g.Grid @condensed={{true}} as |sub|>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box
            >condensed</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box
            >condensed</Box></sub.Column>
        </g.Grid>
      </g.Column>
    </Grid>
  </template>,
});

export const SubgridWithRowGap = meta.story({
  args: { withRowGap: true },
  parameters: {
    docs: {
      description: {
        story: '`@withRowGap` works on subgrids too.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
        <g.Grid @withRowGap={{args.withRowGap}} as |sub|>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>1</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>2</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>3</Box></sub.Column>
          <sub.Column @sm={{4}} @md={{4}} @lg={{8}}><Box>4</Box></sub.Column>
        </g.Grid>
      </g.Column>
    </Grid>
  </template>,
});

export const MixedGutterModes = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`ColumnHang` renders content that hangs into the gutter, so text stays aligned across grids that use different gutter modes. The dashed outline marks each column’s true boundary, so the shaded "Text" hang is visibly offset from it — by half a gutter in the narrow subgrid, and by nearly a full gutter in the condensed one.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @fullWidth={{args.fullWidth}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column @span={{8}}>
        <g.Grid @narrow={{true}} as |sub|>
          <sub.Column style={{OUTLINE}}>
            <sub.ColumnHang style={{HANG}}>Text</sub.ColumnHang>
          </sub.Column>
          <sub.Column style={{OUTLINE}}>
            <sub.ColumnHang style={{HANG}}>Text</sub.ColumnHang>
          </sub.Column>
          <sub.Column @span={{4}}>
            <sub.Grid @condensed={{true}} as |inner|>
              <inner.Column style={{OUTLINE}}>
                <inner.ColumnHang style={{HANG}}>Text</inner.ColumnHang>
              </inner.Column>
              <inner.Column style={{OUTLINE}}>
                <inner.ColumnHang style={{HANG}}>Text</inner.ColumnHang>
              </inner.Column>
            </sub.Grid>
          </sub.Column>
        </g.Grid>
      </g.Column>
    </Grid>
  </template>,
});

export const GridStartEnd = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Instead of an offset, a column can be placed on explicit grid lines with `start` and `end`.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column
        @sm={{hash span=1 start=4}}
        @md={{hash span=2 start=7}}
        @lg={{hash span=4 start=13}}
      >
        <Box>span, start</Box>
      </g.Column>
      <g.Column
        @sm={{hash span=2 end=5}}
        @md={{hash span=4 end=9}}
        @lg={{hash span=8 end=17}}
      >
        <Box>span, end</Box>
      </g.Column>
      <g.Column
        @sm={{hash start=1 end=4}}
        @md={{hash start=3 end=9}}
        @lg={{hash start=5 end=17}}
      >
        <Box>start, end</Box>
      </g.Column>
    </Grid>
  </template>,
});

export const Offset = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Pass an object with `span` and `offset` to push a column to the right.',
      },
    },
  },
  render: (args) => <template>
    <Grid
      @mode={{args.mode}}
      @align={{args.align}}
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Column
        @sm={{hash span=1 offset=3}}
        @md={{hash span=2 offset=6}}
        @lg={{hash span=4 offset=12}}
      >
        <Box>offset</Box>
      </g.Column>
      <g.Column
        @sm={{hash span=2 offset=2}}
        @md={{hash span=4 offset=4}}
        @lg={{hash span=8 offset=8}}
      >
        <Box>offset</Box>
      </g.Column>
      <g.Column
        @sm={{hash span=3 offset=1}}
        @md={{hash span=6 offset=2}}
        @lg={{hash span=12 offset=4}}
      >
        <Box>offset</Box>
      </g.Column>
      <g.Column @sm={{hash span=4}} @md={{hash span=8}} @lg={{hash span=16}}>
        <Box>no offset</Box>
      </g.Column>
      <g.Column
        @sm={{hash span="25%" offset=1}}
        @md={{hash span="50%" offset=2}}
        @lg={{hash span="75%" offset=4}}
      >
        <Box>percentage span</Box>
      </g.Column>
    </Grid>
  </template>,
});

export const Alignment = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`@align` positions the grid within its container. It defaults to `center` and only applies in `css-grid` mode. `@align` only has room to move the grid once its container is wider than the grid’s own max width, so the examples are placed in an artificially wide, dashed-outline container that’s wider than the grid itself.',
      },
    },
  },
  render: () => <template>
    <h2 class="cds--label">start</h2>
    <div
      style="width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;"
    >
      <Grid @mode="css-grid" @align="start" as |g|>
        <g.Column @sm={{4}}><Box>Column</Box></g.Column>
      </Grid>
    </div>
    <br />
    <h2 class="cds--label">end</h2>
    <div
      style="width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;"
    >
      <Grid @mode="css-grid" @align="end" as |g|>
        <g.Column @sm={{4}}><Box>Column</Box></g.Column>
      </Grid>
    </div>
  </template>,
});

export const WithGridSettings = meta.story({
  args: { subgrid: false },
  argTypes: {
    subgrid: {
      control: 'boolean',
      description: 'If true, will specify whether subgrid should be enabled',
    },
  },
  parameters: {
    controls: { include: ['mode', 'subgrid'] },
    docs: {
      description: {
        story:
          '`GridSettings` renders no markup of its own. It yields `Grid`, `Column`, `Row` and `ColumnHang` already bound to a mode, which is handy when a whole section of an app should share one grid mode. Passing `@subgrid={{true}}` makes the yielded `Grid` render as a subgrid of a surrounding CSS Grid.',
      },
    },
  },
  render: (args) => <template>
    <GridSettings @mode={{args.mode}} @subgrid={{args.subgrid}} as |g|>
      <g.Grid>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>Column 1</Box></g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>Column 2</Box></g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>Column 3</Box></g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}><Box>Column 4</Box></g.Column>
      </g.Grid>
    </GridSettings>
  </template>,
});
