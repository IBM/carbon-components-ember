<ThemeSwitcher />

# ChatHistory

`ChatHistory` is the entry-point shell for the chat history feature: a
`header`/`toolbar`/`content` block, assembled from
[`ChatHistoryHeader`](./chat-history-header.md),
[`ChatHistoryToolbar`](./chat-history-toolbar.md),
[`ChatHistoryContent`](./chat-history-content.md) and
[`ChatHistoryPanel`](./chat-history-panel.md) (in turn yielding
[`ChatHistoryPanelItems`](./chat-history-panel-items.md),
[`ChatHistoryPanelItem`](./chat-history-panel-item.md) and
[`ChatHistoryPanelMenu`](./chat-history-panel-menu.md)). Renaming an item
swaps it for a [`ChatHistoryPanelItemInput`](./chat-history-panel-item-input.md);
deleting one shows a [`ChatHistoryDeletePanel`](./chat-history-delete-panel.md)
overlay. See also [`ChatHistorySearchItem`](./chat-history-search-item.md) and
[`ChatHistoryLoading`](./chat-history-loading.md), not demoed on this page.

```gjs live preview
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { eq } from 'ember-truth-helpers';
import {
  ChatHistory,
  ChatHistoryHeader,
  ChatHistoryToolbar,
  ChatHistoryContent,
  ChatHistoryPanel,
  ChatHistoryDeletePanel,
} from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { Edit, TrashCan } from 'carbon-components-ember/icons';

const ITEM_ACTIONS = [
  { text: 'Rename', icon: Edit },
  { text: 'Delete', icon: TrashCan, delete: true, divider: true },
];

class ChatHistoryDemo extends Component {
  @tracked chats = [
    { id: '1', name: 'Trip planning' },
    { id: '2', name: 'Recipe ideas' },
    { id: '3', name: 'Budget review' },
  ];
  @tracked selectedId = '1';
  @tracked renamingId = null;
  @tracked deletingId = null;

  itemActions = ITEM_ACTIONS;

  @action
  select(detail) {
    this.selectedId = detail.itemId;
  }

  @action
  handleMenuAction(detail) {
    if (detail.action === 'Rename') {
      this.renamingId = detail.itemId;
    } else if (detail.action === 'Delete') {
      this.deletingId = detail.itemId;
    }
  }

  @action
  saveRename(itemId, newName) {
    this.chats = this.chats.map((chat) => (chat.id === itemId ? { ...chat, name: newName } : chat));
    this.renamingId = null;
  }

  @action
  cancelRename() {
    this.renamingId = null;
  }

  @action
  confirmDelete(detail) {
    this.chats = this.chats.filter((chat) => chat.id !== detail.itemId);
    this.deletingId = null;
  }

  @action
  cancelDelete() {
    this.deletingId = null;
  }

  @action
  newChat() {
    const id = String(Date.now());
    this.chats = [{ id, name: 'New chat' }, ...this.chats];
    this.selectedId = id;
  }

  <template>
    <ThemeSupport />
    <div style='max-inline-size: 20rem; block-size: 24rem; position: relative;'>
      <ChatHistory>
        <:header>
          <ChatHistoryHeader @headerTitle='Chats' />
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
        </:content>
      </ChatHistory>
      {{#if this.deletingId}}
        <ChatHistoryDeletePanel
          @itemId={{this.deletingId}}
          @onCancel={{this.cancelDelete}}
          @onConfirm={{this.confirmDelete}}
        />
      {{/if}}
    </div>
  </template>
}

<template><ChatHistoryDemo /></template>
```

## API Reference

<details>
<summary><h3>ChatHistory</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-history'
    @name='default'
  />
</template>
```
</details>
