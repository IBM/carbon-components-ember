import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryDeletePanel from './chat-history-delete-panel.gts';

import type { Args as DeletePanelArgs } from './chat-history-delete-panel.gts';

// Upstream documents `cds-aichat-history-delete-panel` only as part of the
// `DeleteFlow` story of `Components/Chat history` (see
// chat-history.stories.gts); these stories carry the docs-app page for the
// component itself.

type StoryArgs = DeletePanelArgs & {
  /** Story-only: text yielded to the `title` block. */
  title?: string;
  /** Story-only: text yielded to the `description` block. */
  description?: string;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Chat history/Delete panel',
  component: ChatHistoryDeletePanel,
  parameters: {
    docs: {
      description: {
        component:
          'Confirmation overlay for deleting a chat history item, typically absolutely positioned over a `ChatHistoryPanel`.',
      },
    },
  },
  args: {
    itemId: 'chat-1',
    title: 'Delete "Trip planning"?',
    description: 'This chat will be permanently deleted.',
    onCancel: fn(),
    onConfirm: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ result: '(none yet)' });
    const handleCancel = () => {
      state.result = 'canceled';
      args.onCancel?.();
    };
    const handleConfirm = (detail: { itemId?: string }) => {
      state.result = `deleted ${detail.itemId}`;
      args.onConfirm?.(detail);
    };

    return <template>
      <div
        style="max-inline-size: 20rem; block-size: 10rem; position: relative; border: 1px solid var(--cds-border-subtle, #e0e0e0);"
      >
        <ChatHistoryDeletePanel
          @itemId={{args.itemId}}
          @cancelText={{args.cancelText}}
          @deleteText={{args.deleteText}}
          @onCancel={{handleCancel}}
          @onConfirm={{handleConfirm}}
        >
          <:title>{{args.title}}</:title>
          <:description>{{args.description}}</:description>
        </ChatHistoryDeletePanel>
      </div>
      <p>result: <output>{{state.result}}</output></p>
    </template>;
  },
});

export const Default = meta.story();

Default.test('confirms and cancels', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: /Delete/ }));
  await expect(args.onConfirm).toHaveBeenCalledWith({ itemId: 'chat-1' });
  await expect(canvas.getByRole('status')).toHaveTextContent('deleted chat-1');

  await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
  await expect(args.onCancel).toHaveBeenCalledTimes(1);
});

export const DefaultText = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Without `title`/`description` blocks the panel falls back to its default copy.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <div style="max-inline-size: 20rem; block-size: 10rem; position: relative;">
      <ChatHistoryDeletePanel
        @itemId={{args.itemId}}
        @onCancel={{args.onCancel}}
        @onConfirm={{args.onConfirm}}
      />
    </div>
  </template>,
});
