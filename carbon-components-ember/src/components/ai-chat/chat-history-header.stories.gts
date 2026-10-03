import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryHeader from './chat-history-header.gts';

import type { Args as HeaderArgs } from './chat-history-header.gts';

// Upstream documents `cds-aichat-history-header` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); these
// stories carry the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Header',
  component: ChatHistoryHeader,
  parameters: {
    docs: {
      description: {
        component:
          "Title bar for a `ChatHistory`'s `header` block, with an optional close button.",
      },
    },
  },
  args: {
    headerTitle: 'Chats',
    showCloseAction: true,
    onClose: fn(),
  },
  render: (args: HeaderArgs) => {
    const state = trackedObject({ closed: false });
    const handleClose = () => {
      state.closed = true;
      args.onClose?.();
    };

    return <template>
      <div style="max-inline-size: 20rem;">
        <ChatHistoryHeader
          @headerTitle={{args.headerTitle}}
          @closeButtonLabel={{args.closeButtonLabel}}
          @showCloseAction={{args.showCloseAction}}
          @onClose={{handleClose}}
        />
        <p>closed: <output>{{state.closed}}</output></p>
      </div>
    </template>;
  },
});

export const Default = meta.story({
  parameters: {
    // Known violations in the shared `Tooltip` wrapping the icon-only close
    // button: `aria-prohibited-attr` (aria-labelledby on its role-less
    // trigger span) and `button-name` (`@closeButtonLabel` never names the
    // button).
    a11y: { test: 'todo' },
  },
});

Default.test(
  'the close button calls @onClose',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(
      canvasElement.querySelector('.cds-aichat-history-header__close-button')!,
    );
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('status')).toHaveTextContent('true');
  },
);

export const WithoutCloseAction = meta.story({
  args: {
    showCloseAction: false,
  },
});
