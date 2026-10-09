import { expect, fn, waitFor, within } from 'storybook/test';

import {
  MANY_ROWS,
  HEADERS,
  Cells,
  rowsRendered,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';

import type { StoryArgs } from '#storybook/fixtures/data-table.gts';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Pagination',
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
  args: {
    title: 'Load Balancers',
    description: 'Paginated data table with persistent toolbar',
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{MANY_ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput />
          <Button @type="primary">Primary Button</Button>
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
      <table.Pagination />
    </DataTable>
  </template>,
});

Default.test(
  'pages through the rows',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    const body = () => within(canvas.getAllByRole('rowgroup')[1]!);
    await waitFor(() => expect(body().getAllByRole('row')).toHaveLength(10));
    await expect(body().getByText('Load Balancer 1')).toBeVisible();
    await expect(body().queryByText('Load Balancer 11')).toBeNull();
    await expect(
      canvasElement.querySelector('[data-total-items]'),
    ).toHaveTextContent('100');

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await waitFor(() =>
      expect(body().getByText('Load Balancer 11')).toBeVisible(),
    );
    await expect(body().queryByText('Load Balancer 1')).toBeNull();
  },
);
