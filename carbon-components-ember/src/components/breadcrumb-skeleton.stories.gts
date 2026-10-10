import preview from '#storybook/preview.ts';
import BreadcrumbSkeleton from './breadcrumb-skeleton.gts';

// Carbon React has no stories of its own for BreadcrumbSkeleton: it's the
// `Skeleton` story of Components/Breadcrumb.

const meta = preview.meta({
  title: 'Components/Breadcrumb/BreadcrumbSkeleton',
  component: BreadcrumbSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `Breadcrumbs` trail of `@items` items.',
      },
    },
  },
  args: {
    items: 3,
    noTrailingSlash: false,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
});

export const Default = meta.story();
