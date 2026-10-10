import preview from '#storybook/preview.ts';
import ProgressIndicatorSkeleton from './progress-indicator-skeleton.gts';

// Carbon React has no stories of its own for ProgressIndicatorSkeleton: it's
// the `Skeleton` story of Components/ProgressIndicator.

const meta = preview.meta({
  title: 'Components/ProgressIndicator/ProgressIndicatorSkeleton',
  component: ProgressIndicatorSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `ProgressIndicator` of four steps.',
      },
    },
  },
  args: {
    vertical: false,
  },
});

export const Default = meta.story();
