import preview from '#storybook/preview.ts';
import TextInputSkeleton from './text-input-skeleton.gts';

// Carbon React has no stories of its own for TextInputSkeleton: it's the
// `Skeleton` story of Components/TextInput.

const meta = preview.meta({
  title: 'Components/TextInput/TextInputSkeleton',
  component: TextInputSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `TextInput`.',
      },
    },
  },
  args: {
    hideLabel: false,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
});

export const Default = meta.story();
