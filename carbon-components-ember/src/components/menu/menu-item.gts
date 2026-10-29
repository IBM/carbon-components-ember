/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { afterRender } from '../../utils/after-render.ts';
import Checkmark from '../icons/checkmark.ts';
import CaretRight from '../icons/caret-right.ts';
import type { IconComponent } from '../icon.gts';
import type Menu from '../menu.gts';
import type { MenuItemFeatures } from '../menu.gts';
import type MenuItemRadioGroup from './menu-item-radio-group.gts';
import type MenuItemSelectable from './menu-item-selectable.gts';
import type { WithBoundArgs } from '@glint/template';
import { isActivationKey } from '../../utils/keyboard.ts';

export interface MenuItemSignature {
  Element: HTMLLIElement;
  Args: {
    /**
     * A required label titling the MenuItem. Rendered as its text content.
     */
    label: string;
    /** The menu the item is in: Menu yields the item bound to it. */
    menu: Menu;
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
    renderIcon?: IconComponent;
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
    /**
     * The items of its submenu, as Menu yields them, bound to the submenu.
     * The item's own text is `@label`.
     */
    default: [
      MenuItem: WithBoundArgs<typeof MenuItem, 'menu'>,
      MenuItemSelectable: WithBoundArgs<typeof MenuItemSelectable, 'menu'>,
      MenuItemRadioGroup: WithBoundArgs<typeof MenuItemRadioGroup, 'menu'>,
    ];
  };
}

export default class MenuItem
  extends Component<MenuItemSignature>
  implements MenuItemFeatures
{
  @tracked submenuOpen = false;
  @tracked liElement?: HTMLLIElement;

  guid = guidFor(this);

  get role() {
    return this.args.role ?? 'menuitem';
  }

  get hasIcon() {
    return !!this.args.renderIcon;
  }

  get isSelectable() {
    return this.role !== 'menuitem';
  }

  get hasAriaChecked() {
    return this.args.ariaChecked !== undefined;
  }

  // A submenu-parent item can't be individually disabled or marked danger,
  // matching React's `isDisabled = disabled && !hasChildren` /
  // `isDanger = kind === 'danger' && !hasChildren`.
  isDisabled = (hasChildren: boolean) => {
    return !!this.args.disabled && !hasChildren;
  };

  isDanger = (hasChildren: boolean) => {
    return this.args.kind === 'danger' && !hasChildren;
  };

  classesFor = (hasChildren: boolean) => {
    const classes = ['cds--menu-item'];
    if (this.isDisabled(hasChildren)) classes.push('cds--menu-item--disabled');
    if (this.isDanger(hasChildren)) classes.push('cds--menu-item--danger');
    return classes.join(' ');
  };

  registerWithMenu = modifier((element: HTMLLIElement) => {
    this.liElement = element;
    const { menu } = this.args;
    // Register after the render: it read the menu classes this changes.
    const cancel = afterRender(this, () => menu.registerItem(this));
    return () => {
      cancel();
      menu.unregisterItem(this);
    };
  });

  handleClick = (hasChildren: boolean, event: MouseEvent | KeyboardEvent) => {
    if (this.isDisabled(hasChildren)) return;
    if (hasChildren) {
      this.submenuOpen = true;
    } else {
      this.args.onClick?.(event);
    }
  };

  handleKeyDown = (hasChildren: boolean, event: KeyboardEvent) => {
    if (hasChildren && event.key === 'ArrowRight') {
      event.stopPropagation();
      event.preventDefault();
      this.submenuOpen = true;
      return;
    }
    if (isActivationKey(event)) {
      event.preventDefault();
      this.handleClick(hasChildren, event);
    }
  };

  closeSubmenu = () => {
    this.submenuOpen = false;
    this.liElement?.focus();
  };

  <template>
    {{#let (has-block) as |hasChildren|}}
      <li
        role={{this.role}}
        class={{this.classesFor hasChildren}}
        tabindex={{if @disabled "-1" "0"}}
        aria-disabled={{if (this.isDisabled hasChildren) "true"}}
        aria-haspopup={{if hasChildren "true"}}
        aria-expanded={{if hasChildren (if this.submenuOpen "true" "false")}}
        aria-checked={{if this.hasAriaChecked (if @ariaChecked "true" "false")}}
        title={{@label}}
        {{on "click" (fn this.handleClick hasChildren)}}
        {{on "keydown" (fn this.handleKeyDown hasChildren)}}
        {{this.registerWithMenu}}
        {{@menu.rovingFocus.item disabled=@disabled}}
        ...attributes
      >
        <div class="cds--menu-item__selection-icon">
          {{#if @ariaChecked}}
            <Checkmark />
          {{/if}}
        </div>
        <div class="cds--menu-item__icon">
          {{#if @renderIcon}}
            <@renderIcon />
          {{/if}}
        </div>
        <div class="cds--menu-item__label">{{@label}}</div>
        {{#if (this.isDanger hasChildren)}}
          {{#if @dangerDescription}}
            <span
              id="menu-item-danger-{{this.guid}}"
              class="cds--visually-hidden"
            >
              {{@dangerDescription}}
            </span>
          {{/if}}
        {{/if}}
        {{#unless hasChildren}}
          {{#if @shortcut}}
            <div class="cds--menu-item__shortcut">{{@shortcut}}</div>
          {{/if}}
        {{/unless}}
        {{#if hasChildren}}
          <div class="cds--menu-item__shortcut">
            <CaretRight />
          </div>
          <@menu.Submenu
            @label={{@label}}
            @open={{this.submenuOpen}}
            @isRoot={{false}}
            @anchor={{this.liElement}}
            @onClose={{this.closeSubmenu}}
            as |Item Selectable RadioGroup|
          >
            {{yield Item Selectable RadioGroup}}
          </@menu.Submenu>
        {{/if}}
      </li>
    {{/let}}
  </template>
}
