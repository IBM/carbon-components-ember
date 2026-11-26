import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';

import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  MANY_ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';
import Pagination from '../pagination.gts';
import TableBody from '../table/table-body.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { TableArgs } from '#storybook/fixtures/data-table.gts';
import type { PaginationChange } from '../pagination.gts';

// Carbon React's `DataTable/Pagination` page: `Default`.
//
// Parity gaps:
// - React's empty state when no row matches the search: its `EmptyState` is
//   an example in Carbon's repository (`examples/EmptyState`), not part of
//   `@carbon/react`. The addon's IBM Products `EmptyState` is another design.

type StoryArgs = TableArgs & {
  onAction: (action: string) => void;
  onClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Pagination',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`DataTable\` doesn't page its rows. Filter them yourself, give the table the page's slice, and put a \`Pagination\` under it: its \`@onChange\` gets the \`page\` and \`pageSize\`, and its \`@totalItems\` is the number of rows to page through.

\`\`\`gts
<DataTable @rows={{this.slice}} @headers={{this.headers}} as |table|>
  {{! the table }}
</DataTable>
<Pagination
  @page={{this.page}}
  @pageSize={{this.pageSize}}
  @pageSizes={{this.pageSizes}}
  @totalItems={{this.rows.length}}
  @onChange={{this.change}}
/>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    rows: MANY_ROWS,
    headers: HEADERS,
    onAction: spy(),
    onClick: spy(),
  },
  argTypes: DATA_TABLE_ARG_TYPES,
  render: (args: StoryArgs) => {
    const state = trackedObject({ search: '', page: 1, pageSize: 10 });
    const filtered = () => {
      const search = state.search.trim().toLowerCase();
      return search === ''
        ? args.rows
        : args.rows.filter((row) =>
            Object.values(row).some((value) =>
              String(value).toLowerCase().includes(search),
            ),
          );
    };
    const page = () =>
      filtered().slice(
        (state.page - 1) * state.pageSize,
        state.page * state.pageSize,
      );
    const length = () => filtered().length;
    const paginationSize = () => (args.size === 'xl' ? 'lg' : args.size);
    const search = (_event: unknown, value?: string) => {
      state.search = value ?? '';
      state.page = 1;
    };
    const change = (change: PaginationChange) => {
      state.page = change.page;
      state.pageSize = change.pageSize;
    };

    return <template>
      <DataTable
        @rows={{(page)}}
        @headers={{args.headers}}
        @isSortable={{args.isSortable}}
        @locale={{args.locale}}
        @size={{args.size}}
        @stickyHeader={{args.stickyHeader}}
        @useStaticWidth={{args.useStaticWidth}}
        @useZebraStyles={{args.useZebraStyles}}
        as |table|
      >
        <table.TableContainer
          @title="Load Balancers"
          @description="Paginated data table with persistent toolbar"
          as |Table|
        >
          <table.TableToolbar as |Content|>
            <Content as |Search Menu|>
              <Search @persistent={{true}} @onChange={{search}} />
              <Menu as |Action|>
                <Action {{on "click" (fn args.onAction "Action 1")}}>Action 1</Action>
                <Action {{on "click" (fn args.onAction "Action 2")}}>Action 2</Action>
                <Action {{on "click" (fn args.onAction "Action 3")}}>Action 3</Action>
              </Menu>
              <Button {{on "click" args.onClick}}>Primary Button</Button>
            </Content>
          </table.TableToolbar>
          <Table aria-label="paginated table">
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
      {{#if (length)}}
        <Pagination
          @page={{state.page}}
          @pageSize={{state.pageSize}}
          @pageSizes={{PAGE_SIZES}}
          @size={{(paginationSize)}}
          @totalItems={{(length)}}
          @onChange={{change}}
        />
      {{/if}}
    </template>;
  },
});

const PAGE_SIZES = [10, 20, 30, 40, 50];

export const Default = meta.story();

Default.test(
  'pages through the rows and searches them',
  async ({ canvas, userEvent }) => {
    const body = () => canvas.getAllByRole('rowgroup')[1]!;
    await expect(body().querySelectorAll('tr')).toHaveLength(10);
    await expect(canvas.getByText('Load Balancer 1')).toBeVisible();
    await expect(canvas.queryByText('Load Balancer 11')).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText('Load Balancer 11')).toBeVisible();
    await expect(canvas.queryByText('Load Balancer 1')).toBeNull();

    await userEvent.type(canvas.getByRole('searchbox'), 'Load Balancer 100');
    await expect(body().querySelectorAll('tr')).toHaveLength(1);
    await expect(canvas.getByText('Load Balancer 100')).toBeVisible();
  },
);
