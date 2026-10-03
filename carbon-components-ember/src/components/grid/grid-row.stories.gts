import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Grid from '../grid.gts';
import GridRow from './row.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React has no stories of its own for Row: it's a subcomponent of
// Elements/FlexGrid. (`row.stories.gts`, next to this file, is the
// Elements/FlexGrid page itself.) Both rows here take the controls, so the
// effect of `@condensed` on adjacent rows is visible.

const DemoContent: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

const meta = preview.meta({
  title: 'Elements/Grid/GridRow',
  component: GridRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A row of the Flexbox grid: render it (the `Row` yielded by `Grid`) inside a flexbox `Grid` or `FlexGrid`, and the columns inside it. The CSS Grid has no rows. `@condensed` and `@narrow` change the gutter of a single row. See *Elements/FlexGrid* for examples.',
      },
    },
  },
  argTypes: {
    as: { control: 'text' },
  },
  args: {
    condensed: false,
    narrow: false,
  },
  render: (args) => <template>
    <Grid as |g|>
      <GridRow
        @as={{args.as}}
        @condensed={{args.condensed}}
        @narrow={{args.narrow}}
      >
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
        <g.Column><DemoContent>1/4</DemoContent></g.Column>
      </GridRow>
      <GridRow
        @as={{args.as}}
        @condensed={{args.condensed}}
        @narrow={{args.narrow}}
      >
        <g.Column><DemoContent>1/2</DemoContent></g.Column>
        <g.Column><DemoContent>1/2</DemoContent></g.Column>
      </GridRow>
    </Grid>
  </template>,
});

export const Default = meta.story();

Default.test('renders flexbox rows', async ({ canvasElement }) => {
  const rows = canvasElement.querySelectorAll('.cds--grid > .cds--row');
  await expect(rows).toHaveLength(2);
  await expect(rows[0]!.querySelectorAll(':scope > .cds--col')).toHaveLength(4);
});
