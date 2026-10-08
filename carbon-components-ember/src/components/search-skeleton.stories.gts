import preview from '#storybook/preview.ts';
import SearchSkeleton from './search-skeleton.gts';

// Carbon React has no stories of its own for SearchSkeleton: it's the
// `Skeleton` story of Components/Search.
// Parity gaps: no deprecated `small`: use `@size="sm"`.

const meta = preview.meta({
  title: 'Components/Search/SearchSkeleton',
  component: SearchSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Search` field. A `Search` that is already rendered can show `@isLoading` instead.',
      },
    },
  },
  args: {
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
});

export const Default = meta.story();
