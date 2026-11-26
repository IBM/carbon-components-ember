import { HEADERS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import DataTableSkeleton from '../data-table-skeleton.gts';

import type { DataTableSkeletonSignature } from '../data-table-skeleton.gts';
import '#storybook/styles/data-table/skeleton.css';

// Carbon React's `DataTable/Skeleton` page: `Skeleton`.
//
// Parity gaps:
// - React's `DataTable` has no loading state to show, so none is ported.

const meta = preview.type<{ args: DataTableSkeletonSignature['Args'] }>().meta({
  title: 'Components/DataTable/Skeleton',
  component: DataTableSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          "A loading placeholder for a table, as Carbon React's DataTableSkeleton. Pass it the headers you will give the table, and it shows a column for each. A `DataTable` has no loading state, as Carbon React's has none.",
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
    <div class="data-table-skeleton-story__container">
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
