import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Launcher from './launcher.gts';

// Mirrors `@carbon/ai-chat-components`' `launcher.stories.js` (`Default`,
// `AIEnabled`, `WithUnreadCount`, `WithAvatar`).
//
// docs-app coverage: its single demo rendered four launchers side by side
// (default, unread count, unread indicator, AI-enabled with a left tooltip)
// with a click counter. Default/unread-count/AI-enabled are the parity
// stories below; the unread-indicator variant (no upstream story) is
// `WithUnreadIndicator`; the side-by-side layout is `AllVariants`. The
// click counter is replaced by the `onToggle` spy in the Actions panel.
//
// Parity gaps: `@openLabel` is accepted but, like upstream's own
// `open-label`, never read (see the component's doc comment).
// `WithAvatar` points at the same remote avatar URL upstream uses.

const meta = preview.meta({
  title: 'AI Chat/Launcher',
  component: Launcher,
  parameters: {
    docs: {
      description: {
        component: [
          '`Launcher` is the floating button that opens a [Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat) window.',
          '',
          'It is stateless — it always renders its "open chat" appearance and fires `@onToggle` on click. The host application owns whether the chat window is open, and decides whether to keep rendering this button, swap it for a close button, or render `ChatShell` instead.',
        ].join('\n'),
      },
    },
  },
  args: {
    showUnreadIndicator: false,
    unreadMessageCount: 0,
    closedLabel: 'Open chat',
    openLabel: 'Close chat',
    aiEnabled: false,
    tooltipPosition: 'right',
    onToggle: fn(),
  },
  // Leave room for the tooltip so it stays inside the canvas.
  decorators: [
    (Story, context) => <template>
      <div style="padding: 2rem 12rem 2rem 2rem;">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story();

Default.test('fires onToggle on click', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open chat' }));
  await expect(args.onToggle).toHaveBeenCalledOnce();
});

export const AIEnabled = meta.story({
  name: 'AI enabled',
  args: {
    aiEnabled: true,
    closedLabel: 'Open AI chat',
    openLabel: 'Close AI chat',
  },
});

export const WithUnreadCount = meta.story({
  name: 'With unread count',
  args: {
    unreadMessageCount: 3,
    unreadLabel: '3 unread messages',
  },
});

WithUnreadCount.test(
  'shows the count and announces it in the label',
  async ({ canvas }) => {
    const button = canvas.getByRole('button', {
      name: 'Open chat. 3 unread messages',
    });
    await expect(
      button.querySelector('.cds-aichat-launcher__count-indicator'),
    ).toHaveTextContent('3');
  },
);

export const WithAvatar = meta.story({
  name: 'With avatar',
  args: {
    launcherAvatarUrl: 'https://i.pravatar.cc/150?u=33',
  },
});

// Not an upstream story: docs-app's demo also showed the unread dot without
// a count.
export const WithUnreadIndicator = meta.story({
  name: 'With unread indicator',
  args: {
    showUnreadIndicator: true,
  },
});

WithUnreadIndicator.test('shows an empty indicator dot', async ({ canvas }) => {
  const button = canvas.getByRole('button', { name: 'Open chat' });
  const indicator = button.querySelector(
    '.cds-aichat-launcher__count-indicator',
  );
  await expect(indicator).not.toBeNull();
  await expect(indicator).toHaveTextContent('');
});

// docs-app's demo rendered these variants side by side.
export const AllVariants = meta.story({
  name: 'All variants',
  render: (args) => <template>
    <div
      style="display: flex; gap: 2rem; align-items: flex-end; flex-wrap: wrap;"
    >
      <Launcher @closedLabel="Open chat" @onToggle={{args.onToggle}} />
      <Launcher
        @closedLabel="Open chat"
        @unreadMessageCount={{3}}
        @unreadLabel="3 unread messages"
        @onToggle={{args.onToggle}}
      />
      <Launcher
        @closedLabel="Open chat"
        @showUnreadIndicator={{true}}
        @onToggle={{args.onToggle}}
      />
      <Launcher
        @closedLabel="Open AI chat"
        @aiEnabled={{true}}
        @tooltipPosition="left"
        @onToggle={{args.onToggle}}
      />
    </div>
  </template>,
});
