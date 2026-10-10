import preview from '#storybook/preview.ts';
import StructuredListSkeleton from './structured-list-skeleton.gts';

import type { StructuredListSkeletonSignature } from './structured-list-skeleton.gts';

// Carbon React has no stories of its own for StructuredListSkeleton: it's
// the `Skeleton` story of Components/StructuredList.

const meta = preview
  .type<{ args: StructuredListSkeletonSignature['Args'] }>()
  .meta({
    title: 'Components/StructuredList/StructuredListSkeleton',
    component: StructuredListSkeleton,
    parameters: {
      docs: {
        description: {
          component:
            'A loading placeholder for a `StructuredList` with a header row and `@rowCount` rows.',
        },
      },
    },
    args: {
      rowCount: 5,
    },
    argTypes: {
      rowCount: { control: { type: 'number', min: 1, max: 10 } },
    },
    render: (args) => <template>
      <div style="width: 800px">
        <StructuredListSkeleton @rowCount={{args.rowCount}} />
      </div>
    </template>,
  });

export const Default = meta.story();
