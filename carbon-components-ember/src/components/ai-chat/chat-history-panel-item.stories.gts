import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Edit from '../icons/edit.ts';
import TrashCan from '../icons/trash-can.ts';
import ChatHistoryPanelItem from './chat-history-panel-item.gts';

import type {
  ChatHistoryPanelItemSignature,
  ChatHistoryItemAction,
} from './chat-history-panel-item.gts';

// Upstream documents `cds-aichat-history-panel-item` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); these
// stories carry the docs-app page for the component itself.

const ACTIONS: ChatHistoryItemAction[] = [
  { text: 'Rename', icon: Edit },
  { text: 'Delete', icon: TrashCan, delete: true, divider: true },
];

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel item',
  component: ChatHistoryPanelItem,
  parameters: {
    docs: {
      description: {
        component:
          "A single chat history entry: a selectable row with a name and an overflow-actions menu, or (when `@rename` is set) swapped for a `ChatHistoryPanelItemInput`. Usually obtained via `ChatHistoryPanelItems`'s or `ChatHistoryPanelMenu`'s yielded block param rather than imported directly - see **AI Chat/Chat history** for a fuller, interactive example wiring rename/delete together.",
      },
    },
  },
  args: {
    id: 'chat-1',
    name: 'Trip planning',
    selected: true,
    showActions: true,
    actions: ACTIONS,
    onSelect: fn(),
    onMenuAction: fn(),
    onRenameSave: fn(),
    onRenameCancel: fn(),
  },
  render: (args: ChatHistoryPanelItemSignature['Args']) => {
    const state = trackedObject({ selected: '(none yet)' });
    const handleSelect = (detail: { itemId?: string; itemName?: string }) => {
      state.selected = detail.itemName ?? '';
      args.onSelect?.(detail);
    };

    return <template>
      <ul style="max-inline-size: 20rem;">
        <ChatHistoryPanelItem
          @id={{args.id}}
          @name={{args.name}}
          @selected={{args.selected}}
          @rename={{args.rename}}
          @renameInvalid={{args.renameInvalid}}
          @renameInvalidMessage={{args.renameInvalidMessage}}
          @showActions={{args.showActions}}
          @overflowMenuLabel={{args.overflowMenuLabel}}
          @actions={{args.actions}}
          @onSelect={{handleSelect}}
          @onMenuAction={{args.onMenuAction}}
          @onRenameSave={{args.onRenameSave}}
          @onRenameCancel={{args.onRenameCancel}}
        />
      </ul>
      <p>selected: <output>{{state.selected}}</output></p>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'selects the item and reports menu actions',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trip planning' }),
    );
    await expect(args.onSelect).toHaveBeenCalledWith({
      itemId: 'chat-1',
      itemName: 'Trip planning',
    });
    await expect(canvas.getByRole('status')).toHaveTextContent('Trip planning');

    await userEvent.click(canvasElement.querySelector('.cds--overflow-menu')!);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByText('Rename'));
    await expect(args.onMenuAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'Rename', itemId: 'chat-1' }),
    );
  },
);

export const Rename = meta.story({
  args: {
    rename: true,
  },
});

export const RenameInvalid = meta.story({
  args: {
    rename: true,
    renameInvalid: true,
    renameInvalidMessage: 'Title cannot exceed 75 characters.',
  },
});
