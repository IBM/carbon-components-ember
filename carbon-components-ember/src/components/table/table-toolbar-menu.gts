/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import OverflowMenu from '../overflow-menu.gts';
import Settings from '../icons/settings.ts';
import TableToolbarAction from './table-toolbar-action.gts';
import type { OverflowMenuSignature } from '../overflow-menu.gts';
import type { TableToolbarSignature } from './table-toolbar.gts';

export interface TableToolbarMenuSignature {
  Element: OverflowMenuSignature['Element'];
  Args: Omit<OverflowMenuSignature['Args'], 'flipped'> & {
    /** Lines the menu's end edge up with the trigger's. Defaults to `true`. */
    flipped?: boolean;
    /**
     * The size of the `TableToolbar` it is in, used without `@size`. Set by
     * the `TableToolbarContent` that yields it.
     */
    toolbarSize?: TableToolbarSignature['Args']['size'];
  };
  Blocks: {
    /** The menu's actions. */
    default: [
      TableToolbarAction: WithBoundArgs<typeof TableToolbarAction, 'item'>,
    ];
  };
}

/**
 * A menu of actions in a `TableToolbar`, as Carbon React's `TableToolbarMenu`:
 * an overflow menu with a settings icon. Its actions are `TableToolbarAction`s.
 */
export default class TableToolbarMenu extends Component<TableToolbarMenuSignature> {
  get flipped() {
    return this.args.flipped ?? true;
  }

  get size() {
    return this.args.size ?? this.args.toolbarSize;
  }

  get iconDescription() {
    return this.args.iconDescription ?? 'Settings';
  }

  <template>
    <OverflowMenu
      @align={{@align}}
      @ariaLabel={{@ariaLabel}}
      @autoAlign={{@autoAlign}}
      @closeOnActivation={{@closeOnActivation}}
      @defaultOpen={{@defaultOpen}}
      @direction={{@direction}}
      @disabled={{@disabled}}
      @dropShadow={{@dropShadow}}
      @enterDelayMs={{@enterDelayMs}}
      @flipped={{this.flipped}}
      @highContrast={{@highContrast}}
      @iconClass={{@iconClass}}
      @iconDescription={{this.iconDescription}}
      @leaveDelayMs={{@leaveDelayMs}}
      @menuOffset={{@menuOffset}}
      @menuOffsetFlip={{@menuOffsetFlip}}
      @menuOptionsClass="cds--toolbar-action__menu
        {{if @menuOptionsClass @menuOptionsClass}}"
      @onClose={{@onClose}}
      @onOpen={{@onOpen}}
      @open={{@open}}
      @renderIcon={{if @renderIcon @renderIcon Settings}}
      @selectorPrimaryFocus={{@selectorPrimaryFocus}}
      @size={{this.size}}
      @wrapperClasses={{@wrapperClasses}}
      class="cds--toolbar-action"
      ...attributes
      as |Item|
    >
      {{~yield (component TableToolbarAction item=Item)~}}
    </OverflowMenu>
  </template>
}
