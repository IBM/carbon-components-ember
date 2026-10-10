import preview from '#storybook/preview.ts';
import SelectSkeleton from './select-skeleton.gts';

// Carbon React has no stories of its own for SelectSkeleton: it's the
// `Skeleton` story of Components/Select.

const meta = preview.meta({
  title: 'Components/Select/SelectSkeleton',
  component: SelectSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `Select`.',
      },
    },
  },
  args: {
    hideLabel: false,
  },
});

export const Default = meta.story();
