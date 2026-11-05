import { expect } from 'storybook/test';

import { ROWS, HEADERS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Table from './table.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableHead from './table-head.gts';
import TableHeader from './table-header.gts';
import TableRow from './table-row.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React has no standalone stories for the table parts: its DataTable
// stories render them through DataTable's render prop. These build the tables
// of its `Basic` page by hand (`Default`, `ExtraSmall`, `XLWithTwoLines`),
// plus `Zebra`, `StickyHeader` and `StaticWidth`. `TableHeader` has its own
// sorting stories.
//
// A sticky header scrolls the rows, so the table takes `tabindex="0"` to be
// reachable from the keyboard.
//
// Parity gaps: `experimentalAutoAlign` is not ported.

const Rows: TOC<{ Args: { twoLines?: boolean } }> = <template>
  <TableHead>
    <TableRow>
      {{#each HEADERS as |header|}}
        <TableHeader>{{header.label}}</TableHeader>
      {{/each}}
    </TableRow>
  </TableHead>
  <TableBody>
    {{#each ROWS as |row|}}
      <TableRow>
        <TableCell>
          {{#if @twoLines}}
            <div>{{row.name}}</div>
            <div class="cds--label">{{row.id}}</div>
          {{else}}
            {{row.name}}
          {{/if}}
        </TableCell>
        <TableCell>{{row.protocol}}</TableCell>
        <TableCell>{{row.port}}</TableCell>
        <TableCell>{{row.rule}}</TableCell>
        <TableCell>{{row.attached_groups}}</TableCell>
        <TableCell>{{row.status}}</TableCell>
      </TableRow>
    {{/each}}
  </TableBody>
</template>;

type StoryArgs = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useZebraStyles: boolean;
  useStaticWidth: boolean;
  stickyHeader: boolean;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Table/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `\`Table\` and its parts build a data table by hand, as Carbon React's \`Table\`, \`TableHead\`, \`TableBody\`, \`TableRow\`, \`TableHeader\` and \`TableCell\`, imported from \`carbon-components-ember/components\`. They render Carbon's markup and take its options (\`@size\`, \`@useZebraStyles\`, \`@stickyHeader\`, \`@useStaticWidth\`); the rows, sorting and selection are yours to keep. Wrap the table in \`TableContainer\` for a title and description.

\`\`\`gts
<Table @size="md">
  <TableHead>
    <TableRow><TableHeader>Name</TableHeader></TableRow>
  </TableHead>
  <TableBody>
    <TableRow><TableCell>Load Balancer 3</TableCell></TableRow>
  </TableBody>
</Table>
\`\`\``,
      },
    },
  },
  args: {
    size: 'lg',
    useZebraStyles: false,
    useStaticWidth: false,
    stickyHeader: false,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  render: (args: StoryArgs) => <template>
    <Table
      @size={{args.size}}
      @useZebraStyles={{args.useZebraStyles}}
      @useStaticWidth={{args.useStaticWidth}}
      @stickyHeader={{args.stickyHeader}}
      aria-label="Load balancers"
      tabindex={{if args.stickyHeader "0"}}
    >
      <Rows />
    </Table>
  </template>,
});

export const Default = meta.story();

Default.test('renders a row per item', async ({ canvas }) => {
  await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
  await expect(
    canvas.getByRole('columnheader', { name: 'Name' }),
  ).toHaveAttribute('scope', 'col');
});

export const ExtraSmall = meta.story({ args: { size: 'xs' } });

export const XLWithTwoLines = meta.story({
  args: { size: 'xl' },
  render: (args: StoryArgs) => <template>
    <Table
      @size={{args.size}}
      @useZebraStyles={{args.useZebraStyles}}
      aria-label="Load balancers"
    >
      <Rows @twoLines={{true}} />
    </Table>
  </template>,
});

export const Zebra = meta.story({ args: { useZebraStyles: true } });

export const StickyHeader = meta.story({
  args: { stickyHeader: true },
});

export const StaticWidth = meta.story({ args: { useStaticWidth: true } });
