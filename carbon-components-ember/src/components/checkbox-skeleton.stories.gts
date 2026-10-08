import preview from '#storybook/preview.ts';
import CheckboxSkeleton from './checkbox-skeleton.gts';

// Carbon React has no stories of its own for CheckboxSkeleton: it's the
// `Skeleton` story of Components/Checkbox.

const meta = preview.meta({
  title: 'Components/Checkbox/CheckboxSkeleton',
  component: CheckboxSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Checkbox` and its label. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
});

export const Default = meta.story();
