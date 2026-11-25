import { expect, fn as spy } from 'storybook/test';

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

// Carbon React's `DataTable/Selection` page: `Default`, `WithRadioSelection`
// and `WithSelectionAndSorting`.
//
// Parity gaps:
// - React's `TableRow` `onClick` story arg: a row takes `{{on "click"}}`
//   like any element, so the page has no separate spy for it.
// - A radio button reports `true` to `@onChange`, where React's reports its
//   empty value's `false`.

type StoryArgs = TableArgs & {
  onSelectRow: (checked: boolean, name: string, event: Event) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Selection',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`table.TableSelectAll\` and \`table.TableSelectRow @row={{row}}\` select rows, and the table keeps the selection: read it from the yielded \`table.selectedRows\`. With \`@radio={{true}}\` a row is a radio button and only one is selected; leave out \`TableSelectAll\` then. A \`TableRow\` of a selected row is marked selected. \`@onChange\` of \`TableSelectRow\` is called with whether the control is checked, its id and the \`change\` event.

\`\`\`gts
<DataTable @rows={{this.rows}} @headers={{this.headers}} @radio={{false}} as |table|>
  <table.Table>
    <TableHead>
      <TableRow>
        <table.TableSelectAll />
        {{#each table.headers key="key" as |header|}}
          <table.TableHeader @header={{header}}>{{header.header}}</table.TableHeader>
        {{/each}}
      </TableRow>
    </TableHead>
    <TableBody>
      {{#each table.rows key="id" as |row|}}
        <table.TableRow @row={{row}}>
          <table.TableSelectRow @row={{row}} />
          {{! the row's cells }}
        </table.TableRow>
      {{/each}}
    </TableBody>
  </table.Table>
</DataTable>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    radio: false,
    rows: ROWS,
    headers: HEADERS,
    onSelectRow: spy(),
  },
  argTypes: {
    ...DATA_TABLE_ARG_TYPES,
    radio: { control: 'boolean' },
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @rows={{args.rows}}
      @headers={{args.headers}}
      @isSortable={{args.isSortable}}
      @locale={{args.locale}}
      @radio={{args.radio}}
      @size={{args.size}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      @useZebraStyles={{args.useZebraStyles}}
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With selection"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              {{#if table.radio}}
                <th scope="col"><span class="cds--visually-hidden">Select a row</span></th>
              {{else}}
                <table.TableSelectAll />
              {{/if}}
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
                <table.TableSelectRow
                  @row={{row}}
                  @onChange={{args.onSelectRow}}
                />
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
  'selects single rows and all rows',
  async ({ canvasElement, userEvent, args }) => {
    const [selectAll, first] = canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    await userEvent.click(first!);
    await expect(args.onSelectRow).toHaveBeenCalledOnce();
    await expect(first!.closest('tr')).toHaveClass('cds--data-table--selected');

    // With a row selected, select all unselects, as in React.
    await userEvent.click(selectAll!);
    await expect(first!.closest('tr')).not.toHaveClass(
      'cds--data-table--selected',
    );

    await userEvent.click(selectAll!);
    for (const row of canvasElement.querySelectorAll('tbody tr')) {
      await expect(row).toHaveClass('cds--data-table--selected');
    }
  },
);

export const WithRadioSelection = meta.story({
  args: { radio: true },
  argTypes: { radio: { control: false } },
});

WithRadioSelection.test(
  'selects one row at a time',
  async ({ canvas, userEvent }) => {
    const [first, second] = canvas.getAllByRole('radio');
    await userEvent.click(first!);
    await expect(first).toBeChecked();
    await userEvent.click(second!);
    await expect(second).toBeChecked();
    await expect(first).not.toBeChecked();
  },
);

export const WithSelectionAndSorting = meta.story({
  args: { isSortable: true },
  argTypes: { isSortable: { control: false } },
});

WithSelectionAndSorting.test(
  'sorts the rows by a header',
  async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(
      canvas.getByRole('columnheader', { name: /Name/ }),
    ).toHaveAttribute('aria-sort', 'ascending');
    await expect(
      canvas.getAllByRole('row')[1]!.querySelectorAll('td')[1],
    ).toHaveTextContent('Load Balancer 1');
  },
);
