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

// Carbon React's `DataTable/Sorting` page: `Default`.
//
// Parity gaps: none.

const meta = preview.type<{ args: TableArgs }>().meta({
  title: 'Components/DataTable/Sorting',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`@isSortable\` lets users sort by every header, and a header's own \`isSortable\` overrides it. A click on a \`table.TableHeader @header={{header}}\` sorts the rows ascending, then descending, then back to their order; \`@sortRow\` replaces how two cells compare, and \`@locale\` sets the locale text sorts in. \`table.sortBy\` sorts by a header's key from your own control.

\`\`\`gts
<DataTable @rows={{this.rows}} @headers={{this.headers}} @isSortable={{true}} as |table|>
  <table.Table>
    <TableHead>
      <TableRow>
        {{#each table.headers key="key" as |header|}}
          <table.TableHeader @header={{header}}>{{header.header}}</table.TableHeader>
        {{/each}}
      </TableRow>
    </TableHead>
    {{! the rows }}
  </table.Table>
</DataTable>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    isSortable: true,
    rows: ROWS,
    headers: HEADERS,
  },
  argTypes: DATA_TABLE_ARG_TYPES,
});

export const Default = meta.story({
  render: (args: TableArgs) => <template>
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
        @description="With sorting"
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

Default.test(
  'sorts by a header, then reverses, then clears',
  async ({ canvas, userEvent }) => {
    const names = () =>
      canvas
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.firstElementChild!.textContent.trim());
    const header = canvas.getByRole('columnheader', { name: /Name/ });
    const button = canvas.getByRole('button', { name: /Name/ });
    await userEvent.click(button);
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(names()).toEqual([...names()].sort());
    await userEvent.click(button);
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(names()).toEqual([...names()].sort().reverse());
    await userEvent.click(button);
    await expect(header).toHaveAttribute('aria-sort', 'none');
    await expect(names()[0]).toBe('Load Balancer 3');
  },
);
