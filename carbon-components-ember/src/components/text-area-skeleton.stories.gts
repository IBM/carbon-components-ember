import preview from '#storybook/preview.ts';
import TextAreaSkeleton from './text-area-skeleton.gts';

// Carbon React has no stories of its own for TextAreaSkeleton: it's the
// `Skeleton` story of Components/TextArea. No `render`: it takes no blocks.

const meta = preview.meta({
  title: 'Components/TextArea/TextAreaSkeleton',
  component: TextAreaSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `TextArea`. Use `@hideLabel` to leave out the label placeholder.',
      },
    },
  },
  args: {
    hideLabel: false,
  },
});

export const Default = meta.story();
