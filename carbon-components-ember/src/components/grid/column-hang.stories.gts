import { htmlSafe } from '@ember/template';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Grid from '../grid.gts';
import GridColumnHang from './column-hang.gts';

// Carbon React has no stories of its own for ColumnHang: it's a
// subcomponent of Elements/Grid (see its `MixedGutterModes` story).

const OUTLINE = htmlSafe(
  'outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;',
);
const HANG = htmlSafe(
  'display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);',
);

const meta = preview.meta({
  title: 'Elements/Grid/GridColumnHang',
  component: GridColumnHang,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders content that hangs into the gutter of the `GridColumn` it’s in, so text stays aligned across grids that use different gutter modes. Render the `ColumnHang` yielded by `Grid` inside one of its columns. The dashed outlines mark each column’s true boundary; the shaded "Text" hangs into the gutter, offset from it. See the `MixedGutterModes` story of *Elements/Grid*.',
      },
    },
  },
  argTypes: {
    as: { control: 'text' },
  },
  render: (args) => <template>
    <Grid @mode="css-grid" as |g|>
      <g.Column @sm={{2}} @md={{4}} @lg={{8}} style={{OUTLINE}}>
        <GridColumnHang @as={{args.as}} style={{HANG}}>Text</GridColumnHang>
      </g.Column>
      <g.Column @sm={{2}} @md={{4}} @lg={{8}} style={{OUTLINE}}>
        <GridColumnHang @as={{args.as}} style={{HANG}}>Text</GridColumnHang>
      </g.Column>
    </Grid>
  </template>,
});

export const Default = meta.story();

Default.test('renders inside the column', async ({ canvasElement }) => {
  const hangs = canvasElement.querySelectorAll(
    '.cds--css-grid-column > .cds--grid-column-hang',
  );
  await expect(hangs).toHaveLength(2);
});
