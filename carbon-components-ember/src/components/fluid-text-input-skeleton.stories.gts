import preview from '#storybook/preview.ts';
import FluidTextInputSkeleton from './fluid-text-input-skeleton.gts';

// Carbon React has no stories of its own for FluidTextInputSkeleton: it's
// the `Skeleton` story of Components/Fluid Components/FluidTextInput.

const meta = preview.meta({
  title: 'Components/Fluid Components/FluidTextInput/FluidTextInputSkeleton',
  component: FluidTextInputSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `FluidTextInput`. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
});

export const Default = meta.story();
