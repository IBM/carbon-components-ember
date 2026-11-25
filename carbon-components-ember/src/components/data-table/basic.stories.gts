import { expect } from 'storybook/test';

import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTable from '../data-table.gts';
import TableBody from '../table/table-body.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { TableArgs } from '#storybook/fixtures/data-table.gts';

// Carbon React's `DataTable/Basic` page: `Default` and `XLWithTwoLines`.
// `ExtraSmall` and `WithoutBlock` are Ember-only.
//
// Parity gaps:
// - React's rows hold a `Link` in the status cell, and so show a disabled
//   one. A row's value here is plain text.

type StoryArgs = TableArgs;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Basic',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `Data tables organize and display data efficiently. \`DataTable\` takes \`@rows\` (each an \`id\` and a value for each header's \`key\`) and \`@headers\` (each a \`key\` and the \`header\` to show), keeps their sorting, filtering, selection and expansion, and yields them as Carbon React's render props: \`rows\`, \`headers\`, \`sortBy\`, \`selectRow\` and the rest. It also yields the table parts already bound to that state, in place of React's \`getHeaderProps\`, \`getRowProps\` and \`getCellProps\`: \`TableContainer\`, \`Table\`, \`TableHeader\`, \`TableRow\`, \`TableExpandRow\`, \`TableExpandedRow\`, \`TableExpandHeader\`, \`TableSelectAll\`, \`TableSelectRow\`, \`TableCell\`, \`TableToolbar\` and \`TableBatchActions\`. The parts that need no state (\`TableHead\`, \`TableBody\`, \`TableToolbarSearch\`, ...) are imported from \`table/\`. Every \`<td>\` is linked to its column's \`<th>\` through \`headers\`.

\`\`\`gts
<DataTable @rows={{this.rows}} @headers={{this.headers}} as |table|>
  <table.Table aria-label="sample table">
    <TableHead>
      <TableRow>
        {{#each table.headers key="key" as |header|}}
          <table.TableHeader @header={{header}}>{{header.header}}</table.TableHeader>
        {{/each}}
      </TableRow>
    </TableHead>
    <TableBody>
      {{#each table.rows key="id" as |row|}}
        <table.TableRow @row={{row}}>
          {{#each row.cells key="id" as |cell|}}
            <table.TableCell @cell={{cell}}>{{cell.value}}</table.TableCell>
          {{/each}}
        </table.TableRow>
      {{/each}}
    </TableBody>
  </table.Table>
</DataTable>
\`\`\`

Without a block, \`<DataTable @rows={{this.rows}} @headers={{this.headers}} />\` renders that table.`,
      },
    },
  },
  args: { ...DATA_TABLE_ARGS, rows: ROWS, headers: HEADERS },
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
      as |table|
    >
      <table.Table aria-label="sample table">
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
                <table.TableCell @cell={{cell}}>{{cell.value}}</table.TableCell>
              {{/each}}
            </table.TableRow>
          {{/each}}
        </TableBody>
      </table.Table>
    </DataTable>
  </template>,
});

export const Default = meta.story();

Default.test('links each cell to its column header', async ({ canvas }) => {
  const cell = canvas.getByRole('cell', { name: 'Load Balancer 3' });
  const header = canvas.getByRole('columnheader', { name: 'Name' });
  await expect(cell).toHaveAttribute('headers', header.id);
});

export const XLWithTwoLines = meta.story({
  args: { size: 'xl' },
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
      as |table|
    >
      <table.Table aria-label="sample table">
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
                <table.TableCell @cell={{cell}}>
                  {{#if (eq cell.info.header "name")}}
                    <div>{{cell.value}}</div>
                    <div class="cds--label">Austin, Tx</div>
                  {{else}}
                    {{cell.value}}
                  {{/if}}
                </table.TableCell>
              {{/each}}
            </table.TableRow>
          {{/each}}
        </TableBody>
      </table.Table>
    </DataTable>
  </template>,
});

export const ExtraSmall = meta.story({
  args: { size: 'xs' },
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
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="Extra-small rows"
        as |Table|
      >
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

export const WithoutBlock = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Without a block, `DataTable` renders a table of its rows: a header and a row per `@rows`, sorted when `@isSortable` is set.',
      },
    },
  },
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
    />
  </template>,
});

WithoutBlock.test('renders a row for each row', async ({ canvas }) => {
  await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
  await expect(
    canvas.getByRole('columnheader', { name: 'Attached groups' }),
  ).toBeVisible();
});
