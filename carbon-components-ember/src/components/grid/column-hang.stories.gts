import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Grid from '../grid.gts';
import ColumnHang from './column-hang.gts';
import '#storybook/styles/grid/column-hang.css';

// Carbon React has no stories of its own for ColumnHang: it's a
// subcomponent of Elements/Grid (see its `MixedGutterModes` story).

const meta = preview.meta({
  title: 'Elements/Grid/ColumnHang',
  component: ColumnHang,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders content that hangs into the gutter of the `Column` it’s in, so text stays aligned across grids that use different gutter modes. Render the `ColumnHang` yielded by `Grid` inside one of its columns. The dashed outlines mark each column’s true boundary; the shaded "Text" hangs into the gutter, offset from it. See the `MixedGutterModes` story of *Elements/Grid*.',
      },
    },
  },
  argTypes: {
    as: { control: 'text' },
  },
  render: (args) => <template>
    <Grid @mode="css-grid" as |g|>
      <g.Column
        @sm={{2}}
        @md={{4}}
        @lg={{8}}
        class="grid-column-hang-story__outline"
      >
        <ColumnHang
          @as={{args.as}}
          class="grid-column-hang-story__hang"
        >Text</ColumnHang>
      </g.Column>
      <g.Column
        @sm={{2}}
        @md={{4}}
        @lg={{8}}
        class="grid-column-hang-story__outline"
      >
        <ColumnHang
          @as={{args.as}}
          class="grid-column-hang-story__hang"
        >Text</ColumnHang>
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
