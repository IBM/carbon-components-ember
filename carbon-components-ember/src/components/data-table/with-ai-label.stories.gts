import { expect } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import '#storybook/styles/data-table/with-ai-label.css';
import AILabel from '../ai-label.gts';
import DataTable from '../data-table.gts';
import TableBody from '../table/table-body.gts';
import TableCell from '../table/table-cell.gts';
import TableDecoratorRow from '../table/table-decorator-row.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { DataTableHeader } from '../data-table.gts';
import type { TableArgs } from '#storybook/fixtures/data-table.gts';

// Carbon React's `DataTable/WithAILabel` page: `AILabelWithSelection`,
// `AILabelWithRadioSelection`, `ColumnAILabelWithSelectionAndExpansion`,
// `ColumnAILabelSort` and `FullTableAI`.
//
// Parity gaps:
// - `AILabelWithSelectionAndExpansion` and `AILabelWithExpansion` are not
//   ported. React gives the rows without an AI label an empty decorator
//   cell (`<TableDecoratorRow decorator={null}>`) so the columns line up;
//   `table.TableExpandRow` renders that cell only with a `<:decorator>`
//   block, which also marks the row as an AI row. The AI label on every
//   expandable row is `TableExpandRow`'s `AILabelWithExpansion` story.
// - React's empty header cells over the AI label and radio columns hold
//   visually hidden text here, which axe requires.
// - The AI label's content leaves out React's `AILabelActions` (icon buttons
//   and a button), which these tables don't need.
// - A header's AI label is a `<:decorator>` block of `table.TableHeader`
//   in the story's template; the header data's `decorator` only marks the
//   column, as it does in React.

type StoryArgs = TableArgs & { radio: boolean };

const COLUMN_HEADERS: DataTableHeader[] = HEADERS.map((header) =>
  header.key === 'attached_groups' ? { ...header, decorator: true } : header,
);

// React's rows with an AI label: the second, fourth and fifth.
const hasLabel = (index: number) => index === 1 || index === 3 || index === 4;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/WithAILabel',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `A row's AI label goes in a \`TableDecoratorRow\`'s \`<:decorator>\` block, in the row's first cell. A column's goes in the \`<:decorator>\` block of its \`table.TableHeader\`; set \`decorator: true\` on that header's data so its cells take the AI column styles (\`hasAILabelHeader\`), as Carbon React's \`decorator\` and \`slug\` do. A table's goes in \`table.TableContainer\`'s \`<:decorator>\` block, with \`@aiEnabled\`.

\`\`\`gts
<table.TableHeader @header={{header}}>
  <:default>{{header.header}}</:default>
  <:decorator as |AILabel|>
    <AILabel as |label|><label.Content>Explanation</label.Content></AILabel>
  </:decorator>
</table.TableHeader>
\`\`\``,
      },
    },
  },
  args: { ...DATA_TABLE_ARGS, radio: false, rows: ROWS, headers: HEADERS },
  argTypes: {
    ...DATA_TABLE_ARG_TYPES,
    radio: {
      control: 'boolean',
      description: 'Use radio selection instead of multi-selection.',
    },
  },
});

export const AILabelWithSelection = meta.story({
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
              <th scope="col"><span class="cds--visually-hidden">AI label</span></th>
              <table.TableSelectAll />
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row index|}}
              <table.TableRow @row={{row}}>
                {{#if (hasLabel index)}}
                  <TableDecoratorRow>
                    <:decorator as |AILabel|>
                      <AILabel as |label|>
                        <label.Content><AIExplanation /></label.Content>
                      </AILabel>
                    </:decorator>
                  </TableDecoratorRow>
                {{else}}
                  <TableCell />
                {{/if}}
                <table.TableSelectRow @row={{row}} />
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

export const AILabelWithRadioSelection = meta.story({
  args: { radio: true },
  argTypes: { radio: { table: { readonly: true } } },
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
        @description="With radio selection"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              <th scope="col"><span class="cds--visually-hidden">AI label</span></th>
              <th scope="col"><span class="cds--visually-hidden">Select row</span></th>
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row index|}}
              <table.TableRow @row={{row}}>
                {{#if (hasLabel index)}}
                  <TableDecoratorRow>
                    <:decorator as |AILabel|>
                      <AILabel as |label|>
                        <label.Content><AIExplanation /></label.Content>
                      </AILabel>
                    </:decorator>
                  </TableDecoratorRow>
                {{else}}
                  <TableCell />
                {{/if}}
                <table.TableSelectRow @row={{row}} />
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

export const ColumnAILabelWithSelectionAndExpansion = meta.story({
  args: { headers: COLUMN_HEADERS },
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
        class="data-table-with-ai-label-story__table"
        @title="DataTable"
        @description="With expansion"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              <table.TableExpandHeader @enableToggle={{true}}><span
                  class="cds--visually-hidden"
                >Expand row</span></table.TableExpandHeader>
              <table.TableSelectAll />
              {{#each table.headers key="key" as |header|}}
                {{#if header.decorator}}
                  <table.TableHeader @header={{header}}>
                    <:default>{{header.header}}</:default>
                    <:decorator as |AILabel|>
                      <AILabel as |label|>
                        <label.Content><AIExplanation /></label.Content>
                      </AILabel>
                    </:decorator>
                  </table.TableHeader>
                {{else}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/if}}
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableExpandRow @row={{row}}>
                <table.TableSelectRow @row={{row}} />
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
              </table.TableExpandRow>
              <table.TableExpandedRow @row={{row}} @colSpan={{8}}>
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

ColumnAILabelWithSelectionAndExpansion.test(
  'marks the labelled column',
  async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('button', { name: /Show information/ }),
    ).toBeVisible();
    await expect(
      canvasElement.querySelectorAll('td.cds--table-cell--column-slug'),
    ).toHaveLength(ROWS.length);
  },
);

export const ColumnAILabelSort = meta.story({
  args: { headers: COLUMN_HEADERS, isSortable: true },
  argTypes: {
    isSortable: { table: { readonly: true } },
    radio: { control: false },
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
      as |table|
    >
      <table.TableContainer
        class="data-table-with-ai-label-story__table"
        @title="DataTable"
        @description="With sorting"
        as |Table|
      >
        <Table>
          <TableHead>
            <TableRow>
              {{#each table.headers key="key" as |header|}}
                {{#if header.decorator}}
                  <table.TableHeader @header={{header}}>
                    <:default>{{header.header}}</:default>
                    <:decorator as |AILabel|>
                      <AILabel as |label|>
                        <label.Content><AIExplanation /></label.Content>
                      </AILabel>
                    </:decorator>
                  </table.TableHeader>
                {{else}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/if}}
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

ColumnAILabelSort.test(
  'sorts by the labelled column',
  async ({ canvas, userEvent }) => {
    const header = canvas.getByRole('columnheader', {
      name: /Attached groups/,
    });
    await userEvent.click(
      canvas.getByRole('button', { name: /Attached groups/ }),
    );
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
  },
);

export const FullTableAI = meta.story({
  args: { isSortable: true },
  argTypes: {
    isSortable: { table: { readonly: true } },
    radio: { control: false },
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
      as |table|
    >
      <table.TableContainer
        class="data-table-with-ai-label-story__table"
        @aiEnabled={{true}}
        @title="DataTable"
        @description="AI, full table"
      >
        <:default as |Table|>
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
        </:default>
        <:decorator>
          <AILabel as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </table.TableContainer>
    </DataTable>
  </template>,
});

FullTableAI.test('shows the table AI label', async ({ canvas }) => {
  await expect(
    canvas.getByRole('button', { name: /Show information/ }),
  ).toBeVisible();
});
