import { expect, fn, waitFor, within } from 'storybook/test';

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
  title: 'Components/DataTable/Expansion',
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
  args: { description: 'With expansion' },
  render: (args) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @isExpandable={{true}} @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row @item={{row.item}}>
            <:default>
              <Cells @Column={{table.Column}} @item={{row.item}} />
            </:default>
            <:expanded>
              {{! React's story uses an h6; h5 keeps the heading order valid
                below the table title's h4. }}
              <h5>Expandable row content</h5>
              <div>Description here</div>
            </:expanded>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Default.test(
  'expands and collapses a row',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    const [first] = canvas.getAllByRole('button', {
      name: 'Expand current row',
    });
    const parentRow = first!.closest('tr')!;
    const childRow = parentRow.nextElementSibling as HTMLElement;
    const content = childRow.querySelector('.cds--child-row-inner-container')!;
    const contentHeight = () => content.getBoundingClientRect().height;
    // Carbon's CSS collapses the always-rendered child row's content.
    await expect(contentHeight()).toBe(0);

    await userEvent.click(first!);
    await expect(parentRow).toHaveClass('cds--expandable-row');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAccessibleName('Collapse current row');
    await expect(
      within(childRow).getByText('Expandable row content'),
    ).toBeVisible();
    await waitFor(() => expect(contentHeight()).toBeGreaterThan(0));

    await userEvent.click(first!);
    await expect(parentRow).not.toHaveClass('cds--expandable-row');
    await waitFor(() => expect(contentHeight()).toBe(0));
  },
);
