import preview from '#storybook/preview.ts';
import ToggleSkeleton from './toggle-skeleton.gts';

// Carbon React has no stories of its own for ToggleSkeleton: it's the
// `Skeleton` story of Components/Toggle.

const meta = preview.meta({
  title: 'Components/Toggle/ToggleSkeleton',
  component: ToggleSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Toggle`. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
});

export const Default = meta.story();
