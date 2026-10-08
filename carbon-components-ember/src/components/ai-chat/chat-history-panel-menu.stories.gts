import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryPanelMenu from './chat-history-panel-menu.gts';

import type { ChatHistoryPanelMenuSignature } from './chat-history-panel-menu.gts';

// Upstream documents `cds-aichat-history-panel-menu` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); these
// stories carry the docs-app page for the component itself.
//
// Parity gap: no `title-icon` slot (upstream shows a Pinned/Time/Search
// icon before the title).

const meta = preview.meta({
  title: 'AI Chat/Chat history/Panel menu',
  component: ChatHistoryPanelMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A collapsible group of `ChatHistoryPanelItem`s (e.g. "Today", "Yesterday"), rendered inside a `ChatHistoryPanelItems`. Uncontrolled by default (starts expanded, toggles itself on click); pass `@expanded` + `@onToggle` together for a fully controlled group.',
      },
    },
  },
  args: {
    title: 'Yesterday',
  },
  render: (args: ChatHistoryPanelMenuSignature['Args']) => <template>
    <div style="max-inline-size: 20rem;" role="list">
      <ChatHistoryPanelMenu
        @title={{args.title}}
        @expanded={{args.expanded}}
        @showActions={{args.showActions}}
        as |Item|
      >
        <Item @id="chat-1" @name="Trip planning" />
        <Item @id="chat-2" @name="Recipe ideas" />
      </ChatHistoryPanelMenu>
    </div>
  </template>,
});

export const Default = meta.story();

Default.test('collapses and expands itself', async ({ canvas, userEvent }) => {
  const toggle = canvas.getByRole('button', { name: 'Yesterday' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(toggle);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(toggle);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

export const Controlled = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'With `@expanded` and `@onToggle` the host owns the expanded state.',
      },
    },
  },
  args: {
    expanded: false,
    onToggle: fn(),
  },
  render: (args: ChatHistoryPanelMenuSignature['Args']) => {
    const state = trackedObject({ expanded: args.expanded ?? true });
    const toggle = (expanded: boolean) => {
      state.expanded = expanded;
      args.onToggle?.(expanded);
    };

    return <template>
      <div style="max-inline-size: 20rem;" role="list">
        <ChatHistoryPanelMenu
          @title={{args.title}}
          @expanded={{state.expanded}}
          @onToggle={{toggle}}
          as |Item|
        >
          <Item @id="chat-1" @name="Trip planning" />
          <Item @id="chat-2" @name="Recipe ideas" />
        </ChatHistoryPanelMenu>
      </div>
    </template>;
  },
});

Controlled.test('reports toggles', async ({ canvas, userEvent, args }) => {
  const toggle = canvas.getByRole('button', { name: 'Yesterday' });
  await userEvent.click(toggle);
  await expect(args.onToggle).toHaveBeenCalledWith(true);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
