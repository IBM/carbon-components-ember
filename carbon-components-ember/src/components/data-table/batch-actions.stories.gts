import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import {
  ROWS,
  HEADERS,
  Cells,
  rowsRendered,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';

import type {
  LoadBalancer,
  StoryArgs,
} from '#storybook/fixtures/data-table.gts';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Batch Actions',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `Data tables are used to organize and display data efficiently. The data table component allows for customization with additional functionality, as needed by your product’s users.

\`DataTable\` yields its building blocks already wired to the table: \`Toolbar\` (with \`Content\` and the batch-action bar \`Actions\`), \`SearchInput\`, \`Table\`, \`Header\`, \`EachBodyRows\` (yielding a \`Row\` per item), \`Column\`, \`Menu\` and \`Pagination\`. Every \`<td>\` is automatically linked to its column's \`<th>\` via the \`headers\` attribute for screen-reader users.`,
      },
    },
  },
  args: {
    title: 'DataTable',
    description: 'With toolbar',
    size: 'lg',
    useZebraStyles: false,
    onSelectionChange: fn(),
    onBatchAction: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
});

export const Default = meta.story({
  args: { description: 'With batch actions' },
  render: (args: StoryArgs) => {
    const state = trackedObject<{ selected: LoadBalancer[] }>({
      selected: [],
    });
    const select = (items: LoadBalancer[]) => {
      state.selected = items;
      args.onSelectionChange?.(items);
    };
    const batch = (action: string) =>
      args.onBatchAction(action, state.selected);
    const remove = () => batch('Delete');
    const save = () => batch('Save');
    const download = () => batch('Download');

    return <template>
      <DataTable
        @title={{args.title}}
        @description={{args.description}}
        @items={{ROWS}}
        @onSelectionChange={{select}}
        as |table|
      >
        <table.Toolbar as |toolbar|>
          <toolbar.Actions>
            <Button @onClick={{remove}}>Delete</Button>
            <Button @onClick={{save}}>Save</Button>
            <Button @onClick={{download}}>Download</Button>
          </toolbar.Actions>
          <toolbar.Content>
            <table.SearchInput />
            <Button @type="primary">Add new</Button>
          </toolbar.Content>
        </table.Toolbar>
        <table.Table
          @size={{args.size}}
          @useZebraStyles={{args.useZebraStyles}}
        >
          <table.Header @isCheckable={{true}} @headers={{HEADERS}} />
          <table.EachBodyRows as |row|>
            <row.Row @item={{row.item}}>
              <Cells @Column={{table.Column}} @item={{row.item}} />
            </row.Row>
          </table.EachBodyRows>
        </table.Table>
      </DataTable>
    </template>;
  },
});

Default.test(
  'runs a batch action on the selected rows',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await rowsRendered(canvasElement);
    await expect(canvas.queryByText('items selected')).toBeNull();
    const checkboxes = canvasElement.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );
    await userEvent.click(checkboxes[0]!);
    await userEvent.click(checkboxes[1]!);

    const summary = canvasElement.querySelector('[data-items-selected]');
    await expect(summary).toHaveTextContent('2');

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(args.onBatchAction).toHaveBeenCalledWith('Delete', [
      ROWS[0],
      ROWS[1],
    ]);

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(
      canvasElement.querySelector('[data-items-selected]'),
    ).toBeNull();
  },
);
