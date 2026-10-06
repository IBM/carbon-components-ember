import preview from '#storybook/preview.ts';
import SliderSkeleton from './slider-skeleton.gts';

// Carbon React has no stories of its own for SliderSkeleton: it's the
// `Skeleton` story of Components/Slider. No `render`: it takes no blocks.

const meta = preview.meta({
  title: 'Components/Slider/SliderSkeleton',
  component: SliderSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Slider`. Use `@twoHandles` for the placeholder of a two-handle (range) slider, and `@hideLabel` to leave out the label placeholder.',
      },
    },
  },
  args: {
    hideLabel: false,
    twoHandles: false,
  },
});

export const Default = meta.story();
