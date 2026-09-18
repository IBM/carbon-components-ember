/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { modifier } from 'ember-modifier';
import { eq } from 'ember-truth-helpers';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import Launcher from './launcher.gts';
import ChatShell from './chat-shell.gts';
import Processing from './processing.gts';
import PromptLine from './prompt-line.gts';
import PromptLineShell from './prompt-line-shell.gts';
import ChatHistory from './chat-history.gts';
import ChatHistoryHeader from './chat-history-header.gts';
import ChatHistoryToolbar from './chat-history-toolbar.gts';
import ChatHistoryContent from './chat-history-content.gts';
import ChatHistoryPanel from './chat-history-panel.gts';
import ChatHistoryDeletePanel from './chat-history-delete-panel.gts';
import Send from '../icons/send.ts';
import Close from '../icons/close.ts';
import RecentlyViewed from '../icons/recently-viewed.ts';
import { Edit, TrashCan } from '../../icons.ts';
import type { ChatHistoryItemAction } from './chat-history-panel-item.gts';
import type ChatSessionService from '../../services/ai-chat-session.ts';
import type { ChatSession } from '../../services/ai-chat-session.ts';

export type SessionShellHistoryItem = {
  id: string;
  name: string;
};

const HISTORY_ITEM_ACTIONS: ChatHistoryItemAction[] = [
  { text: 'Rename', icon: Edit },
  { text: 'Delete', icon: TrashCan, delete: true, divider: true },
];

export interface SessionShellSignature {
  Element: HTMLDivElement;
  Args: {
    /** Enables AI-specific theming on the launcher and shell. */
    aiEnabled?: boolean;
    /** Aria label for the closed launcher button. */
    closedLabel?: string;
    /** Aria label for the messages region. */
    messagesAriaLabel?: string;
    /**
     * Resolves which `ChatSession` this shell drives, via
     * `@service('carbon.ai-chat-session').for(instanceId)` - for isolating
     * several independent chat widgets on one page. Omit it for a
     * single-widget page (resolves to the default session, matching this
     * component's pre-multi-instance behavior).
     */
    instanceId?: string;
    /**
     * Host-supplied list of past chat history items, rendered by
     * `SessionShell`'s own default `<:history>` assembly (a `ChatHistory`
     * built from `ChatHistoryHeader`/`Toolbar`/`Content`/`Panel`) - pass a
     * `<:history>` block instead for full control. Host-owned rather than
     * tracked by `carbon.ai-chat-session` itself, matching upstream's own
     * division of responsibility (`HistoryService#loadHistory()`'s
     * `customLoadHistory` host callback, not a Redux store slice) - see
     * AGENTS.md.
     */
    historyItems?: SessionShellHistoryItem[];
    /** Id of the currently-selected history item. */
    selectedHistoryItemId?: string;
    onHistoryItemSelect?: (id: string) => void;
    onHistoryItemRename?: (id: string, name: string) => void;
    onHistoryItemDelete?: (id: string) => void;
  };
  Blocks: {
    /** Shell header content, shown only while open. */
    header: [];
    /**
     * History panel content. Overrides `SessionShell`'s own default
     * `ChatHistory` assembly entirely when passed - see `@historyItems`
     * and AGENTS.md's "Persistence and the `chat-history` integration"
     * section for the session-owned/host-owned split the default assembly
     * draws. This component only owns
     * `@service('carbon.ai-chat-session').for(@instanceId).showHistory`/
     * `toggleHistory`, the same "inject the service, pass args down, don't
     * prop-drill" boundary `ChatShell` itself already draws for every other
     * slot - a filler that needs the same session this shell drives must
     * resolve it with the same `@instanceId` this shell was given.
     */
    history: [];
    /** Workspace panel content. Left entirely to the caller - see `<:history>`. */
    workspace: [];
  };
}

/**
 * Top-level container that wires the `carbon.ai-chat-session` service (this
 * addon's Ember-native equivalent of `@carbon/ai-chat`'s React `AppShell` +
 * `services/`/`store/` orchestration layer) into the already-ported
 * presentational `ai-chat/*` components - `Launcher` while closed,
 * `ChatShell` + `PromptLineShell`/`PromptLine` + `Processing` while open.
 *
 * This is the intended injection point for `Launcher`/`ChatShell`/
 * `PromptLine`, which themselves stay exactly as ported (stateless/always-
 * controlled, per their own class docs) and receive session state purely
 * as args from here, matching AGENTS.md's "React context -> a service, or
 * the parent component instance yielded down to children" convention
 * rather than threading the service through every descendant individually.
 * `<:workspace>` is a deliberate exception - left entirely to the caller,
 * which injects the service itself if it needs a `carbon.ai-chat-session`
 * affordance. `<:history>` is *not* a pure passthrough: `SessionShell`
 * assembles a default `ai-chat/chat-history` panel from `@historyItems`
 * (host-owned data) plus the session's own `showHistory`/`toggleHistory`/
 * `restart` (session-owned chrome) unless a `<:history>` block overrides
 * it outright - see AGENTS.md's "Persistence and the `chat-history`
 * integration" section for why the split lands there.
 *
 * `carbon.ai-chat-session` is a registry keyed by an id (see
 * `ChatSessionService#for()`), not a single flat bag of state - this
 * component resolves its own `ChatSession` from `@instanceId` so several
 * `SessionShell`s on one page can drive fully independent conversations.
 *
 * See AGENTS.md's "Porting Carbon AI Chat" -> "Orchestration layer" section
 * for the full React -> Ember mapping and the scope this first pass cuts.
 */
export default class SessionShell extends Component<SessionShellSignature> {
  @service('carbon.ai-chat-session') declare sessions: ChatSessionService;

  get session(): ChatSession {
    return this.sessions.for(this.args.instanceId);
  }

  /**
   * Which history item (if any) is mid-rename or mid-delete-confirm.
   * Transient view state owned by `SessionShell` itself, not the
   * session - same category as `historyItems`' selection/name/id data
   * being host-owned but the *UI* of editing them being local (mirrors
   * the pre-existing `chat-history.gjs.md` docs demo's own
   * `renamingId`/`deletingId` tracked fields).
   */
  @tracked renamingId: string | null = null;
  @tracked deletingId: string | null = null;

  historyItemActions = HISTORY_ITEM_ACTIONS;

  // `renamingId`/`deletingId` live on `SessionShell` itself, which is never
  // remounted, while `ChatShell` only renders `<:history>` content (this
  // `ChatHistory` assembly included) while `showHistory` is true - so the
  // panel's own contents are destroyed/recreated on every open/close, but
  // without this modifier the two fields would silently survive the
  // round-trip and reopen straight into a stale rename/delete-confirm view.
  // Attached directly to the default `ChatHistory` assembly so it fires on
  // every path that can close the panel (the header's toggle button, the
  // shell's own close button, `newChat()`) without needing to intercept
  // each call site individually.
  resetHistoryEditState = modifier(() => {
    return () => {
      this.renamingId = null;
      this.deletingId = null;
    };
  });

  sendMessage = (): void => {
    this.session.send();
  };

  stopStreaming = (): void => {
    this.session.cancelStreaming();
  };

  get closedLabel(): string {
    return this.args.closedLabel ?? 'Open chat';
  }

  get messagesAriaLabel(): string {
    return this.args.messagesAriaLabel ?? 'Chat messages';
  }

  // Only ever invoked while the panel is showing (both call sites - the
  // header close button and `newChat()` below - only exist/act while
  // `session.showHistory` is already true), so `toggleHistory()` is
  // exactly "close it" here - and, unlike setting `showHistory` directly,
  // it also fires `emit('change:history', ...)` and persists the change,
  // consistent with every other session mutation.
  closeHistory = (): void => {
    this.session.toggleHistory();
  };

  @action
  newChat(): void {
    this.session.restart();
    this.closeHistory();
  }

  @action
  selectHistoryItem(detail: { itemId?: string }): void {
    if (detail.itemId) {
      this.args.onHistoryItemSelect?.(detail.itemId);
    }
  }

  @action
  handleHistoryMenuAction(detail: { action?: string; itemId?: string }): void {
    if (!detail.itemId) {
      return;
    }
    if (detail.action === 'Rename') {
      this.renamingId = detail.itemId;
    } else if (detail.action === 'Delete') {
      this.deletingId = detail.itemId;
    }
  }

  @action
  saveHistoryItemRename(itemId: string, newName: string): void {
    this.renamingId = null;
    this.args.onHistoryItemRename?.(itemId, newName);
  }

  @action
  cancelHistoryItemRename(): void {
    this.renamingId = null;
  }

  @action
  confirmHistoryItemDelete(detail: { itemId?: string }): void {
    this.deletingId = null;
    if (detail.itemId) {
      this.args.onHistoryItemDelete?.(detail.itemId);
    }
  }

  @action
  cancelHistoryItemDelete(): void {
    this.deletingId = null;
  }

  <template>
    <div ...attributes>
      {{#if this.session.open}}
        <ChatShell
          @aiEnabled={{@aiEnabled}}
          @showHistory={{this.session.showHistory}}
          @showWorkspace={{this.session.showWorkspace}}
          @messagesAriaLabel={{this.messagesAriaLabel}}
        >
          <:header>
            {{yield to='header'}}
            <Tooltip @label='Chat history' @autoAlign={{true}}>
              <Button
                @type={{undefined}}
                @ghost={{true}}
                @size='sm'
                @iconOnly={{true}}
                @onClick={{this.session.toggleHistory}}
                aria-label='Chat history'
              >
                <RecentlyViewed @size='16' />
              </Button>
            </Tooltip>
            <Tooltip @label='Close' @autoAlign={{true}}>
              <Button
                @type={{undefined}}
                @ghost={{true}}
                @size='sm'
                @iconOnly={{true}}
                @onClick={{this.session.toggleOpen}}
                aria-label='Close chat'
              >
                <Close @size='16' />
              </Button>
            </Tooltip>
          </:header>
          <:history>
            {{#if (has-block 'history')}}
              {{yield to='history'}}
            {{else}}
              <ChatHistory {{this.resetHistoryEditState}}>
                <:header>
                  <ChatHistoryHeader @showCloseAction={{true}} @onClose={{this.closeHistory}} />
                </:header>
                <:toolbar>
                  <ChatHistoryToolbar @onNewChat={{this.newChat}} />
                </:toolbar>
                <:content>
                  <ChatHistoryContent @resultsCount={{@historyItems.length}}>
                    <ChatHistoryPanel as |Items|>
                      <Items as |Item|>
                        {{#each @historyItems as |item|}}
                          <Item
                            @id={{item.id}}
                            @name={{item.name}}
                            @selected={{eq item.id @selectedHistoryItemId}}
                            @rename={{eq item.id this.renamingId}}
                            @actions={{this.historyItemActions}}
                            @onSelect={{this.selectHistoryItem}}
                            @onMenuAction={{this.handleHistoryMenuAction}}
                            @onRenameSave={{fn this.saveHistoryItemRename item.id}}
                            @onRenameCancel={{this.cancelHistoryItemRename}}
                          />
                        {{/each}}
                      </Items>
                    </ChatHistoryPanel>
                  </ChatHistoryContent>
                  {{! A sibling of ChatHistoryContent (not of ChatHistory) so it lands inside ChatHistory's own position:relative root - see the class doc above. }}
                  {{#if this.deletingId}}
                    <ChatHistoryDeletePanel
                      @itemId={{this.deletingId}}
                      @onCancel={{this.cancelHistoryItemDelete}}
                      @onConfirm={{this.confirmHistoryItemDelete}}
                    />
                  {{/if}}
                </:content>
              </ChatHistory>
            {{/if}}
          </:history>
          <:workspace>{{yield to='workspace'}}</:workspace>
          <:messages>
            {{#each this.session.messages key='id' as |message|}}
              <div
                class='cds-aichat-session-shell__message
                  cds-aichat-session-shell__message--{{message.role}}'
              >
                {{message.text}}
                {{#if message.cancelled}}
                  <span class='cds-aichat-session-shell__stopped-label'>(stopped)</span>
                {{/if}}
              </div>
            {{/each}}
            {{#if this.session.isStreaming}}
              <div class='cds-aichat-session-shell__streaming-actions'>
                <Processing />
                <Button
                  @type={{undefined}}
                  @ghost={{true}}
                  @size='sm'
                  @onClick={{this.stopStreaming}}
                >
                  Stop generating
                </Button>
              </div>
            {{/if}}
          </:messages>
          <:input>
            <div class='cds-aichat-session-shell__input'>
              <PromptLineShell @rounded={{true}} @disabled={{this.session.isReadonly}}>
                <:editor>
                  <PromptLine
                    @content={{this.session.draft}}
                    @placeholder='Type a message…'
                    @disabled={{this.session.isReadonly}}
                    @onChange={{this.session.setDraft}}
                    @onSendIntent={{this.session.send}}
                  />
                </:editor>
                <:sendControl>
                  <Tooltip @label='Send' @autoAlign={{true}}>
                    <Button
                      @type={{undefined}}
                      @ghost={{true}}
                      @size='sm'
                      @iconOnly={{true}}
                      @disabled={{this.session.isReadonly}}
                      @onClick={{this.sendMessage}}
                      aria-label='Send'
                    >
                      <Send @size='16' />
                    </Button>
                  </Tooltip>
                </:sendControl>
              </PromptLineShell>
            </div>
          </:input>
        </ChatShell>
      {{else}}
        <Launcher
          @aiEnabled={{@aiEnabled}}
          @closedLabel={{this.closedLabel}}
          @onToggle={{this.session.toggleOpen}}
        />
      {{/if}}
    </div>
  </template>
}
