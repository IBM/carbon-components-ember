import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Grid from '../grid.gts';
import GridColumn from './column.gts';

import type { TOC } from '@ember/component/template-only';
import type { GridColumnSignature } from './column.gts';

// Carbon React has no stories of its own for Column: it's a subcomponent of
// Elements/Grid and Elements/FlexGrid. The controls drive the highlighted
// first column; its two siblings span the rest of the grid.

const Box: TOC<{ Blocks: { default: [] } }> = <template>
  <div
    style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;"
  >
    {{yield}}
  </div>
</template>;

const Columns: TOC<{ Args: { args: GridColumnSignature['Args'] } }> = <template>
  <GridColumn
    @as={{@args.as}}
    @mode={{@args.mode}}
    @sm={{@args.sm}}
    @md={{@args.md}}
    @lg={{@args.lg}}
    @xlg={{@args.xlg}}
    @max={{@args.max}}
    @span={{@args.span}}
    style="outline: 2px solid var(--cds-focus, #0f62fe); outline-offset: -2px;"
  >
    <Box>GridColumn</Box>
  </GridColumn>
  <GridColumn @mode={{@args.mode}} @sm={{1}} @md={{2}} @lg={{4}}>
    <Box>Sibling</Box>
  </GridColumn>
  <GridColumn @mode={{@args.mode}} @sm={{1}} @md={{2}} @lg={{4}}>
    <Box>Sibling</Box>
  </GridColumn>
</template>;

const isFlexbox = (mode: string | undefined) => mode === 'flexbox';

const meta = preview.meta({
  title: 'Elements/Grid/GridColumn',
  component: GridColumn,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `A column of the 2x Grid. Render the \`Column\` yielded by \`Grid\` (or \`GridSettings\`), which already has the grid's \`@mode\`: in the CSS Grid it's a direct child of the \`Grid\`, in the Flexbox grid it goes inside a \`GridRow\`.

Each breakpoint arg (\`@sm\`, \`@md\`, \`@lg\`, \`@xlg\`, \`@max\`) takes \`true\` (an equal share of the remaining space), a number of columns, or an object like \`{{hash span=4 offset=2}}\`. In \`css-grid\` mode a column also takes a percentage (\`'25%'\` ... \`'100%'\`), \`start\`/\`end\` grid lines, and a breakpoint-independent \`@span\`. See *Elements/Grid* for examples.`,
      },
    },
  },
  argTypes: {
    mode: { control: 'radio', options: ['css-grid', 'flexbox'] },
    as: { control: 'text' },
  },
  args: {
    mode: 'css-grid',
    sm: 2,
    md: 4,
    lg: 8,
  },
  render: (args) => <template>
    <Grid @mode={{args.mode}} as |g|>
      {{#if (isFlexbox args.mode)}}
        <g.Row><Columns @args={{args}} /></g.Row>
      {{else}}
        <Columns @args={{args}} />
      {{/if}}
    </Grid>
  </template>,
});

export const Default = meta.story();

Default.test('applies the breakpoint spans', async ({ canvasElement }) => {
  const column = canvasElement.querySelector('.cds--css-grid > *');
  await expect(column).toHaveClass(
    'cds--css-grid-column',
    'cds--sm:col-span-2',
    'cds--md:col-span-4',
    'cds--lg:col-span-8',
  );
});
