import { expect } from 'storybook/test';

import { ROWS, HEADERS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import TableContainer from './table-container.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableHead from './table-head.gts';
import TableHeader from './table-header.gts';
import TableRow from './table-row.gts';

// Carbon React has no standalone stories for `TableContainer`; its DataTable
// stories pass the title and description to DataTable. `Default` and
// `StickyHeader` are Ember-only.
//
// A sticky header scrolls the rows, so the table takes `tabindex="0"` to be
// reachable from the keyboard.
//
// Parity gaps: the title is always an `<h2>`, where React's follows the
// surrounding `Section` and heading levels.

type StoryArgs = {
  title: string;
  description: string;
  stickyHeader: boolean;
  useStaticWidth: boolean;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Table/TableContainer',
  component: TableContainer,
  parameters: {
    docs: {
      description: {
        component: `\`TableContainer\` gives a hand-built table its title and description, as Carbon React's. It yields a \`Table\` that the title and description name for assistive technology (\`aria-labelledby\` and \`aria-describedby\`). Put an AI label or other decorator beside the title in the \`<:decorator>\` block.

\`\`\`gts
<TableContainer @title="Load balancers" @description="Across all regions" as |Table|>
  <Table>…</Table>
</TableContainer>
\`\`\``,
      },
    },
  },
  args: {
    title: 'Load balancers',
    description: 'Across all regions',
    stickyHeader: false,
    useStaticWidth: false,
  },
  render: (args: StoryArgs) => <template>
    <TableContainer
      @title={{args.title}}
      @description={{args.description}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      as |Table|
    >
      <Table
        @stickyHeader={{args.stickyHeader}}
        tabindex={{if args.stickyHeader "0"}}
      >
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
              <TableCell>{{row.name}}</TableCell>
              <TableCell>{{row.protocol}}</TableCell>
              <TableCell>{{row.port}}</TableCell>
              <TableCell>{{row.rule}}</TableCell>
              <TableCell>{{row.attached_groups}}</TableCell>
              <TableCell>{{row.status}}</TableCell>
            </TableRow>
          {{/each}}
        </TableBody>
      </Table>
    </TableContainer>
  </template>,
});

export const Default = meta.story();

Default.test(
  'names the table by its title and description',
  async ({ canvas }) => {
    await expect(
      canvas.getByRole('table', { name: 'Load balancers' }),
    ).toHaveAccessibleDescription('Across all regions');
  },
);

export const StickyHeader = meta.story({ args: { stickyHeader: true } });
