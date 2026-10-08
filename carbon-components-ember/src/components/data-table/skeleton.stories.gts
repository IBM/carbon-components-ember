import {
  ROWS,
  HEADERS,
  HEADERS_WITH_MENU,
  Cells,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTable from '../data-table.gts';
import DataTableSkeleton from '../data-table-skeleton.gts';

import type { DataTableSkeletonSignature } from '../data-table-skeleton.gts';

const meta = preview.type<{ args: DataTableSkeletonSignature['Args'] }>().meta({
  title: 'Components/DataTable/Skeleton',
  component: DataTableSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `DataTable`, for before there is any data to give it. Pass it the headers you will give the table, and it shows a column for each. A `DataTable` that already has its data can show `@isLoading` instead.',
      },
    },
  },
  args: {
    rowCount: 5,
    showHeader: true,
    showToolbar: true,
    size: 'lg',
    zebra: false,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    headers: { control: false },
  },
  render: (args) => <template>
    <div style="width: 800px">
      <DataTableSkeleton
        @headers={{HEADERS}}
        @columnCount={{args.columnCount}}
        @rowCount={{args.rowCount}}
        @showHeader={{args.showHeader}}
        @showToolbar={{args.showToolbar}}
        @size={{args.size}}
        @zebra={{args.zebra}}
        aria-label="sample table"
      />
    </div>
  </template>,
});

export const Skeleton = meta.story();

export const Loading = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`@isLoading` puts a `DataTable`, its search and its pagination into their loading state.',
      },
    },
  },
  render: () => <template>
    <DataTable
      @title="DataTable"
      @description="With toolbar"
      @isLoading={{true}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @expandable={{true}} />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table>
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
