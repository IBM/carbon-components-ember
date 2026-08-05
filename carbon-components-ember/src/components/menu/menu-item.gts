/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import Menu from '../menu.gts';
import Checkmark from '../icons/checkmark.ts';
import CaretRight from '../icons/caret-right.ts';
import type Icon from '../icon.gts';

export interface MenuItemSignature {
  Element: HTMLLIElement;
  Args: {
    /**
     * A required label titling the MenuItem. Rendered as its text content.
     */
    label: string;
    /**
     * Specify whether the MenuItem is disabled or not.
     */
    disabled?: boolean;
    /**
     * Specify the kind of the MenuItem.
     */
    kind?: 'default' | 'danger';
    /**
     * Specify the message read by screen readers for the danger menu item
     * variant.
     */
    dangerDescription?: string;
    /**
     * Provide an optional function to be called when the MenuItem is
     * clicked.
     */
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
    /**
     * A component used to render an icon.
     */
    renderIcon?: typeof Icon;
    /**
     * Provide a shortcut for the action of this MenuItem. Only rendered as
     * a hint; the shortcut itself is not registered.
     */
    shortcut?: string;
    /**
     * @internal Used by MenuItemSelectable/MenuItemRadioGroup.
     */
    role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
    /**
     * @internal Used by MenuItemSelectable/MenuItemRadioGroup.
     */
    ariaChecked?: boolean;
  };
  Blocks: {
    // A nested Menu (submenu) — props.children can't be used to specify
    // the label of the MenuItem itself, use @label instead.
    default: [];
  };
}

export default class MenuItem extends Component<MenuItemSignature> {
  @tracked submenuOpen = false;
  @tracked liElement?: HTMLLIElement;

  guid = guidFor(this);

  get role() {
    return this.args.role ?? 'menuitem';
  }

  get hasAriaChecked() {
    return this.args.ariaChecked !== undefined;
  }

  get classes() {
    const classes = ['cds--menu-item'];
    if (this.args.disabled) classes.push('cds--menu-item--disabled');
    if (this.args.kind === 'danger') classes.push('cds--menu-item--danger');
    return classes.join(' ');
  }

  @action
  setLiElement(element: HTMLLIElement) {
    this.liElement = element;
  }

  @action
  handleClick(hasChildren: boolean, event: MouseEvent | KeyboardEvent) {
    if (this.args.disabled) return;
    if (hasChildren) {
      this.submenuOpen = true;
    } else {
      this.args.onClick?.(event);
    }
  }

  @action
  handleKeyDown(hasChildren: boolean, event: KeyboardEvent) {
    if (hasChildren && event.key === 'ArrowRight') {
      event.stopPropagation();
      event.preventDefault();
      this.submenuOpen = true;
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(hasChildren, event);
    }
  }

  @action
  closeSubmenu() {
    this.submenuOpen = false;
    this.liElement?.focus();
  }

  <template>
    <li
      role={{this.role}}
      class={{this.classes}}
      tabindex={{if @disabled '-1' '0'}}
      aria-disabled={{if @disabled 'true'}}
      aria-haspopup={{if (has-block) 'true'}}
      aria-expanded={{if
        (has-block)
        (if this.submenuOpen 'true' 'false')
      }}
      aria-checked={{if
        this.hasAriaChecked
        (if @ariaChecked 'true' 'false')
      }}
      title={{@label}}
      {{on 'click' (fn this.handleClick (has-block))}}
      {{on 'keydown' (fn this.handleKeyDown (has-block))}}
      {{didInsert this.setLiElement}}
      ...attributes
    >
      <div class='cds--menu-item__selection-icon'>
        {{#if @ariaChecked}}
          <Checkmark />
        {{/if}}
      </div>
      <div class='cds--menu-item__icon'>
        {{#if @renderIcon}}
          <@renderIcon />
        {{/if}}
      </div>
      <div class='cds--menu-item__label'>{{@label}}</div>
      {{#if @dangerDescription}}
        <span id='menu-item-danger-{{this.guid}}' class='cds--visually-hidden'>
          {{@dangerDescription}}
        </span>
      {{/if}}
      {{#unless (has-block)}}
        {{#if @shortcut}}
          <div class='cds--menu-item__shortcut'>{{@shortcut}}</div>
        {{/if}}
      {{/unless}}
      {{#if (has-block)}}
        <div class='cds--menu-item__shortcut'>
          <CaretRight />
        </div>
        <Menu
          @label={{@label}}
          @open={{this.submenuOpen}}
          @isRoot={{false}}
          @anchor={{this.liElement}}
          @onClose={{this.closeSubmenu}}
        >
          {{yield}}
        </Menu>
      {{/if}}
    </li>
  </template>
}
