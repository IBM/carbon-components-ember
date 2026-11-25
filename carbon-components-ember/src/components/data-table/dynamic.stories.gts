import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';

import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTable from '../data-table.gts';
import IconIndicator from '../icon-indicator.gts';
import Download from '../icons/download.ts';
import Save from '../icons/save.ts';
import TrashCan from '../icons/trash-can.ts';
import TableBatchAction from '../table/table-batch-action.gts';
import TableBody from '../table/table-body.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { IconIndicatorKind } from '../icon-indicator.gts';
import type { DataTableHeader, DataTableInputRow } from '../data-table.gts';
import type { TableArgs } from '#storybook/fixtures/data-table.gts';

// Carbon React's `DataTable/Dynamic` page: `Default`.
//
// Parity gaps:
// - React shows an empty state when no row matches the search: its
//   `EmptyState` is an example in Carbon's repository
//   (`examples/EmptyState`), not part of `@carbon/react`. The addon's IBM
//   Products `EmptyState` is another design.
// - React inserts new rows at a random position; here they go at the
//   position `index` says, so the page renders the same every time.

interface Status {
  kind: IconIndicatorKind;
  label: string;
}

const STATUSES: Record<string, Status> = {
  Disabled: { kind: 'failed', label: 'Failed' },
  Starting: { kind: 'in-progress', label: 'In progress' },
  Active: { kind: 'succeeded', label: 'Succeeded' },
};

// A row's status as an indicator, as React's `IconIndicator` in its cell.
const INITIAL_ROWS: DataTableInputRow[] = ROWS.map((row) => ({
  ...row,
  status: STATUSES[row.status],
}));

const status = (value: unknown) =>
  typeof value === 'object' && value !== null && 'kind' in value
    ? (value as Status)
    : undefined;

const text = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? value : '';

const matches = (row: DataTableInputRow, search: string) =>
  search === '' ||
  Object.values(row).some(
    (value) =>
      typeof value === 'string' && value.toLowerCase().includes(search),
  );

type StoryArgs = Omit<TableArgs, 'rows'> & {
  rows: DataTableInputRow[];
  radio: boolean;
  onBatchAction: (action: string, rows: unknown[]) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Dynamic',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`DataTable\` follows the \`@rows\` and \`@headers\` it is given: rows and headers can be added at any time, and the sort, the filter, and the selection and expansion of the rows that stay carry over. A row that leaves \`@rows\` loses its selection and expansion. Replace the arrays, as here, rather than changing them in place.

\`\`\`gts
<DataTable @rows={{this.rows}} @headers={{this.headers}} as |table|>
  {{! the table }}
</DataTable>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    radio: false,
    rows: INITIAL_ROWS,
    headers: HEADERS,
    onBatchAction: spy(),
  },
  argTypes: {
    ...DATA_TABLE_ARG_TYPES,
    radio: { control: 'boolean' },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject<{
      rows: DataTableInputRow[];
      headers: DataTableHeader[];
      id: number;
      search: string;
    }>({ rows: args.rows, headers: args.headers, id: 0, search: '' });

    const shown = () =>
      state.rows.filter((row) =>
        matches(row, state.search.trim().toLowerCase()),
      );
    const search = (_event: unknown, value?: string) => {
      state.search = value ?? '';
    };
    // Every column: the expand and select cells, and the headers.
    const colSpan = () => state.headers.length + 2;
    const addHeader = () => {
      const length = state.headers.length;
      const header = { key: `header_${length}`, header: `Header ${length}` };
      state.rows = state.rows.map((row) => ({
        ...row,
        [header.key]: header.header,
      }));
      state.headers = [...state.headers, header];
    };
    const addRow = () => {
      const id = state.id + 1;
      const row: DataTableInputRow = {
        id: `${id}`,
        name: `New Row ${id}`,
        protocol: 'HTTP',
        port: id * 100,
        rule: id % 2 === 0 ? 'Round robin' : 'DNS delegation',
        attached_groups: `Row ${id}'s VM Groups`,
        status: 'Starting',
      };
      for (const { key, header } of state.headers) {
        if (row[key] === undefined) row[key] = header;
      }
      const index = (id * 2) % (state.rows.length + 1);
      state.id = id;
      state.rows = [
        ...state.rows.slice(0, index),
        row,
        ...state.rows.slice(index),
      ];
    };

    return <template>
      <DataTable
        @rows={{(shown)}}
        @headers={{state.headers}}
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
          @description="Use the toolbar menu to add rows and headers"
          as |Table|
        >
          <table.TableToolbar as |Content|>
            <table.TableBatchActions>
              <TableBatchAction
                tabindex={{if
                  table.batchActionProps.shouldShowBatchActions
                  0
                  -1
                }}
                @iconDescription="Delete the selected rows"
                @renderIcon={{TrashCan}}
                {{on
                  "click"
                  (fn args.onBatchAction "Delete" table.selectedRows)
                }}
              >Delete</TableBatchAction>
              <TableBatchAction
                tabindex={{if
                  table.batchActionProps.shouldShowBatchActions
                  0
                  -1
                }}
                @iconDescription="Save the selected rows"
                @renderIcon={{Save}}
                {{on "click" (fn args.onBatchAction "Save" table.selectedRows)}}
              >Save</TableBatchAction>
              <TableBatchAction
                tabindex={{if
                  table.batchActionProps.shouldShowBatchActions
                  0
                  -1
                }}
                @iconDescription="Download the selected rows"
                @renderIcon={{Download}}
                {{on
                  "click"
                  (fn args.onBatchAction "Download" table.selectedRows)
                }}
              >Download</TableBatchAction>
            </table.TableBatchActions>
            <Content
              aria-hidden={{if
                table.batchActionProps.shouldShowBatchActions
                "true"
                "false"
              }}
              as |Search Menu|
            >
              <Search
                tabindex={{if
                  table.batchActionProps.shouldShowBatchActions
                  -1
                  0
                }}
                @onChange={{search}}
              />
              <Menu
                tabindex={{if
                  table.batchActionProps.shouldShowBatchActions
                  -1
                  0
                }}
                as |Action|
              >
                <Action {{on "click" addRow}}>Add row</Action>
                <Action {{on "click" addHeader}}>Add header</Action>
              </Menu>
            </Content>
          </table.TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <table.TableExpandHeader><span
                    class="cds--visually-hidden"
                  >Expand row</span></table.TableExpandHeader>
                {{#if args.radio}}
                  <th scope="col"><span class="cds--visually-hidden">Select row</span></th>
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
                <table.TableExpandRow @row={{row}}>
                  <table.TableSelectRow @row={{row}} />
                  {{#each row.cells key="id" as |cell|}}
                    <table.TableCell @cell={{cell}}>
                      {{#let (status cell.value) as |indicator|~}}
                        {{~#if indicator~}}
                          <IconIndicator
                            @kind={{indicator.kind}}
                            @label={{indicator.label}}
                          />
                        {{~else~}}
                          {{text cell.value}}
                        {{~/if~}}
                      {{~/let}}
                    </table.TableCell>
                  {{/each}}
                </table.TableExpandRow>
                <table.TableExpandedRow @row={{row}} @colSpan={{(colSpan)}}>
                  <h3>Expandable row content</h3>
                  <div>Description here</div>
                </table.TableExpandedRow>
              {{/each}}
            </TableBody>
          </Table>
        </table.TableContainer>
      </DataTable>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'keeps the selection of the rows that stay when rows and headers are added',
  async ({ canvas, canvasElement, userEvent }) => {
    const checkboxes = () =>
      canvasElement.querySelectorAll<HTMLInputElement>(
        'tbody input[type="checkbox"]',
      );
    await userEvent.click(checkboxes()[1]!);
    await expect(checkboxes()[1]).toBeChecked();
    await expect(
      canvasElement.querySelector('.cds--toolbar-content'),
    ).toHaveAttribute('aria-hidden', 'true');

    await userEvent.click(
      canvas.getAllByRole('button', { name: /Settings/, hidden: true })[0]!,
    );
    await userEvent.click(
      canvas.getByRole('menuitem', { name: 'Add row', hidden: true }),
    );
    await expect(checkboxes()).toHaveLength(ROWS.length + 1);
    await expect(
      Array.from(checkboxes()).filter((checkbox) => checkbox.checked),
    ).toHaveLength(1);

    await userEvent.click(
      canvas.getAllByRole('button', { name: /Settings/, hidden: true })[0]!,
    );
    await userEvent.click(
      canvas.getByRole('menuitem', { name: 'Add header', hidden: true }),
    );
    await expect(
      canvas.getByRole('columnheader', { name: 'Header 6' }),
    ).toBeVisible();
    await expect(
      Array.from(checkboxes()).filter((checkbox) => checkbox.checked),
    ).toHaveLength(1);
  },
);
