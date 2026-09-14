/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { modifier as eModifier } from 'ember-modifier';
import { default as or } from 'ember-truth-helpers/helpers/or';
import type { ComponentLike } from '@glint/template';
import OverflowMenu from '../overflow-menu.gts';
import OverflowMenuItem from '../overflow-menu/item.gts';
import ChatHistoryPanelItemInput from './chat-history-panel-item-input.gts';
import { OverflowMenuVertical } from '../../icons.ts';

export type ChatHistoryItemAction = {
  text: string;
  icon?: ComponentLike<{ Args: { size?: number } }>;
  /** Renders as a destructive option in the overflow menu. */
  delete?: boolean;
  /** Renders a divider above this item in the overflow menu. */
  divider?: boolean;
};

export type Args = {
  /** `true` if this item is the currently-selected chat. */
  selected?: boolean;
  /** Id of this chat history item, threaded through to every callback. */
  id?: string;
  name?: string;
  /**
   * `true` to enter rename mode (swaps to a `ChatHistoryPanelItemInput`).
   * Upstream's own `history-panel-item.ts` mutates its own `rename` field
   * back to `false` directly once a rename is saved/canceled, rather than
   * treating it as a value the host exclusively owns (a looser convention
   * common in plain web components, not a strict controlled/uncontrolled
   * split) - this port matches that: a local save/cancel always exits
   * rename mode immediately (without waiting for `@rename` to change),
   * while `@onRenameSave`/`@onRenameCancel` still fire so a host can keep
   * its own state in sync. `@rename` itself is mirrored in both
   * directions by `watchRename` below, so a host resetting `@rename` back
   * to `false` (e.g. because it switched to renaming a *different* item)
   * also closes this item's rename UI.
   */
  rename?: boolean;
  actions?: ChatHistoryItemAction[];
  /** Defaults to `'Options'`. */
  overflowMenuLabel?: string;
  /** `true` to always show the overflow-actions menu (usually bound from `ChatHistoryPanel`/`ChatHistoryPanelItems`). */
  showActions?: boolean;
  renameInvalid?: boolean;
  renameInvalidMessage?: string;
  /**
   * `true` if this item's parent `ChatHistoryPanelMenu` group is expanded
   * (or if it has no parent group). Controls whether the overflow menu is
   * even reachable while collapsed - bound down from `ChatHistoryPanelMenu`.
   * Defaults to `true`.
   */
  parentMenuExpanded?: boolean;
  onSelect?: (detail: { itemId?: string; itemName?: string }) => void;
  onRenameChange?: (value: string) => void;
  onRenameCancel?: () => void;
  onRenameSave?: (newName: string) => void;
  /**
   * Upstream's own `Action` type declares a per-action `onClick`, but its
   * actual render() wires every `cds-overflow-menu-item` to one shared
   * handler that dispatches a single `history-item-menu-action` event
   * with the action's text - `action.onClick` is never actually invoked
   * (matches this port's "match behavior over intent" principle
   * elsewhere). This port omits `onClick` from `ChatHistoryItemAction`
   * entirely rather than accepting-and-ignoring it, and exposes the real
   * behavior as a single `@onMenuAction` callback instead.
   */
  onMenuAction?: (detail: { action?: string; itemId?: string; itemName?: string }) => void;
};

export interface ChatHistoryPanelItemSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * A single chat history entry: a selectable row with a name and an
 * overflow-actions menu, or (when `@rename` is set) a
 * `ChatHistoryPanelItem` swapped for a `ChatHistoryPanelItemInput`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-panel-item`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 *
 * Two deliberate structural departures from upstream's DOM, both
 * documented here rather than reproduced faithfully:
 * - Upstream nests its `cds-overflow-menu` trigger *inside* the same
 *   `<button>` that selects the item, and needs an explicit
 *   `composedPath()`-based click guard (`_handleClick`'s
 *   `isOverflowMenuClick` check) to stop a menu-trigger click from also
 *   selecting the row. This port's `OverflowMenu` (built on
 *   `ember-basic-dropdown`) already renders its trigger as a sibling, not
 *   a descendant, of the row button - both to avoid invalid nested
 *   interactive-content HTML, and because it makes the guard unnecessary:
 *   a click on the trigger never bubbles through the row button at all.
 * - Upstream's `OverflowMenuVertical16`-triggered menu doesn't support
 *   flipping to open upward when there isn't room below (its own
 *   `_adjustMenuPosition` is a documented workaround for that gap). This
 *   addon's `OverflowMenu` is built on `ember-basic-dropdown`, whose
 *   `verticalPosition` already defaults to `'auto'` (flips automatically
 *   based on available *viewport* space) - so the workaround isn't
 *   ported. The one real divergence: upstream flips relative to the
 *   nearest `cds-aichat-history-content` ancestor's bounds, not the
 *   viewport, so in a history panel shorter than the viewport the menu
 *   can still open downward and overflow the panel while fitting the
 *   viewport just fine.
 * - Upstream's host also listens for `Enter` at the keydown level and
 *   re-dispatches its click handler (with `preventDefault()` first, so
 *   the button's own native Enter-triggered click doesn't double-fire).
 *   This port's row is a real `<button>`, which already activates via
 *   Enter/Space natively - no separate keydown handling is needed to get
 *   the same end-user behavior.
 * - Upstream's overflow menu supports Arrow Up/Down cycling between menu
 *   items (`_handleMenuItemKeyDown`) - not ported; `OverflowMenu` doesn't
 *   provide it, and it's a keyboard enhancement rather than core
 *   functionality (Tab still reaches every item).
 */
export default class ChatHistoryPanelItem extends Component<ChatHistoryPanelItemSignature> {
  @tracked internalRename = this.args.rename ?? false;

  get rename() {
    return this.internalRename;
  }

  get parentMenuExpanded() {
    return this.args.parentMenuExpanded ?? true;
  }

  // Mirrors `@rename` onto `internalRename` on every change (in both
  // directions), so a host resetting `@rename` back to `false` - e.g.
  // because it switched to renaming a different item - closes this
  // item's rename UI too. A local save/cancel still exits immediately
  // without waiting for a matching `@rename` change, see the class doc
  // above.
  watchRename = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [boolean | undefined] };
  }>((_element, [rename]) => {
    this.internalRename = Boolean(rename);
  });

  @action
  handleClick() {
    this.args.onSelect?.({ itemId: this.args.id, itemName: this.args.name });
  }

  @action
  handleRenameChange(value: string) {
    this.args.onRenameChange?.(value);
  }

  @action
  handleRenameCancel() {
    this.internalRename = false;
    this.args.onRenameCancel?.();
  }

  @action
  handleRenameSave(newName: string) {
    this.internalRename = false;
    this.args.onRenameSave?.(newName);
  }

  @action
  handleMenuAction(actionText: string | undefined) {
    this.args.onMenuAction?.({ action: actionText, itemId: this.args.id, itemName: this.args.name });
  }

  <template>
    <div
      class='cds-aichat-history-panel-item {{if this.rename "cds-aichat-history-panel-item--rename"}}'
      data-selected={{if @selected ''}}
      data-parent-menu-expanded={{if this.parentMenuExpanded ''}}
      {{this.watchRename @rename}}
      ...attributes
    >
      {{#if this.rename}}
        <ChatHistoryPanelItemInput
          @value={{@name}}
          @itemId={{@id}}
          @invalid={{@renameInvalid}}
          @invalidMessage={{@renameInvalidMessage}}
          @onChange={{this.handleRenameChange}}
          @onCancel={{this.handleRenameCancel}}
          @onSave={{this.handleRenameSave}}
        />
      {{else}}
        <button
          type='button'
          class='cds--side-nav__link {{if @selected "cds--side-nav__link--current"}}'
          {{on 'click' this.handleClick}}
        >
          <span class='cds--side-nav__link-text'>{{@name}}</span>
        </button>
        <span
          class='cds-aichat-history-panel-item__actions
            {{if @showActions "cds-aichat-history-panel-item__actions--always-show"}}'
        >
          <OverflowMenu @direction='bottom' @tooltip={{or @overflowMenuLabel 'Options'}} @icon={{OverflowMenuVertical}}>
            {{#each @actions as |menuAction|}}
              <OverflowMenuItem
                @itemText={{menuAction.text}}
                @isDelete={{menuAction.delete}}
                @hasDivider={{menuAction.divider}}
                @onClick={{fn this.handleMenuAction menuAction.text}}
              >
                {{#if menuAction.icon}}
                  <menuAction.icon @size={{16}} />
                {{/if}}
              </OverflowMenuItem>
            {{/each}}
          </OverflowMenu>
        </span>
      {{/if}}
    </div>
  </template>
}
