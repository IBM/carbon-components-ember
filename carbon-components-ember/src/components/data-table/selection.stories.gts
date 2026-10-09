import { expect, fn } from 'storybook/test';

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
  title: 'Components/DataTable/Selection',
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
  args: { description: 'With selection' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      @onSelectionChange={{args.onSelectionChange}}
      as |table|
    >
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @isCheckable={{true}} @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row @item={{row.item}}>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Default.test(
  'selects single rows and all rows',
  async ({ canvasElement, userEvent, args }) => {
    await rowsRendered(canvasElement);
    const [selectAll, first] = canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    await userEvent.click(first!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([ROWS[0]]);
    await expect(first!.closest('tr')).toHaveClass('cds--data-table--selected');

    await userEvent.click(selectAll!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(ROWS);

    await userEvent.click(selectAll!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([]);
  },
);
