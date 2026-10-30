import preview from '#storybook/preview.ts';
import TabsSkeleton from './tabs-skeleton.gts';

// Carbon React has no stories of its own for TabsSkeleton: it's the
// `Skeleton` story of Components/Tabs.

const meta = preview.meta({
  title: 'Components/Tabs/TabsSkeleton',
  component: TabsSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for `Tabs`: render it in place of `Tabs` while the tabs load.',
      },
    },
  },
  args: {
    contained: false,
  },
});

export const Default = meta.story();
