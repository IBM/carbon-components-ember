import preview from '#storybook/preview.ts';
import ChatHistoryContent from './chat-history-content.gts';
import ChatHistoryLoading from './chat-history-loading.gts';
import style from 'ember-style-modifier';

// Upstream documents `cds-aichat-history-loading` only as the `Loading`
// story of `Components/Chat history` (see chat-history.stories.gts); this
// story carries the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Loading',
  component: ChatHistoryLoading,
  parameters: {
    docs: {
      description: {
        component:
          'Loading placeholder rendered inside a `ChatHistoryContent` while chat history is being fetched: four short skeleton lines followed by four two-line skeleton paragraphs.',
      },
    },
  },
  render: () => <template>
    <div {{style maxInlineSize="20rem" blockSize="20rem"}}>
      <ChatHistoryContent>
        <ChatHistoryLoading />
      </ChatHistoryContent>
    </div>
  </template>,
});

export const Default = meta.story();
