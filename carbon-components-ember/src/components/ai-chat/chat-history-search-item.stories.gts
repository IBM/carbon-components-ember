import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistorySearchItem from './chat-history-search-item.gts';

import type { Args as SearchItemArgs } from './chat-history-search-item.gts';

// Upstream documents `cds-aichat-history-search-item` only inside its
// `Components/Chat history` stories (`SearchResults`, see
// chat-history.stories.gts); these stories carry the docs-app page for the
// component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Search item',
  component: ChatHistorySearchItem,
  parameters: {
    docs: {
      description: {
        component:
          "A single search-result row (name + date), typically rendered while a `ChatHistoryToolbar`'s search field has an active query.",
      },
    },
  },
  args: {
    onSelect: fn(),
  },
  render: (args: SearchItemArgs) => {
    const state = trackedObject({ selected: '(none yet)' });
    const handleSelect = (detail: { itemId?: string; itemName?: string }) => {
      state.selected = detail.itemName ?? '';
      args.onSelect?.(detail);
    };

    return <template>
      <ul style="max-inline-size: 20rem;">
        <ChatHistorySearchItem
          @id="chat-1"
          @name="Trip planning"
          @date="Sep 12"
          @onSelect={{handleSelect}}
        />
        <ChatHistorySearchItem
          @id="chat-2"
          @name="Recipe ideas"
          @date="Sep 10"
          @onSelect={{handleSelect}}
        />
      </ul>
      <p>selected: <output>{{state.selected}}</output></p>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'reports the selected result',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Recipe ideas/ }));
    await expect(args.onSelect).toHaveBeenCalledWith({
      itemId: 'chat-2',
      itemName: 'Recipe ideas',
    });
    await expect(canvas.getByRole('status')).toHaveTextContent('Recipe ideas');
  },
);

export const Disabled = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A disabled row with block content, as upstream uses for "No available chats".',
      },
    },
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive (disabled) controls from contrast
        // minimums.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  args: {
    disabled: true,
  },
  render: (args: SearchItemArgs) => <template>
    <ul style="max-inline-size: 20rem;">
      <ChatHistorySearchItem @disabled={{args.disabled}}>
        No available chats
      </ChatHistorySearchItem>
    </ul>
  </template>,
});
