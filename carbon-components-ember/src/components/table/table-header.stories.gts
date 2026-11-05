import { trackedObject } from '@ember/reactive/collections';
import { expect, userEvent } from 'storybook/test';

import { ROWS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Table from './table.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableHead from './table-head.gts';
import TableHeader, { sortStates } from './table-header.gts';
import TableRow from './table-row.gts';

import type { SortState } from './table-header.gts';

// Carbon React's `Sorting` page sorts through DataTable's state. These sort
// by hand: the table keeps the sort and the rows, as an app that builds its
// own does.
//
// Parity gaps: `decorator` (an AI label in the header) is not ported.

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'protocol', label: 'Protocol' },
  { key: 'port', label: 'Port' },
  { key: 'status', label: 'Status' },
] as const;

type Key = (typeof COLUMNS)[number]['key'];

const NEXT: Record<SortState, SortState> = {
  NONE: sortStates.ASC,
  ASC: sortStates.DESC,
  DESC: sortStates.NONE,
};

const meta = preview.meta({
  title: 'Components/Table/TableHeader',
  component: TableHeader,
  parameters: {
    docs: {
      description: {
        component: `\`TableHeader\` is a column header. With \`@isSortable\` it renders Carbon's sort button and icons; \`@isSortHeader\` and \`@sortDirection\` (\`NONE\`, \`ASC\` or \`DESC\`, as \`sortStates\`) say which header the table is sorted by, and an \`{{on "click"}}\` on the header runs when the button is clicked. The table keeps the sort state. \`@translateWithId\` translates the button's description.

\`\`\`gts
<TableHeader
  @isSortable={{true}}
  @isSortHeader={{this.sortKey "name"}}
  @sortDirection={{this.direction}}
  {{on "click" this.sortByName}}
>Name</TableHeader>
\`\`\``,
      },
    },
  },
  render: () => {
    const state = trackedObject<{ key: Key | null; direction: SortState }>({
      key: null,
      direction: sortStates.NONE,
    });
    const sortBy = (key: Key) => () => {
      state.direction = state.key === key ? NEXT[state.direction] : 'ASC';
      state.key = state.key === key && state.direction === 'NONE' ? null : key;
    };
    const rows = () => {
      const { key, direction } = state;
      if (!key || direction === 'NONE') return ROWS;
      const sign = direction === 'ASC' ? 1 : -1;
      return [...ROWS].sort(
        (a, b) => sign * String(a[key]).localeCompare(String(b[key])),
      );
    };
    return <template>
      <Table @isSortable={{true}} aria-label="Load balancers">
        <TableHead>
          <TableRow>
            {{#each COLUMNS as |column|}}
              <TableHeader
                @isSortable={{true}}
                @isSortHeader={{if (eq state.key column.key) true}}
                @sortDirection={{if (eq state.key column.key) state.direction}}
                {{on "click" (sortBy column.key)}}
              >{{column.label}}</TableHeader>
            {{/each}}
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each (rows) as |row|}}
            <TableRow>
              <TableCell>{{row.name}}</TableCell>
              <TableCell>{{row.protocol}}</TableCell>
              <TableCell>{{row.port}}</TableCell>
              <TableCell>{{row.status}}</TableCell>
            </TableRow>
          {{/each}}
        </TableBody>
      </Table>
    </template>;
  },
});

export const Sorting = meta.story();

Sorting.test(
  'sorts by a header, then reverses, then clears',
  async ({ canvas }) => {
    const nameCells = () =>
      canvas
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.firstElementChild!.textContent.trim());
    const header = canvas.getByRole('columnheader', { name: /Name/ });
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(nameCells()).toEqual([...nameCells()].sort());
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(header).toHaveAttribute('aria-sort', 'none');
  },
);
