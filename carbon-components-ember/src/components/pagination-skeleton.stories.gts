import preview from '#storybook/preview.ts';
import PaginationSkeleton from './pagination-skeleton.gts';

// Carbon React has no stories for PaginationSkeleton.

const meta = preview.meta({
  title: 'Components/Pagination/PaginationSkeleton',
  component: PaginationSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Pagination` bar. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
});

export const Default = meta.story();
