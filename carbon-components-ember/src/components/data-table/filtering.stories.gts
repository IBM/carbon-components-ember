import { expect, fn as spy } from 'storybook/test';

import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';
import TableBody from '../table/table-body.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { TableArgs } from '#storybook/fixtures/data-table.gts';
import type { FilterRowsFn } from '../data-table.gts';

// Carbon React's `DataTable/Filtering` page: `Default`. `ByName` is
// Ember-only.
//
// Parity gaps:
// - React's `TableToolbarFilter` example, a filter menu of checkboxes that
//   replaces the rows. It is an example in Carbon's repository, not part of
//   `@carbon/react` or the addon: the table filters with the toolbar search
//   and `@filterRows`. The empty state React shows when no row matches is
//   another such example (`examples/EmptyState`); the addon's IBM Products
//   `EmptyState` is a different design.

type StoryArgs = TableArgs & {
  onAction: (action: string) => void;
  onClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Filtering',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `Give a \`TableToolbarSearch\` \`@onChange={{table.onInputChange}}\` and the table shows the rows with a cell that contains the search, ignoring case. \`@filterRows\` replaces that: it gets the \`inputValue\`, the \`headers\`, the \`rowIds\` and the cells by id, and returns the ids to show.

\`\`\`gts
<DataTable @rows={{this.rows}} @headers={{this.headers}} as |table|>
  <table.TableToolbar as |Content|>
    <Content as |Search|>
      <Search @onChange={{table.onInputChange}} />
    </Content>
  </table.TableToolbar>
  {{! the table }}
</DataTable>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    rows: ROWS,
    headers: HEADERS,
    onAction: spy(),
    onClick: spy(),
  },
  argTypes: DATA_TABLE_ARG_TYPES,
  render: (args: StoryArgs) => <template>
    <DataTable
      @rows={{args.rows}}
      @headers={{args.headers}}
      @isSortable={{args.isSortable}}
      @locale={{args.locale}}
      @size={{args.size}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      @useZebraStyles={{args.useZebraStyles}}
      @filterRows={{args.filterRows}}
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With filtering"
        as |Table|
      >
        <table.TableToolbar as |Content|>
          <Content as |Search Menu|>
            <Search @onChange={{table.onInputChange}} />
            <Menu as |Action|>
              <Action {{on "click" (fn args.onAction "Action 1")}}>Action 1</Action>
              <Action {{on "click" (fn args.onAction "Action 2")}}>Action 2</Action>
              <Action {{on "click" (fn args.onAction "Action 3")}}>Action 3</Action>
            </Menu>
            <Button {{on "click" args.onClick}}>Primary Button</Button>
          </Content>
        </table.TableToolbar>
        <Table>
          <TableHead>
            <TableRow>
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableRow @row={{row}}>
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
              </table.TableRow>
            {{/each}}
          </TableBody>
        </Table>
      </table.TableContainer>
    </DataTable>
  </template>,
});

export const Default = meta.story();

Default.test(
  'filters rows by the search term',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
    const search = canvas.getByRole('searchbox');
    await userEvent.type(search, 'dns');
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
    await expect(canvas.getByText('Load Balancer 2')).toBeVisible();
    await expect(canvas.getByText('Load Balancer 5')).toBeVisible();

    await userEvent.clear(search);
    await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
  },
);

// Shows the rows whose name contains the search.
const byName: FilterRowsFn = ({ cellsById, getCellId, inputValue, rowIds }) =>
  rowIds.filter((rowId) =>
    String(cellsById[getCellId(rowId, 'name')]?.value)
      .toLowerCase()
      .includes(inputValue.trim().toLowerCase()),
  );

export const ByName = meta.story({
  args: { filterRows: byName },
  argTypes: { filterRows: { control: false } },
  parameters: {
    docs: {
      description: {
        story:
          'A custom `@filterRows` that searches the name column alone, so `dns` finds nothing.',
      },
    },
  },
});

ByName.test('searches the name column only', async ({ canvas, userEvent }) => {
  const search = canvas.getByRole('searchbox');
  await userEvent.type(search, 'dns');
  await expect(canvas.getAllByRole('row')).toHaveLength(1);
  await userEvent.clear(search);
  await userEvent.type(search, 'balancer 2');
  await expect(canvas.getAllByRole('row')).toHaveLength(2);
});
