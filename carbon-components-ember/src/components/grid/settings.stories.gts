import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import GridSettings from './settings.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React's GridSettings has no stories of its own (it's the
// `WithGridSettings` story of Elements/Grid).

const Box: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

const meta = preview.meta({
  title: 'Elements/Grid/GridSettings',
  component: GridSettings,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`GridSettings` renders no markup of its own. It yields `Grid`, `Column`, `Row` and `ColumnHang` already bound to `@mode`, which is handy when a whole section of an app should share one grid mode. `@subgrid={{true}}` makes the yielded `Grid` render as a subgrid of a surrounding CSS Grid. See *Elements/Grid*.',
      },
    },
  },
  argTypes: {
    mode: { control: 'radio', options: ['css-grid', 'flexbox'] },
  },
  args: {
    mode: 'css-grid',
    subgrid: false,
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

export const Default = meta.story();

Default.test(
  'binds the mode to the yielded grid',
  async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.cds--css-grid');
    await expect(grid).not.toBeNull();
    await expect(
      grid!.querySelectorAll(':scope > .cds--css-grid-column'),
    ).toHaveLength(4);
  },
);
