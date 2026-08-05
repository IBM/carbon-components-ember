/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import MenuItem from './menu-item.gts';
import type Icon from '../icon.gts';

export interface MenuItemSelectableSignature {
  Element: HTMLLIElement;
  Args: {
    /**
     * A required label titling this option.
     */
    label: string;
    /**
     * Specify whether the option should be selected by default.
     */
    defaultSelected?: boolean;
    /**
     * Pass a bool to control the state of this option.
     */
    selected?: boolean;
    /**
     * Provide an optional function to be called when the selection state
     * changes.
     */
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    shortcut?: string;
    renderIcon?: typeof Icon;
  };
}

export default class MenuItemSelectable extends Component<MenuItemSelectableSignature> {
  @tracked uncontrolledChecked = this.args.defaultSelected ?? false;

  get checked() {
    return this.args.selected ?? this.uncontrolledChecked;
  }

  @action
  handleClick() {
    const next = !this.checked;
    this.uncontrolledChecked = next;
    this.args.onChange?.(next);
  }

  <template>
    <MenuItem
      @label={{@label}}
      @shortcut={{@shortcut}}
      @renderIcon={{@renderIcon}}
      @disabled={{@disabled}}
      @role='menuitemcheckbox'
      @ariaChecked={{this.checked}}
      @onClick={{this.handleClick}}
      class='cds--menu-item-selectable--selected'
      ...attributes
    />
  </template>
}
