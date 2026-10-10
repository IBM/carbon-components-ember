import preview from '#storybook/preview.ts';
import RadioButtonSkeleton from './radio-button-skeleton.gts';

// Carbon React has no stories of its own for RadioButtonSkeleton: it's the
// `Skeleton` story of Components/RadioButton.

const meta = preview.meta({
  title: 'Components/RadioButton/RadioButtonSkeleton',
  component: RadioButtonSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `RadioButton` and its label. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
});

export const Default = meta.story();
