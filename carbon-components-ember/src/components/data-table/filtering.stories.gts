import { expect, fn, waitFor } from 'storybook/test';

import {
  ROWS,
  HEADERS,
  Cells,
  rowsRendered,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTable from '../data-table.gts';

import type { StoryArgs } from '#storybook/fixtures/data-table.gts';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Filtering',
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
  args: { description: 'Filter rows with the toolbar search' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Default.test(
  'filters rows by the search term',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Filter table' }),
      'dns',
    );
    await waitFor(() => expect(canvas.getAllByRole('row')).toHaveLength(3));
    await expect(canvas.getByText('Load Balancer 2')).toBeVisible();
    await expect(canvas.getByText('Load Balancer 5')).toBeVisible();

    await userEvent.clear(
      canvas.getByRole('searchbox', { name: 'Filter table' }),
    );
    await waitFor(() =>
      expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1),
    );
  },
);
