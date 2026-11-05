import { trackedObject } from '@ember/reactive/collections';
import { expect, userEvent } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';

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
// React's `Column AI Label Sort` (DataTable/WithAILabel) puts an AI label in
// a sortable DataTable's headers; `ColumnAILabelSort` does it by hand.

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
        component: `\`TableHeader\` is a column header. With \`@isSortable\` it renders Carbon's sort button and icons; \`@isSortHeader\` and \`@sortDirection\` (\`NONE\`, \`ASC\` or \`DESC\`, as \`sortStates\`) say which header the table is sorted by, and an \`{{on "click"}}\` on the header runs when the button is clicked. The table keeps the sort state. \`@translateWithId\` translates the button's description. Put a column's AI label in the \`<:decorator>\` block.

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

// **Experimental:** the `<:decorator>` block yields an `AILabel` already
// sized for the header (`mini`); the header's text goes in `<:default>`.
export const ColumnAILabelSort = meta.story({
  render: () => <template>
    <Table @isSortable={{true}} aria-label="Load balancers">
      <TableHead>
        <TableRow>
          <TableHeader @isSortable={{true}}>
            <:default>Name</:default>
            <:decorator as |AILabel|>
              <AILabel @align="bottom-start" as |label|>
                <label.Content><AIExplanation /></label.Content>
              </AILabel>
            </:decorator>
          </TableHeader>
          <TableHeader @isSortable={{true}}>Protocol</TableHeader>
          <TableHeader @isSortable={{true}}>Port</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {{#each ROWS as |row|}}
          <TableRow>
            <TableCell @hasAILabelHeader={{true}}>{{row.name}}</TableCell>
            <TableCell>{{row.protocol}}</TableCell>
            <TableCell>{{row.port}}</TableCell>
          </TableRow>
        {{/each}}
      </TableBody>
    </Table>
  </template>,
});

ColumnAILabelSort.test(
  'shows the AI label beside the sortable label',
  async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /Show information/ }),
    ).toBeVisible();
  },
);
