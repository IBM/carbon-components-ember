import preview from '#storybook/preview.ts';
import NumberInputSkeleton from './number-input-skeleton.gts';

// Carbon React has no stories of its own for NumberInputSkeleton: it's the
// `Skeleton` story of Components/NumberInput.

const meta = preview.meta({
  title: 'Components/NumberInput/NumberInputSkeleton',
  component: NumberInputSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `NumberInput`.',
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
});

export const Default = meta.story();
