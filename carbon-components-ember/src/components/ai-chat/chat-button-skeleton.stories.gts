import preview from '#storybook/preview.ts';
import ChatButtonSkeleton from './chat-button-skeleton.gts';
import '#storybook/styles/ai-chat/chat-button-skeleton.css';

// Mirrors the `Skeleton` story of `@carbon/ai-chat-components`'
// `Components/Chat button` (chat-button/__stories__/chat-button.stories.js),
// next to the `ChatButtonSkeleton` component it documents.

const meta = preview.meta({
  title: 'AI Chat/Chat button/Skeleton',
  component: ChatButtonSkeleton,
  parameters: {
    docs: {
      description: {
        component: 'Loading placeholder for `ChatButton`.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
});

export const Skeleton = meta.story({
  args: {
    size: 'md',
  },
});

export const Sizes = meta.story({
  parameters: {
    docs: {
      description: {
        story: 'The default (`lg`), `md` and `sm` sizes side by side.',
      },
    },
  },
  render: () => <template>
    <div class="ai-chat-chat-button-skeleton-story__row">
      <ChatButtonSkeleton />
      <ChatButtonSkeleton @size="md" />
      <ChatButtonSkeleton @size="sm" />
    </div>
  </template>,
});
