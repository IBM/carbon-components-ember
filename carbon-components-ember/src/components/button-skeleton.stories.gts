import preview from '#storybook/preview.ts';
import ButtonSkeleton from './button-skeleton.gts';

// Carbon React has no stories of its own for ButtonSkeleton: it's the
// `Skeleton` story of Components/Button.
// Parity gap: no deprecated `small`; use `@size="sm"`. (`Button` itself has
// no `@href` yet, though this takes one.)

const meta = preview.meta({
  title: 'Components/Button/ButtonSkeleton',
  component: ButtonSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `Button`, in any of its sizes.',
      },
    },
  },
  args: {
    size: 'lg',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  },
});

export const Default = meta.story();
