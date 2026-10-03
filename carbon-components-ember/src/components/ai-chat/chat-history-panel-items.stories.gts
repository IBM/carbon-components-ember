import preview from '#storybook/preview.ts';
import ChatHistoryPanelItems from './chat-history-panel-items.gts';

import type { Args as PanelItemsArgs } from './chat-history-panel-items.gts';

// Upstream documents `cds-aichat-history-panel-items` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); this
// story carries the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel items',
  component: ChatHistoryPanelItems,
  parameters: {
    // Known violations in the components (tracked as bugs):
    // - OverflowMenu (each item's actions menu): `aria-command-name` (its
    //   trigger is a role="button" with only an aria-describedby tooltip).
    // - ChatHistoryPanelItems: `aria-required-children` (role="list" whose
    //   items have no listitem role).
    // - ChatHistoryPanelMenu: `list` (its `<ul>` holds the items' `<div>`s,
    //   not `<li>`s).
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          "Plain list wrapper (`role='list'`) for a `ChatHistoryPanel`'s items - yields both `ChatHistoryPanelItem` and `ChatHistoryPanelMenu` pre-bound with `@showActions`, so top-level items and collapsible groups can be mixed directly in the default block. Usually obtained via `ChatHistoryPanel`'s yielded block param rather than imported directly.",
      },
    },
  },
  render: (args: PanelItemsArgs) => <template>
    <div style="max-inline-size: 20rem;">
      <ChatHistoryPanelItems @showActions={{args.showActions}} as |Item Menu|>
        <Item @id="chat-1" @name="Trip planning" @selected={{true}} />
        <Menu @title="Yesterday" as |NestedItem|>
          <NestedItem @id="chat-2" @name="Recipe ideas" />
        </Menu>
      </ChatHistoryPanelItems>
    </div>
  </template>,
});

export const Default = meta.story();
