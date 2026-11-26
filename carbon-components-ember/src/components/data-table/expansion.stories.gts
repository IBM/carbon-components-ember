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

// Carbon React's `DataTable/Expansion` page: `Default`, `StickyHeader`,
// `BatchExpansion` and `BatchExpansionMultipleTables`.
//
// Parity gaps:
// - React's `TableExpandRow` `onClick` spy: `table.TableExpandRow` takes
//   `@onExpand`, called after the row toggles.

type StoryArgs = TableArgs & { onExpand: (event: MouseEvent) => void };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Expansion',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `A \`table.TableExpandRow @row={{row}}\` toggles its row, and the table keeps which rows are expanded. Follow it with a \`table.TableExpandedRow @row={{row}} @colSpan={{n}}\` for the details, where \`n\` is the columns plus one. \`table.TableExpandHeader\` heads the expand column, and expands every row at once with \`@enableToggle\`.

\`\`\`gts
<table.TableExpandHeader @enableToggle={{true}} />
{{#each table.rows key="id" as |row|}}
  <table.TableExpandRow @row={{row}}>
    {{! the row's cells }}
  </table.TableExpandRow>
  <table.TableExpandedRow @row={{row}} @colSpan={{7}}>Details</table.TableExpandedRow>
{{/each}}
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    rows: ROWS,
    headers: HEADERS,
    onExpand: spy(),
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
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With expansion"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              <table.TableExpandHeader><span class="cds--visually-hidden">Expand
                  row</span></table.TableExpandHeader>
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableExpandRow @row={{row}} @onExpand={{args.onExpand}}>
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
              </table.TableExpandRow>
              <table.TableExpandedRow @row={{row}} @colSpan={{7}}>
                {{! React uses an h6; h3 keeps the heading order valid below the table title's h2. }}
                <h3>Expandable row content</h3>
                <div>Description here</div>
              </table.TableExpandedRow>
            {{/each}}
          </TableBody>
        </Table>
      </table.TableContainer>
    </DataTable>
  </template>,
});

export const Default = meta.story();

Default.test(
  'expands and collapses a row',
  async ({ canvas, userEvent, args }) => {
    const [first] = canvas.getAllByRole('button', {
      name: 'Expand current row',
    });
    const parentRow = first!.closest('tr')!;
    await userEvent.click(first!);
    await expect(args.onExpand).toHaveBeenCalledOnce();
    await expect(parentRow).toHaveClass('cds--expandable-row');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAccessibleName('Collapse current row');

    await userEvent.click(first!);
    await expect(parentRow).not.toHaveClass('cds--expandable-row');
  },
);

export const StickyHeader = meta.story({
  args: { stickyHeader: true },
});

StickyHeader.test('expands a row', async ({ canvas, userEvent }) => {
  const [first] = canvas.getAllByRole('button', {
    name: 'Expand current row',
  });
  await userEvent.click(first!);
  await expect(first).toHaveAttribute('aria-expanded', 'true');
});

const batch = {
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
        @description="With batch expansion"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              <table.TableExpandHeader @enableToggle={{true}} />
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableExpandRow @row={{row}}>
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
              </table.TableExpandRow>
              <table.TableExpandedRow @row={{row}} @colSpan={{7}}>
                <h3>Expandable row content</h3>
                <div>Description here</div>
              </table.TableExpandedRow>
            {{/each}}
          </TableBody>
        </Table>
      </table.TableContainer>
    </DataTable>
  </template>,
};

export const BatchExpansion = meta.story(batch);

BatchExpansion.test(
  'expands every row, then collapses them',
  async ({ canvas, userEvent }) => {
    const all = canvas.getByRole('button', { name: 'Expand all rows' });
    await userEvent.click(all);
    for (const button of canvas.getAllByRole('button', {
      name: 'Collapse current row',
    })) {
      await expect(button).toHaveAttribute('aria-expanded', 'true');
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse all rows' }),
    );
    await expect(
      canvas.getAllByRole('button', { name: 'Expand current row' }),
    ).toHaveLength(ROWS.length);
  },
);

export const BatchExpansionMultipleTables = meta.story({
  render: (args: StoryArgs) => <template>
    {{#each (array 1 2)}}
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
          @description="With batch expansion"
          as |Table|
        >
          <Table>
            <TableHead>
              <TableRow>
                <table.TableExpandHeader @enableToggle={{true}} />
                {{#each table.headers key="key" as |header|}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows key="id" as |row|}}
                <table.TableExpandRow @row={{row}}>
                  {{#each row.cells key="id" as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableExpandRow>
                <table.TableExpandedRow @row={{row}} @colSpan={{7}}>
                  <h3>Expandable row content</h3>
                  <div>Description here</div>
                </table.TableExpandedRow>
              {{/each}}
            </TableBody>
          </Table>
        </table.TableContainer>
      </DataTable>
    {{/each}}
  </template>,
});
