import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryPanelItemInput from './chat-history-panel-item-input.gts';

import type { Args as ItemInputArgs } from './chat-history-panel-item-input.gts';

// Upstream documents `cds-aichat-history-panel-item-input` only through the
// rename flow of its `Components/Chat history` stories (see
// chat-history.stories.gts); these stories carry the docs-app page for the
// component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel item input',
  component: ChatHistoryPanelItemInput,
  parameters: {
    // Known violations in the shared `Tooltip` wrapping the icon-only
    // cancel/save buttons: `aria-prohibited-attr` (aria-labelledby on its
    // role-less trigger span) and `button-name` (`@cancelLabel`/
    // `@saveLabel` never name the buttons).
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          'Rename input swapped in for a `ChatHistoryPanelItem` while `@rename` is set: a text field plus cancel/save icon buttons, auto-focused and selected on mount. Saves/cancels on Enter/Escape, and on blur.',
      },
    },
  },
  args: {
    value: 'Trip planning',
    labelText: 'Chat name',
    onChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args: ItemInputArgs) => {
    const state = trackedObject({ result: '(none yet)' });
    const handleSave = (value: string) => {
      state.result = `saved "${value}"`;
      args.onSave?.(value);
    };
    const handleCancel = () => {
      state.result = 'canceled';
      args.onCancel?.();
    };

    return <template>
      <div style="max-inline-size: 20rem;">
        <ChatHistoryPanelItemInput
          @value={{args.value}}
          @labelText={{args.labelText}}
          @placeholder={{args.placeholder}}
          @invalid={{args.invalid}}
          @invalidMessage={{args.invalidMessage}}
          @onChange={{args.onChange}}
          @onSave={{handleSave}}
          @onCancel={{handleCancel}}
        />
      </div>
      <p>result: <output>{{state.result}}</output></p>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'saves on Enter and cancels on Escape',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Chat name' });
    // The input focuses and selects itself on the next animation frame.
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.clear(input);
    await userEvent.type(input, 'Road trip{Enter}');
    await expect(args.onSave).toHaveBeenCalledWith('Road trip');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'saved "Road trip"',
    );

    await userEvent.type(input, '{Escape}');
    await expect(args.onCancel).toHaveBeenCalled();
  },
);

export const Invalid = meta.story({
  args: {
    invalid: true,
    invalidMessage: 'Title cannot exceed 75 characters.',
  },
});
