import { hash } from '@ember/helper';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import { FlexGrid } from '../grid.gts';

import type { TOC } from '@ember/component/template-only';

// Mirrors Carbon React's `Elements/FlexGrid` stories. `FlexGrid` is exported
// from `grid.gts` (an always-flexbox `Grid`), so these live next to `Row`,
// the flexbox-only building block, while `grid.stories.gts` covers the CSS
// Grid (`Elements/Grid`).
//
// Parity gap: React's FlexGrid stories expose an `align` control, but
// alignment only applies to the CSS Grid, so `FlexGrid` here ignores it
// (as React's FlexGrid does too) and the control is left out.

const DemoContent: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

const meta = preview.meta({
  title: 'Elements/FlexGrid',
  component: FlexGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The Flexbox flavour of the 2x Grid: a grid renders one or more `Row`s, and each `Row` renders one or more `Column`s. `FlexGrid` is an always-flexbox alias of `Grid` (whose default `@mode` is `flexbox` anyway), for parity with Carbon React. See *Elements/Grid* for the column span shorthand and the CSS Grid.',
      },
    },
  },
  args: {
    condensed: false,
    fullWidth: false,
    narrow: false,
    withRowGap: false,
  },
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const AutoColumns = meta.story({
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>Span 25%</DemoContent></g.Column>
        <g.Column><DemoContent>Span 25%</DemoContent></g.Column>
        <g.Column><DemoContent>Span 25%</DemoContent></g.Column>
        <g.Column><DemoContent>Span 25%</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

AutoColumns.test(
  'renders flexbox rows and auto columns',
  async ({ canvasElement }) => {
    const row = canvasElement.querySelector('.cds--grid > .cds--row');
    await expect(row).not.toBeNull();
    await expect(row!.querySelectorAll(':scope > .cds--col')).toHaveLength(4);
  },
);

export const ResponsiveGrid = meta.story({
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column @sm={{2}} @md={{4}} @lg={{6}}>
          <DemoContent>
            <p>Small: Span 2 of 4</p>
            <p>Medium: Span 4 of 8</p>
            <p>Large: Span 6 of 16</p>
          </DemoContent>
        </g.Column>
        <g.Column @sm={{2}} @md={{2}} @lg={{3}}>
          <DemoContent>
            <p>Small: Span 2 of 4</p>
            <p>Medium: Span 2 of 8</p>
            <p>Large: Span 3 of 16</p>
          </DemoContent>
        </g.Column>
        <g.Column @sm={{0}} @md={{2}} @lg={{3}}>
          <DemoContent>
            <p>Small: Span 0 of 4</p>
            <p>Medium: Span 2 of 8</p>
            <p>Large: Span 3 of 16</p>
          </DemoContent>
        </g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const Offset = meta.story({
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column @sm={{hash span=1 offset=3}}>
          <DemoContent>Small: offset 3</DemoContent>
        </g.Column>
        <g.Column @sm={{hash span=2 offset=2}}>
          <DemoContent>Small: offset 2</DemoContent>
        </g.Column>
        <g.Column @sm={{hash span=3 offset=1}}>
          <DemoContent>Small: offset 1</DemoContent>
        </g.Column>
        <g.Column @sm={{hash span=4 offset=0}}>
          <DemoContent>Small: offset 0</DemoContent>
        </g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const Condensed = meta.story({
  args: { condensed: true },
});

export const CondensedColumns = meta.story({
  render: (args) => <template>
    <FlexGrid
      @fullWidth={{args.fullWidth}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
      <g.Row @condensed={{true}}>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
      <g.Row>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const Narrow = meta.story({
  args: { narrow: true },
});

export const NarrowColumns = meta.story({
  render: (args) => <template>
    <FlexGrid
      @fullWidth={{args.fullWidth}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
      <g.Row @narrow={{true}}>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
      <g.Row>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const FullWidth = meta.story({
  args: { fullWidth: true },
});

export const MixedGutterModes = meta.story({
  render: (args) => <template>
    <FlexGrid
      @fullWidth={{args.fullWidth}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>Wide</DemoContent></g.Column>
        <g.Column><DemoContent>Wide</DemoContent></g.Column>
        <g.Column><DemoContent>Wide</DemoContent></g.Column>
        <g.Column><DemoContent>Wide</DemoContent></g.Column>
      </g.Row>
      <g.Row @narrow={{true}}>
        <g.Column><DemoContent>Narrow</DemoContent></g.Column>
        <g.Column><DemoContent>Narrow</DemoContent></g.Column>
        <g.Column><DemoContent>Narrow</DemoContent></g.Column>
        <g.Column><DemoContent>Narrow</DemoContent></g.Column>
      </g.Row>
      <g.Row @condensed={{true}}>
        <g.Column><DemoContent>Condensed</DemoContent></g.Column>
        <g.Column><DemoContent>Condensed</DemoContent></g.Column>
        <g.Column><DemoContent>Condensed</DemoContent></g.Column>
        <g.Column><DemoContent>Condensed</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const Default = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'The first docs-app example: a `Grid` (flexbox is its default mode) with one `GridRow` of auto columns, and one with responsive spans.',
      },
    },
  },
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column><DemoContent>Column 1</DemoContent></g.Column>
        <g.Column><DemoContent>Column 2</DemoContent></g.Column>
        <g.Column><DemoContent>Column 3</DemoContent></g.Column>
        <g.Column><DemoContent>Column 4</DemoContent></g.Column>
      </g.Row>
    </FlexGrid>
    <br />
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column @sm={{2}} @md={{4}} @lg={{6}}>
          <DemoContent>Span 2 of 4 / 4 of 8 / 6 of 16</DemoContent>
        </g.Column>
        <g.Column @sm={{2}} @md={{4}} @lg={{10}}>
          <DemoContent>Span 2 of 4 / 4 of 8 / 10 of 16</DemoContent>
        </g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});

export const WithRowGap = meta.story({
  args: { withRowGap: true },
  render: (args) => <template>
    <FlexGrid
      @condensed={{args.condensed}}
      @fullWidth={{args.fullWidth}}
      @narrow={{args.narrow}}
      @withRowGap={{args.withRowGap}}
      as |g|
    >
      <g.Row>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 1, Col 1</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 1, Col 2</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 1, Col 3</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 1, Col 4</DemoContent>
        </g.Column>
      </g.Row>
      <g.Row>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 2, Col 1</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 2, Col 2</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 2, Col 3</DemoContent>
        </g.Column>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <DemoContent>Row 2, Col 4</DemoContent>
        </g.Column>
      </g.Row>
    </FlexGrid>
  </template>,
});
