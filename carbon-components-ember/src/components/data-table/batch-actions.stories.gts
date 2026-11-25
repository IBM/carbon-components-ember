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
import Download from '../icons/download.ts';
import Save from '../icons/save.ts';
import TrashCan from '../icons/trash-can.ts';
import TableBatchAction from '../table/table-batch-action.gts';
import TableBody from '../table/table-body.gts';
import TableHead from '../table/table-head.gts';
import TableRow from '../table/table-row.gts';

import type { DataTableRow } from '../data-table.gts';
import type { TableArgs } from '#storybook/fixtures/data-table.gts';

// Carbon React's `DataTable/Batch Actions` page: `Default`.
//
// Parity gaps:
// - React filters the rows itself and shows an empty state when none match.
//   This page filters with the table's own `onInputChange`. The empty state
//   is an example in Carbon's repository (`examples/EmptyState`), not part of
//   `@carbon/react`; the addon's IBM Products `EmptyState` is another design.

type StoryArgs = TableArgs & {
  onBatchAction: (action: string, rows: DataTableRow[]) => void;
  onAdd: () => void;
  onSelectRow: (checked: boolean, name: string, event: Event) => void;
  onToolbarAction: (action: string) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Batch Actions',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`table.TableBatchActions\` is the batch bar for the table's selected rows, shown once a row is selected and wired to the table's \`Cancel\`. Give it \`TableBatchAction\`s, and read the rows to act on from the yielded \`table.selectedRows\`. It goes in \`table.TableToolbar\`, next to its \`Content\`.

\`\`\`gts
<table.TableToolbar as |Content|>
  <table.TableBatchActions>
    <TableBatchAction @renderIcon={{TrashCan}} {{on "click" (fn this.remove table.selectedRows)}}>Delete</TableBatchAction>
  </table.TableBatchActions>
  <Content as |Search|>
    <Search @onChange={{table.onInputChange}} />
  </Content>
</table.TableToolbar>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    rows: ROWS,
    headers: HEADERS,
    overflowMenuOnHover: true,
    onBatchAction: spy(),
    onAdd: spy(),
    onSelectRow: spy(),
    onToolbarAction: spy(),
  },
  argTypes: {
    ...DATA_TABLE_ARG_TYPES,
    overflowMenuOnHover: { control: 'boolean' },
  },
});

export const Default = meta.story({
  render: (args: StoryArgs) => <template>
    <DataTable
      @rows={{args.rows}}
      @headers={{args.headers}}
      @isSortable={{args.isSortable}}
      @locale={{args.locale}}
      @overflowMenuOnHover={{args.overflowMenuOnHover}}
      @size={{args.size}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      @useZebraStyles={{args.useZebraStyles}}
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With batch actions"
        as |Table|
      >
        <table.TableToolbar as |Content|>
          <table.TableBatchActions>
            <TableBatchAction
              tabindex={{if table.batchActionProps.shouldShowBatchActions 0 -1}}
              @renderIcon={{TrashCan}}
              {{on "click" (fn args.onBatchAction "Delete" table.selectedRows)}}
            >Delete</TableBatchAction>
            <TableBatchAction
              tabindex={{if table.batchActionProps.shouldShowBatchActions 0 -1}}
              @renderIcon={{Save}}
              {{on "click" (fn args.onBatchAction "Save" table.selectedRows)}}
            >Save</TableBatchAction>
            <TableBatchAction
              tabindex={{if table.batchActionProps.shouldShowBatchActions 0 -1}}
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
              tabindex={{if table.batchActionProps.shouldShowBatchActions -1 0}}
              @onChange={{table.onInputChange}}
            />
            <Menu
              tabindex={{if table.batchActionProps.shouldShowBatchActions -1 0}}
              as |Action|
            >
              <Action {{on "click" (fn args.onToolbarAction "Action 1")}}>Action
                1</Action>
              <Action {{on "click" (fn args.onToolbarAction "Action 2")}}>Action
                2</Action>
              <Action {{on "click" (fn args.onToolbarAction "Action 3")}}>Action
                3</Action>
            </Menu>
            <Button
              tabindex={{if table.batchActionProps.shouldShowBatchActions -1 0}}
              @kind="primary"
              {{on "click" args.onAdd}}
            >Add new</Button>
          </Content>
        </table.TableToolbar>
        <Table>
          <TableHead>
            <TableRow>
              <table.TableSelectAll />
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

Default.test(
  'runs a batch action on the selected rows',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(
      canvasElement.querySelector('.cds--batch-actions'),
    ).toHaveAttribute('aria-hidden', 'true');
    const checkboxes = canvasElement.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );
    await userEvent.click(checkboxes[0]!);
    await userEvent.click(checkboxes[1]!);
    await expect(canvas.getByText('2 items selected')).toBeInTheDocument();
    await expect(
      canvasElement.querySelector('.cds--batch-actions'),
    ).toHaveAttribute('aria-hidden', 'false');

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(args.onBatchAction).toHaveBeenCalledOnce();
    const [action, rows] = (args.onBatchAction as ReturnType<typeof spy>).mock
      .calls[0] as [string, DataTableRow[]];
    await expect(action).toBe('Delete');
    await expect(rows.map((row) => row.id)).toEqual(['a', 'b']);

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(checkboxes[0]).not.toBeChecked();
    await expect(checkboxes[1]).not.toBeChecked();
  },
);
