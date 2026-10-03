import preview from '#storybook/preview.ts';
import SkeletonText from './skeleton-text.gts';

// Carbon React parity gaps: none. React's `className` arg is covered by
// Ember's `...attributes` (pass `class=` directly).

// No `render`: SkeletonText takes no blocks, so every arg is passed straight
// through as a named argument.
const meta = preview.meta({
  title: 'Components/Skeleton/SkeletonText',
  component: SkeletonText,
  parameters: {
    docs: {
      description: {
        component:
          'A placeholder for text while content is loading. Use `@heading` for a larger line, or `@paragraph` with `@lineCount` for several lines of varying width.',
      },
    },
  },
  argTypes: {
    lineCount: { control: { type: 'number' } },
    width: { control: { type: 'text' } },
  },
});

export const Default = meta.story({
  args: {
    heading: false,
    paragraph: false,
    width: '100%',
    lineCount: 3,
  },
});

export const Heading = meta.story({
  args: {
    heading: true,
  },
});

export const Paragraph = meta.story({
  args: {
    paragraph: true,
    lineCount: 3,
  },
});
