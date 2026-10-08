import preview from '#storybook/preview.ts';
import ChatHistoryPanel from './chat-history-panel.gts';

import type { ChatHistoryPanelSignature } from './chat-history-panel.gts';

// Upstream documents `cds-aichat-history-panel` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); this
// story carries the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel',
  component: ChatHistoryPanel,
  parameters: {
    docs: {
      description: {
        component:
          "A `cds--side-nav`-styled panel listing chat history items, yielding `ChatHistoryPanelItems` pre-bound with `@showActions`. Typically rendered inside a `ChatHistoryContent`, itself inside `ChatHistory`'s `content` block - see **AI Chat/Chat history** for a fuller, interactive example.",
      },
    },
  },
  render: (args: ChatHistoryPanelSignature['Args']) => <template>
    <div style="max-inline-size: 20rem; block-size: 10rem;">
      <ChatHistoryPanel
        @expanded={{args.expanded}}
        @showActions={{args.showActions}}
        aria-label="Chat history"
        as |Items|
      >
        <Items as |Item|>
          <Item @id="chat-1" @name="Trip planning" @selected={{true}} />
          <Item @id="chat-2" @name="Recipe ideas" />
        </Items>
      </ChatHistoryPanel>
    </div>
  </template>,
});

export const Default = meta.story();

export const ShowActions = meta.story({
  args: {
    showActions: true,
  },
});
