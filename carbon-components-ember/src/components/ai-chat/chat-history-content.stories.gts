import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryContent from './chat-history-content.gts';

import type { ChatHistoryContentSignature } from './chat-history-content.gts';
import '#storybook/styles/ai-chat/chat-history-content.css';

// Upstream documents `cds-aichat-history-content` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); these
// stories carry the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Content',
  component: ChatHistoryContent,
  parameters: {
    docs: {
      description: {
        component:
          'Scroll container for a `ChatHistoryPanel` (or a `ChatHistoryLoading`), showing an optional live-announced results count above the list.',
      },
    },
  },
  args: {
    resultsCount: 3,
  },
  render: (args: ChatHistoryContentSignature['Args']) => <template>
    <div class="ai-chat-chat-history-content-story__container">
      <ChatHistoryContent
        @resultsLabel={{args.resultsLabel}}
        @resultsCount={{args.resultsCount}}
      >
        <p class="ai-chat-chat-history-content-story__text">list content goes
          here</p>
      </ChatHistoryContent>
    </div>
  </template>,
});

export const Default = meta.story();

Default.test('shows the results count', async ({ canvas }) => {
  await expect(canvas.getByText('Results: 3')).toBeVisible();
});

export const WithoutResultsCount = meta.story({
  args: {
    resultsCount: undefined,
  },
});
