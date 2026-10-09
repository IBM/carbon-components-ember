import { fn } from 'storybook/test';

import {
  ROWS,
  HEADERS_WITH_MENU,
  Cells,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTable from '../data-table.gts';

import type { StoryArgs } from '#storybook/fixtures/data-table.gts';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Skeleton',
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
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @isLoading={{args.isLoading}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @expandable={{true}} />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS_WITH_MENU}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
            <table.Menu as |Item|>
              <Item @itemText="Edit" />
            </table.Menu>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
      <table.Pagination />
    </DataTable>
  </template>,
});

export const Skeleton = meta.story({
  args: { isLoading: true },
  parameters: {
    docs: {
      description: {
        story:
          '`@isLoading` puts the table, its search and its pagination into their loading/skeleton state.',
      },
    },
  },
});
