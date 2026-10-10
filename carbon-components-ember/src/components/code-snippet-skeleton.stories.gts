import preview from '#storybook/preview.ts';
import CodeSnippetSkeleton from './code-snippet-skeleton.gts';

// Carbon React has no stories of its own for CodeSnippetSkeleton: it's the
// `Skeleton` story of Components/CodeSnippet.

const meta = preview.meta({
  title: 'Components/CodeSnippet/CodeSnippetSkeleton',
  component: CodeSnippetSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `CodeSnippet`: one line for `single`, three for `multi`.',
      },
    },
  },
  args: {
    type: 'single',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multi'] },
  },
});

export const Default = meta.story();
