import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, userEvent } from 'storybook/test';

import { LoadBalancerRows } from '#storybook/fixtures/table.gts';
import preview from '#storybook/preview.ts';
import TableBatchAction from './table-batch-action.gts';
import TableBatchActions from './table-batch-actions.gts';
import TableContainer from './table-container.gts';
import TableToolbar from './table-toolbar.gts';
import Delete from '../icons/delete.ts';
import Download from '../icons/download.ts';
import Save from '../icons/save.ts';

import type { TableBatchActionsSignature } from './table-batch-actions.gts';

// Carbon React's `DataTable/Batch Actions` page renders these parts through
// DataTable's render prop, with row selection from its state. `Default` is
// ported here with the parts on their own, with a count in place of rows to
// select. `OneSelected` is Ember-only. There is no story for the hidden bar: its
// buttons stay focusable under `aria-hidden`, as in Carbon React's, which axe
// rejects.
//
// Parity gaps: none.

type StoryArgs = {
  totalSelected: number;
  totalCount: number;
  shouldShowBatchActions: boolean;
  onCancel: () => void;
  onSelectAll: () => void;
  onAction: (action: string) => void;
  translateWithId?: TableBatchActionsSignature['Args']['translateWithId'];
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Table/TableBatchActions',
  component: TableBatchActions,
  parameters: {
    docs: {
      description: {
        component: `\`TableBatchActions\` replaces a table's toolbar while rows are selected, as Carbon React's. Show it with \`@shouldShowBatchActions\` and give it the selection's size in \`@totalSelected\`; \`@onCancel\` is called by Cancel, and \`@onSelectAll\` adds a "Select all" button with \`@totalCount\`. Its actions are \`TableBatchAction\`s (a button with an add icon unless you give another \`@renderIcon\`), and \`@translateWithId\` translates its messages. The table keeps the selection.

\`\`\`gts
<TableBatchActions
  @shouldShowBatchActions={{this.selected.length}}
  @totalSelected={{this.selected.length}}
  @onCancel={{this.clearSelection}}
>
  <TableBatchAction @renderIcon={{Delete}} {{on "click" this.remove}}>Delete</TableBatchAction>
</TableBatchActions>
\`\`\``,
      },
    },
  },
  args: {
    totalSelected: 2,
    totalCount: 8,
    shouldShowBatchActions: true,
    onCancel: fn(),
    onSelectAll: fn(),
    onAction: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ selected: args.totalSelected });
    const cancel = () => {
      state.selected = 0;
      args.onCancel();
    };
    const selectAll = () => {
      state.selected = args.totalCount;
      args.onSelectAll();
    };
    const remove = () => args.onAction('Delete');
    const save = () => args.onAction('Save');
    const download = () => args.onAction('Download');
    return <template>
      <TableContainer
        @title="Load balancers"
        @description="With batch actions"
        as |Table|
      >
        <TableToolbar>
          <TableBatchActions
            @shouldShowBatchActions={{args.shouldShowBatchActions}}
            @totalSelected={{state.selected}}
            @totalCount={{args.totalCount}}
            @onCancel={{cancel}}
            @onSelectAll={{selectAll}}
            @translateWithId={{args.translateWithId}}
          >
            <TableBatchAction @renderIcon={{Delete}} {{on "click" remove}}>
              Delete
            </TableBatchAction>
            <TableBatchAction @renderIcon={{Save}} {{on "click" save}}>
              Save
            </TableBatchAction>
            <TableBatchAction @renderIcon={{Download}} {{on "click" download}}>
              Download
            </TableBatchAction>
          </TableBatchActions>
        </TableToolbar>
        <Table><LoadBalancerRows /></Table>
      </TableContainer>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'counts the selection, selects all and cancels',
  async ({ canvas, args }) => {
    await expect(canvas.getByText('2 items selected')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Select all (8)' }),
    );
    await expect(args.onSelectAll).toHaveBeenCalledOnce();
    await expect(canvas.getByText('8 items selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(args.onAction).toHaveBeenCalledWith('Delete');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(canvas.getByText('0 items selected')).toBeInTheDocument();
  },
);

export const OneSelected = meta.story({ args: { totalSelected: 1 } });
