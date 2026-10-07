import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { RenderStory } from 'ember-storybook';
import { expect, fn as spy, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Edit from '../icons/edit.ts';
import TrashCan from '../icons/trash-can.ts';
import ChatHistory from './chat-history.gts';
import ChatHistoryContent from './chat-history-content.gts';
import ChatHistoryDeletePanel from './chat-history-delete-panel.gts';
import ChatHistoryHeader from './chat-history-header.gts';
import ChatHistoryLoading from './chat-history-loading.gts';
import ChatHistoryPanel from './chat-history-panel.gts';
import ChatHistorySearchItem from './chat-history-search-item.gts';
import ChatHistoryToolbar from './chat-history-toolbar.gts';

import type { ChatHistoryItemAction } from './chat-history-panel-item.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Chat history` stories
// (chat-history/__stories__/chat-history.stories.js). Every sub-component
// also has its own `AI Chat/Chat history/<Name>` stories file next to it,
// carrying the docs-app page for that component.
//
// Parity gaps:
// - `ChatHistoryPanelMenu` has no `title-icon` slot, so upstream's Pinned/
//   Time/Search section icons aren't shown.
// - `ChatHistoryToolbar` has no `autofocus` arg; upstream's
//   `searchAttributes` use camelCase keys here (`labelText`, ...).
// - Upstream's `Delete` action carries a TrashCan icon from story data;
//   `ChatHistoryItemAction` icons are components, so the same icon is
//   passed as a component.

type Chat = {
  id: string;
  name: string;
  lastUpdated: string;
  selected?: boolean;
  renameInvalid?: boolean;
  renameInvalidMessage?: string;
};

type Section = { section: string; chats: Chat[] };

const HISTORY_ITEM_ACTIONS: ChatHistoryItemAction[] = [
  { text: 'Pin to top' },
  { text: 'Rename' },
  { text: 'Delete', delete: true, divider: true, icon: TrashCan },
];

const PINNED_HISTORY_ITEM_ACTIONS: ChatHistoryItemAction[] = [
  { text: 'Unpin' },
  { text: 'Rename' },
  { text: 'Delete', delete: true, divider: true, icon: TrashCan },
];

const NAMES = [
  "Here's the onboarding doc that includes all the information to get started.",
  "Let's use this as the master invoice document.",
  'Noticed some discrepancies between these two files.',
];

const PINNED_HISTORY_ITEMS: Chat[] = [
  { id: 'pinned-0', name: NAMES[0]!, lastUpdated: 'Feb 10, 6:30 PM' },
  {
    id: 'pinned-1',
    name: NAMES[1]!,
    selected: true,
    lastUpdated: 'Feb 10, 5:45 PM',
  },
  { id: 'pinned-2', name: NAMES[2]!, lastUpdated: 'Feb 10, 4:20 PM' },
  {
    id: 'pinned-3',
    name: 'Do we need a PO number on every documentation here?',
    lastUpdated: 'Feb 10, 3:10 PM',
  },
];

const HISTORY_ITEMS: Section[] = [
  {
    section: 'Today',
    chats: [
      { id: 'today-0', name: NAMES[0]!, lastUpdated: 'Feb 10, 6:30 PM' },
      { id: 'today-1', name: NAMES[1]!, lastUpdated: 'Feb 10, 5:45 PM' },
      { id: 'today-2', name: NAMES[2]!, lastUpdated: 'Feb 10, 4:20 PM' },
      {
        id: 'today-3',
        name: 'Do we need a PO number on every documentation here?',
        lastUpdated: 'Feb 10, 3:10 PM',
      },
    ],
  },
  {
    section: 'Yesterday',
    chats: [
      { id: 'yesterday-0', name: NAMES[0]!, lastUpdated: 'Feb 9, 8:15 PM' },
      { id: 'yesterday-1', name: NAMES[1]!, lastUpdated: 'Feb 9, 6:30 PM' },
      { id: 'yesterday-2', name: NAMES[2]!, lastUpdated: 'Feb 9, 4:45 PM' },
      {
        id: 'yesterday-3',
        name: "Let's troubleshoot this.",
        lastUpdated: 'Feb 9, 2:20 PM',
      },
    ],
  },
  {
    section: 'Previous 7 days',
    chats: [
      { id: 'previous-0', name: NAMES[0]!, lastUpdated: 'Feb 5, 7:00 PM' },
      { id: 'previous-1', name: NAMES[1]!, lastUpdated: 'Feb 4, 4:30 PM' },
      { id: 'previous-2', name: NAMES[2]!, lastUpdated: 'Feb 4, 2:15 PM' },
      {
        id: 'previous-3',
        name: "Let's troubleshoot this.",
        lastUpdated: 'Feb 3, 11:45 AM',
      },
    ],
  },
];

const SEARCH_RESULTS = [
  ...NAMES,
  'Do we need a PO number on every documentation here?',
];

const SEARCH_ATTRIBUTES = {
  labelText: 'Search',
  placeholder: 'Search',
  closeButtonLabelText: 'Clear search',
};

// The docs-app demo's actions.
const ITEM_ACTIONS: ChatHistoryItemAction[] = [
  { text: 'Rename', icon: Edit },
  { text: 'Delete', icon: TrashCan, delete: true, divider: true },
];

const updateChat = (chats: Chat[], id: string, change: Partial<Chat>) =>
  chats.map((chat) => (chat.id === id ? { ...chat, ...change } : chat));

const sectionFor = (timestamp: number) => {
  const today = new Date('Feb 10, 7:30 PM').setHours(0, 0, 0, 0);
  const yesterday = today - 24 * 60 * 60 * 1000;
  if (timestamp > today) return 'Today';
  if (timestamp > yesterday) return 'Yesterday';
  return 'Previous 7 days';
};

type DemoSignature = {
  Args: {
    headerTitle?: string;
    searchOff?: boolean;
    overflowMenuLabel?: string;
    showCloseAction?: boolean;
    showActions?: boolean;
    onSelect?: (itemId: string) => void;
  };
};

/** Ember counterpart of upstream's `cds-aichat-history-demo` element. */
class ChatHistoryDemo extends Component<DemoSignature> {
  @tracked pinnedItems: Chat[] = PINNED_HISTORY_ITEMS;
  @tracked regularItems: Section[] = HISTORY_ITEMS;
  @tracked selectedId?: string = 'pinned-1';
  @tracked renamingId?: string;
  @tracked itemToDelete?: string;
  @tracked searchValue = '';

  pinnedActions = PINNED_HISTORY_ITEM_ACTIONS;
  historyActions = HISTORY_ITEM_ACTIONS;

  get allChats() {
    return [
      ...this.pinnedItems,
      ...this.regularItems.flatMap((section) => section.chats),
    ];
  }

  get searchResults() {
    return this.allChats.filter((chat) =>
      chat.name.toLowerCase().includes(this.searchValue),
    );
  }

  get searchTotalCount() {
    return this.searchValue ? this.searchResults.length : '';
  }

  get visibleSections() {
    return this.regularItems.filter((section) => section.chats.length > 0);
  }

  mapChats(change: (chats: Chat[]) => Chat[]) {
    this.pinnedItems = change(this.pinnedItems);
    this.regularItems = this.regularItems.map((section) => ({
      ...section,
      chats: change(section.chats),
    }));
  }

  search = (value: string) => {
    this.searchValue = value.toLowerCase();
  };

  select = (detail: { itemId?: string }) => {
    this.selectedId = detail.itemId;
    if (detail.itemId) this.args.onSelect?.(detail.itemId);
  };

  handleMenuAction = (detail: { action?: string; itemId?: string }) => {
    const { itemId } = detail;
    if (!itemId) return;
    switch (detail.action) {
      case 'Delete':
        this.itemToDelete = itemId;
        break;
      case 'Rename':
        this.renamingId = itemId;
        break;
      case 'Pin to top':
        this.pin(itemId);
        break;
      case 'Unpin':
        this.unpin(itemId);
        break;
    }
  };

  pin(itemId: string) {
    const chat = this.regularItems
      .flatMap((section) => section.chats)
      .find((c) => c.id === itemId);
    if (!chat) return;
    this.regularItems = this.regularItems.map((section) => ({
      ...section,
      chats: section.chats.filter((c) => c.id !== itemId),
    }));
    this.pinnedItems = [chat, ...this.pinnedItems];
  }

  unpin(itemId: string) {
    const chat = this.pinnedItems.find((c) => c.id === itemId);
    if (!chat) return;
    this.pinnedItems = this.pinnedItems.filter((c) => c.id !== itemId);
    const timestamp = Date.parse(chat.lastUpdated);
    const target = sectionFor(timestamp);
    this.regularItems = this.regularItems.map((section) => {
      if (section.section !== target) return section;
      const index = section.chats.findIndex(
        (c) => timestamp >= Date.parse(c.lastUpdated),
      );
      const chats = [...section.chats];
      chats.splice(index === -1 ? chats.length : index, 0, chat);
      return { ...section, chats };
    });
  }

  renameChange = (itemId: string, value: string) => {
    const invalid = value.length > 75;
    this.mapChats((chats) =>
      updateChat(chats, itemId, {
        renameInvalid: invalid,
        renameInvalidMessage: invalid
          ? 'Title cannot exceed 75 characters.'
          : '',
      }),
    );
  };

  renameSave = (itemId: string, name: string) => {
    this.mapChats((chats) => updateChat(chats, itemId, { name }));
    this.renamingId = undefined;
  };

  renameCancel = () => {
    this.renamingId = undefined;
  };

  cancelDelete = () => {
    this.itemToDelete = undefined;
  };

  confirmDelete = () => {
    const id = this.itemToDelete;
    this.mapChats((chats) => chats.filter((chat) => chat.id !== id));
    this.itemToDelete = undefined;
  };

  <template>
    <ChatHistory>
      <:header>
        <ChatHistoryHeader
          @headerTitle={{@headerTitle}}
          @showCloseAction={{@showCloseAction}}
        />
      </:header>
      <:toolbar>
        <ChatHistoryToolbar
          @searchOff={{@searchOff}}
          @searchAttributes={{SEARCH_ATTRIBUTES}}
          @onSearch={{this.search}}
        />
      </:toolbar>
      <:content>
        <ChatHistoryContent
          @resultsLabel="Results"
          @resultsCount={{this.searchTotalCount}}
        >
          <ChatHistoryPanel
            @showActions={{@showActions}}
            aria-label="Chat history"
            as |Items|
          >
            <Items as |_Item Menu|>
              {{#if this.searchValue}}
                <Menu @title="Search results" @expanded={{true}}>
                  {{#each this.searchResults as |result|}}
                    <ChatHistorySearchItem
                      @id={{result.id}}
                      @name={{result.name}}
                      @date={{result.lastUpdated}}
                      @onSelect={{this.select}}
                    />
                  {{else}}
                    <ChatHistorySearchItem @disabled={{true}}>
                      No available chats
                    </ChatHistorySearchItem>
                  {{/each}}
                </Menu>
              {{else}}
                {{#if this.pinnedItems.length}}
                  <Menu @title="Pinned" as |Item|>
                    {{#each this.pinnedItems as |chat|}}
                      <Item
                        @id={{chat.id}}
                        @name={{chat.name}}
                        @selected={{eq chat.id this.selectedId}}
                        @rename={{eq chat.id this.renamingId}}
                        @renameInvalid={{chat.renameInvalid}}
                        @renameInvalidMessage={{chat.renameInvalidMessage}}
                        @overflowMenuLabel={{@overflowMenuLabel}}
                        @actions={{this.pinnedActions}}
                        @onSelect={{this.select}}
                        @onMenuAction={{this.handleMenuAction}}
                        @onRenameChange={{fn this.renameChange chat.id}}
                        @onRenameSave={{fn this.renameSave chat.id}}
                        @onRenameCancel={{this.renameCancel}}
                      />
                    {{/each}}
                  </Menu>
                {{/if}}
                {{#each this.visibleSections as |section|}}
                  <Menu @title={{section.section}} as |Item|>
                    {{#each section.chats as |chat|}}
                      <Item
                        @id={{chat.id}}
                        @name={{chat.name}}
                        @selected={{eq chat.id this.selectedId}}
                        @rename={{eq chat.id this.renamingId}}
                        @renameInvalid={{chat.renameInvalid}}
                        @renameInvalidMessage={{chat.renameInvalidMessage}}
                        @overflowMenuLabel={{@overflowMenuLabel}}
                        @actions={{this.historyActions}}
                        @onSelect={{this.select}}
                        @onMenuAction={{this.handleMenuAction}}
                        @onRenameChange={{fn this.renameChange chat.id}}
                        @onRenameSave={{fn this.renameSave chat.id}}
                        @onRenameCancel={{this.renameCancel}}
                      />
                    {{/each}}
                  </Menu>
                {{/each}}
              {{/if}}
            </Items>
          </ChatHistoryPanel>
        </ChatHistoryContent>
        {{#if this.itemToDelete}}
          <ChatHistoryDeletePanel
            @itemId={{this.itemToDelete}}
            @onCancel={{this.cancelDelete}}
            @onConfirm={{this.confirmDelete}}
          />
        {{/if}}
      </:content>
    </ChatHistory>
  </template>
}

type StoryArgs = DemoSignature['Args'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Chat history',
  component: ChatHistory,
  parameters: {
    docs: {
      description: {
        component: `\`ChatHistory\` is the entry-point shell for the chat history feature: a
\`header\`/\`toolbar\`/\`content\` block, assembled from \`ChatHistoryHeader\`,
\`ChatHistoryToolbar\`, \`ChatHistoryContent\` and \`ChatHistoryPanel\` (in turn
yielding \`ChatHistoryPanelItems\`, \`ChatHistoryPanelItem\` and
\`ChatHistoryPanelMenu\`). Renaming an item swaps it for a
\`ChatHistoryPanelItemInput\`; deleting one shows a \`ChatHistoryDeletePanel\`
overlay. \`ChatHistorySearchItem\` renders search results and
\`ChatHistoryLoading\` the loading state. Each has its own stories under
**AI Chat/Chat history**.`,
      },
    },
  },
  decorators: [
    (Story, context) => <template>
      <div style="block-size: 36rem; inline-size: 350px;">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  args: {
    headerTitle: 'Chats',
    searchOff: false,
    overflowMenuLabel: 'Options',
    showCloseAction: true,
    showActions: false,
    onSelect: spy(),
  },
  render: (args: StoryArgs) => <template>
    <ChatHistoryDemo
      @headerTitle={{args.headerTitle}}
      @searchOff={{args.searchOff}}
      @overflowMenuLabel={{args.overflowMenuLabel}}
      @showCloseAction={{args.showCloseAction}}
      @showActions={{args.showActions}}
      @onSelect={{args.onSelect}}
    />
  </template>,
});

export const Default = meta.story();

Default.test('selects a chat', async ({ canvas, userEvent, args }) => {
  const [, todayFirst] = canvas.getAllByRole('button', {
    name: NAMES[0],
  });
  await userEvent.click(todayFirst!);
  await expect(args.onSelect).toHaveBeenCalledWith('today-0');
});

Default.test('filters chats by search', async ({ canvas, userEvent }) => {
  await userEvent.type(canvas.getByRole('searchbox'), 'troubleshoot');
  await waitFor(() => expect(canvas.getByText('Search results')).toBeVisible());
  await expect(canvas.getAllByText("Let's troubleshoot this.")).toHaveLength(2);
});

export const SearchResults = meta.story({
  render: () => <template>
    <ChatHistory>
      <:header><ChatHistoryHeader @headerTitle="Chats" /></:header>
      <:toolbar><ChatHistoryToolbar /></:toolbar>
      <:content>
        <ChatHistoryContent @resultsLabel="Results" @resultsCount="4">
          <ChatHistoryPanel aria-label="Search results" as |Items|>
            <Items as |_Item Menu|>
              <Menu @title="Search results" @expanded={{true}}>
                {{#each SEARCH_RESULTS as |result|}}
                  <ChatHistorySearchItem @date="Monday, 12:04 PM">
                    {{result}}
                  </ChatHistorySearchItem>
                {{/each}}
              </Menu>
            </Items>
          </ChatHistoryPanel>
        </ChatHistoryContent>
      </:content>
    </ChatHistory>
  </template>,
});

export const Loading = meta.story({
  render: (args: StoryArgs) => <template>
    <ChatHistory>
      <:header><ChatHistoryHeader @headerTitle={{args.headerTitle}} /></:header>
      <:toolbar><ChatHistoryToolbar /></:toolbar>
      <:content>
        <ChatHistoryContent><ChatHistoryLoading /></ChatHistoryContent>
      </:content>
    </ChatHistory>
  </template>,
});

export const EmptyState = meta.story({
  render: (args: StoryArgs) => <template>
    <ChatHistory>
      <:header><ChatHistoryHeader @headerTitle={{args.headerTitle}} /></:header>
      <:toolbar><ChatHistoryToolbar /></:toolbar>
      <:content><ChatHistoryContent /></:content>
    </ChatHistory>
  </template>,
});

export const DeleteFlow = meta.story({
  render: (args: StoryArgs) => <template>
    <ChatHistory>
      <:header><ChatHistoryHeader @headerTitle={{args.headerTitle}} /></:header>
      <:toolbar><ChatHistoryToolbar /></:toolbar>
      <:content>
        <ChatHistoryContent>
          <ChatHistoryPanel as |Items|>
            <Items as |_Item Menu|>
              <Menu @title="Pinned" @expanded={{true}} as |Item|>
                {{#each PINNED_HISTORY_ITEMS as |chat|}}
                  <Item
                    @id={{chat.id}}
                    @name={{chat.name}}
                    @selected={{chat.selected}}
                    @actions={{PINNED_HISTORY_ITEM_ACTIONS}}
                  />
                {{/each}}
              </Menu>
              {{#each HISTORY_ITEMS as |section|}}
                <Menu @title={{section.section}} @expanded={{true}} as |Item|>
                  {{#each section.chats as |chat|}}
                    <Item
                      @id={{chat.id}}
                      @name={{chat.name}}
                      @actions={{HISTORY_ITEM_ACTIONS}}
                    />
                  {{/each}}
                </Menu>
              {{/each}}
            </Items>
          </ChatHistoryPanel>
        </ChatHistoryContent>
        <ChatHistoryDeletePanel @itemId="today-0" />
      </:content>
    </ChatHistory>
  </template>,
});

/** The docs-app `ChatHistory` page's demo: rename, delete and new chat. */
class RenameAndDeleteDemo extends Component {
  @tracked chats = [
    { id: '1', name: 'Trip planning' },
    { id: '2', name: 'Recipe ideas' },
    { id: '3', name: 'Budget review' },
  ];
  @tracked selectedId = '1';
  @tracked renamingId?: string;
  @tracked deletingId?: string;

  itemActions = ITEM_ACTIONS;

  select = (detail: { itemId?: string }) => {
    if (detail.itemId) this.selectedId = detail.itemId;
  };

  handleMenuAction = (detail: { action?: string; itemId?: string }) => {
    if (detail.action === 'Rename') {
      this.renamingId = detail.itemId;
    } else if (detail.action === 'Delete') {
      this.deletingId = detail.itemId;
    }
  };

  saveRename = (itemId: string, newName: string) => {
    this.chats = this.chats.map((chat) =>
      chat.id === itemId ? { ...chat, name: newName } : chat,
    );
    this.renamingId = undefined;
  };

  cancelRename = () => {
    this.renamingId = undefined;
  };

  confirmDelete = (detail: { itemId?: string }) => {
    this.chats = this.chats.filter((chat) => chat.id !== detail.itemId);
    this.deletingId = undefined;
  };

  cancelDelete = () => {
    this.deletingId = undefined;
  };

  newChat = () => {
    const id = String(Date.now());
    this.chats = [{ id, name: 'New chat' }, ...this.chats];
    this.selectedId = id;
  };

  <template>
    <ChatHistory>
      <:header>
        <ChatHistoryHeader @headerTitle="Chats" />
      </:header>
      <:toolbar>
        <ChatHistoryToolbar @onNewChat={{this.newChat}} />
      </:toolbar>
      <:content>
        <ChatHistoryContent @resultsCount={{this.chats.length}}>
          <ChatHistoryPanel as |Items|>
            <Items as |Item|>
              {{#each this.chats as |chat|}}
                <Item
                  @id={{chat.id}}
                  @name={{chat.name}}
                  @selected={{eq chat.id this.selectedId}}
                  @rename={{eq chat.id this.renamingId}}
                  @actions={{this.itemActions}}
                  @onSelect={{this.select}}
                  @onMenuAction={{this.handleMenuAction}}
                  @onRenameSave={{fn this.saveRename chat.id}}
                  @onRenameCancel={{this.cancelRename}}
                />
              {{/each}}
            </Items>
          </ChatHistoryPanel>
        </ChatHistoryContent>
        {{#if this.deletingId}}
          <ChatHistoryDeletePanel
            @itemId={{this.deletingId}}
            @onCancel={{this.cancelDelete}}
            @onConfirm={{this.confirmDelete}}
          />
        {{/if}}
      </:content>
    </ChatHistory>
  </template>
}

export const RenameAndDelete = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A flat list wired for selection, rename (via the overflow menu), delete (via the `ChatHistoryDeletePanel` overlay) and new chat.',
      },
    },
  },
  render: () => <template><RenameAndDeleteDemo /></template>,
});

RenameAndDelete.test(
  'renames and deletes a chat through the overflow menu',
  async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const openMenuFor = async (index: number) => {
      const triggers = canvasElement.querySelectorAll<HTMLElement>(
        '.cds-aichat-history-panel-item__actions .cds--overflow-menu',
      );
      await userEvent.click(triggers[index]!);
    };

    await openMenuFor(1);
    await userEvent.click(await body.findByText('Rename'));
    const input = await canvas.findByDisplayValue('Recipe ideas');
    // The input focuses and selects itself on the next animation frame.
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.clear(input);
    await userEvent.type(input, 'Dinner ideas{Enter}');
    await expect(
      await canvas.findByRole('button', { name: 'Dinner ideas' }),
    ).toBeVisible();

    await openMenuFor(2);
    await userEvent.click(await body.findByText('Delete'));
    await userEvent.click(
      await canvas.findByRole('button', { name: /Delete/ }),
    );
    await waitFor(() =>
      expect(canvas.queryByText('Budget review')).not.toBeInTheDocument(),
    );
  },
);
