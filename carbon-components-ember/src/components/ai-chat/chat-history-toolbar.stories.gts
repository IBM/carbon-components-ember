import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChatHistoryToolbar from './chat-history-toolbar.gts';

import type { Args as ToolbarArgs } from './chat-history-toolbar.gts';

// Upstream documents `cds-aichat-history-toolbar` only inside its
// `Components/Chat history` stories (see chat-history.stories.gts); these
// stories carry the docs-app page for the component itself.

const meta = preview.meta({
  title: 'AI Chat/Chat history/Toolbar',
  component: ChatHistoryToolbar,
  parameters: {
    docs: {
      description: {
        component:
          'Toolbar for a `ChatHistory`\'s `toolbar` block: an optional search field, plus a "new chat" icon button.',
      },
    },
  },
  args: {
    searchOff: false,
    onSearch: fn(),
    onNewChat: fn(),
  },
  render: (args: ToolbarArgs) => {
    const state = trackedObject({ search: '', newChats: 0 });
    const handleSearch = (value: string) => {
      state.search = value;
      args.onSearch?.(value);
    };
    const handleNewChat = () => {
      state.newChats = state.newChats + 1;
      args.onNewChat?.();
    };

    return <template>
      <div style="max-inline-size: 20rem;">
        <ChatHistoryToolbar
          @newChatLabel={{args.newChatLabel}}
          @searchOff={{args.searchOff}}
          @searchAttributes={{args.searchAttributes}}
          @onSearch={{handleSearch}}
          @onSearchClear={{args.onSearchClear}}
          @onNewChat={{handleNewChat}}
        />
        <p>search: "{{state.search}}", new chats clicked:
          {{state.newChats}}</p>
      </div>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'reports searches and new chats',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.type(canvas.getByRole('searchbox'), 'trip');
    await waitFor(() => expect(args.onSearch).toHaveBeenLastCalledWith('trip'));

    await userEvent.click(
      canvasElement.querySelector('.cds-aichat-history-toolbar__new-chat')!,
    );
    await expect(args.onNewChat).toHaveBeenCalledTimes(1);
    await expect(
      canvas.getByText(/new chats clicked:\s*1/),
    ).toBeInTheDocument();
  },
);

export const SearchOff = meta.story({
  args: {
    searchOff: true,
  },
});
