import preview from '#storybook/preview.ts';
import ChatHistoryPanel from './chat-history-panel.gts';

import type { Args as PanelArgs } from './chat-history-panel.gts';

// Upstream documents `cds-aichat-history-panel` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); this
// story carries the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel',
  component: ChatHistoryPanel,
  parameters: {
    // Known violations in the components (tracked as bugs):
    // - OverflowMenu (each item's actions menu): `aria-command-name` (its
    //   trigger is a role="button" with only an aria-describedby tooltip).
    // - ChatHistoryPanelItems: `aria-required-children` (role="list" whose
    //   items have no listitem role).
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          "A `cds--side-nav`-styled panel listing chat history items, yielding `ChatHistoryPanelItems` pre-bound with `@showActions`. Typically rendered inside a `ChatHistoryContent`, itself inside `ChatHistory`'s `content` block - see **AI Chat/Chat history** for a fuller, interactive example.",
      },
    },
  },
  render: (args: PanelArgs) => <template>
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
