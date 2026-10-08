import preview from '#storybook/preview.ts';
import DropdownSkeleton from './dropdown-skeleton.gts';

import type { DropdownSkeletonSignature } from './dropdown-skeleton.gts';

// Carbon React has no stories of its own for DropdownSkeleton: it's the
// `Skeleton` story of Components/Dropdown.

const meta = preview.type<{ args: DropdownSkeletonSignature['Args'] }>().meta({
  title: 'Components/Dropdown/DropdownSkeleton',
  component: DropdownSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `Dropdown`.',
      },
    },
  },
  args: {
    hideLabel: false,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <template>
    <div style="width: 300px">
      <DropdownSkeleton @hideLabel={{args.hideLabel}} @size={{args.size}} />
    </div>
  </template>,
});

export const Default = meta.story();
