import preview from '#storybook/preview.ts';
import TagSkeleton from './tag-skeleton.gts';

// Carbon React has no stories of its own for TagSkeleton: it's the
// `Skeleton` story of Components/Tag.

const meta = preview.meta({
  title: 'Components/Tag/TagSkeleton',
  component: TagSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'A loading placeholder for a `Tag`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm'] },
  },
});

export const Default = meta.story();
