/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { ComponentLike, WithBoundArgs } from '@glint/template';
import ChevronDown from '../icons/chevron-down.ts';
import captureElement from '../../modifiers/capture-element.ts';
import { isActivationKey } from '../../utils/keyboard.ts';
import HeaderMenuItem from './header-menu-item.gts';

export interface HeaderMenuSignature {
  Element: HTMLLIElement;
  Args: {
    /** Labels the menu's button and its list, as Carbon React's `aria-label`. */
    ariaLabel?: string;
    /** Labels them by another element, as Carbon React's `aria-labelledby`. */
    ariaLabelledBy?: string;
    /**
     * Marks it as current. It's also current, while closed, when one of its
     * items is.
     */
    isActive?: boolean;
    /** The menu's label. */
    menuLinkName: string;
    /** A component rendered in place of the chevron. */
    renderMenuContent?: ComponentLike;
  };
  Blocks: {
    default: [HeaderMenuItem: WithBoundArgs<typeof HeaderMenuItem, 'menu'>];
  };
}

/** A menu of `HeaderMenuItem`s in `HeaderNavigation` or `HeaderSideNavItems`. */
export default class HeaderMenu extends Component<HeaderMenuSignature> {
  @tracked expanded = false;
  @tracked items: HeaderMenuItem[] = [];
  button?: HTMLElement;
  list?: HTMLElement;

  get isCurrent() {
    return (
      this.args.isActive ||
      (!this.expanded && this.items.some((item) => item.isActive))
    );
  }

  registerItem(item: HeaderMenuItem) {
    this.items = [...this.items, item];
  }

  unregisterItem(item: HeaderMenuItem) {
    this.items = this.items.filter((other) => other !== item);
  }

  setButton = (element: HTMLElement) => {
    this.button = element;
  };

  setList = (element: HTMLElement) => {
    this.list = element;
  };

  // A click on the button, not an item, stays on the page.
  toggle = (event: MouseEvent) => {
    if (!(event.target instanceof Node && this.list?.contains(event.target))) {
      event.preventDefault();
    }
    this.expanded = !this.expanded;
  };

  toggleOnKey = (event: KeyboardEvent) => {
    if (!isActivationKey(event)) return;
    event.stopPropagation();
    event.preventDefault();
    this.expanded = !this.expanded;
  };

  closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.expanded) return;
    event.stopPropagation();
    event.preventDefault();
    this.expanded = false;
    this.button?.focus();
  };

  closeOnBlur = (event: FocusEvent) => {
    if (!this.list?.contains(event.relatedTarget as Node | null)) {
      this.expanded = false;
    }
  };

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- as in Carbon React, the item handles its menu's clicks, Escape and focus }}
    <li
      ...attributes
      class="cds--header__submenu"
      {{on "keydown" this.closeOnEscape}}
      {{on "click" this.toggle}}
      {{on "focusout" this.closeOnBlur}}
    >
      <a
        aria-haspopup="menu"
        aria-expanded="{{if this.expanded 'true' 'false'}}"
        class="cds--header__menu-item cds--header__menu-title
          {{if this.isCurrent 'cds--header__menu-item--current'}}"
        href="#"
        tabindex="0"
        aria-label={{@ariaLabel}}
        aria-labelledby={{@ariaLabelledBy}}
        {{captureElement this.setButton}}
        {{on "keydown" this.toggleOnKey}}
      >
        {{@menuLinkName}}
        {{#if @renderMenuContent}}
          <@renderMenuContent />
        {{else}}
          <ChevronDown @svgClass="cds--header__menu-arrow" />
        {{/if}}
      </a>
      <ul
        aria-label={{@ariaLabel}}
        aria-labelledby={{@ariaLabelledBy}}
        class="cds--header__menu"
        {{captureElement this.setList}}
      >
        {{yield (component HeaderMenuItem menu=this)}}
      </ul>
    </li>
  </template>
}
