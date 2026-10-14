import preview from '#storybook/preview.ts';
import AISkeletonIcon from './ai-skeleton-icon.gts';
import AISkeletonPlaceholder from './ai-skeleton-placeholder.gts';
import AISkeletonText from './ai-skeleton-text.gts';
import '#storybook/styles/ai-skeleton.css';

// Carbon React's three AISkeleton story files share this page; ours is one
// file, documenting AISkeletonText. AISkeletonIcon and AISkeletonPlaceholder
// take no arguments.

const meta = preview.meta({
  title: 'Components/Skeleton/AISkeleton',
  component: AISkeletonText,
  parameters: {
    docs: {
      description: {
        component:
          'Skeletons for content that AI is generating: `AISkeletonText`, `AISkeletonPlaceholder` and `AISkeletonIcon` are `SkeletonText`, `SkeletonPlaceholder` and `SkeletonIcon` with the AI gradient. Size the placeholder and the icon with a `style` or `class` attribute.',
      },
    },
  },
});

export const _AISkeletonIcon = meta.story({
  name: 'AI Skeleton Icon',
  render: () => <template>
    <AISkeletonIcon class="ai-skeleton-story__icon" />
    <AISkeletonIcon class="ai-skeleton-story__icon-small" />
  </template>,
});

export const _AISkeletonPlaceholder = meta.story({
  name: 'AI Skeleton Placeholder',
  render: () => <template><AISkeletonPlaceholder /></template>,
});

export const _AISkeletonText = meta.story({
  name: 'AI Skeleton Text',
});
