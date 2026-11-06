/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { WithBoundArgs } from '@glint/template';
import ChevronDown from '../icons/chevron-down.ts';
import SideNavIcon from './side-nav-icon.gts';
import SideNavMenuItem from './side-nav-menu-item.gts';
import type { IconComponent } from '../icon.gts';
import type { SideNavState } from './side-nav-items.gts';

export interface SideNavMenuSignature {
  Element: HTMLLIElement;
  Args: {
    /** Whether it starts open. */
    defaultExpanded?: boolean;
    /**
     * Marks it as current. It's also current, while closed, when one of its
     * items is.
     */
    isActive?: boolean;
    /**
     * Whether the side nav is open, in place of the `SideNav`'s: while it's
     * closed, the menu's button leaves the tab order.
     */
    isSideNavExpanded?: boolean;
    /** Makes it taller, for a title that wraps. */
    large?: boolean;
    /** An icon before the title. */
    renderIcon?: IconComponent;
    /** The tab index of the menu's button, in place of the one it follows. */
    tabIndex?: number;
    /** The menu's title. */
    title: string;
    sideNav?: SideNavState;
  };
  Blocks: {
    default: [SideNavMenuItem: WithBoundArgs<typeof SideNavMenuItem, 'menu'>];
  };
}

/** A menu of `SideNavMenuItem`s in `SideNavItems`. Escape closes it. */
export default class SideNavMenu extends Component<SideNavMenuSignature> {
  @tracked expandedState = this.args.defaultExpanded ?? false;
  @tracked items: SideNavMenuItem[] = [];

  get isSideNavExpanded() {
    return this.args.isSideNavExpanded ?? this.args.sideNav?.isSideNavExpanded;
  }

  // As in Carbon React, a rail's menus close while it's collapsed, and those
  // that were open open again when it expands.
  get isExpanded() {
    if (this.args.sideNav?.isRail && !this.isSideNavExpanded) return false;
    return this.expandedState;
  }

  get isCurrent() {
    return (
      this.args.isActive ||
      (!this.isExpanded && this.items.some((item) => item.isActive))
    );
  }

  get tabindex() {
    const { tabIndex, sideNav } = this.args;
    if (tabIndex !== undefined) return String(tabIndex);
    return !this.isSideNavExpanded && !sideNav?.isRail ? '-1' : '0';
  }

  registerItem(item: SideNavMenuItem) {
    this.items = [...this.items, item];
  }

  unregisterItem(item: SideNavMenuItem) {
    this.items = this.items.filter((other) => other !== item);
  }

  toggle = () => {
    this.expandedState = !this.isExpanded;
  };

  closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.expandedState = false;
  };

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- as in Carbon React, Escape anywhere in the menu closes it ~}}
    <li
      ...attributes
      class="cds--side-nav__item
        {{if this.isCurrent 'cds--side-nav__item--active'}}
        {{if @renderIcon 'cds--side-nav__item--icon'}}
        {{if @large 'cds--side-nav__item--large'}}"
      {{on "keydown" this.closeOnEscape}}
    >
      <button
        aria-expanded="{{if this.isExpanded 'true' 'false'}}"
        class="cds--side-nav__submenu"
        type="button"
        {{! eslint-disable-next-line ember/template-no-positive-tabindex -- the caller's @tabIndex, as Carbon React's tabIndex }}
        tabindex={{this.tabindex}}
        {{on "click" this.toggle}}
      >
        {{#if @renderIcon}}
          <SideNavIcon>
            <@renderIcon />
          </SideNavIcon>
        {{/if}}
        <span class="cds--side-nav__submenu-title">{{@title}}</span>
        <SideNavIcon @small={{true}} class="cds--side-nav__submenu-chevron">
          <ChevronDown @size={{20}} />
        </SideNavIcon>
      </button>
      <ul class="cds--side-nav__menu">
        {{~yield (component SideNavMenuItem menu=this)~}}
      </ul>
    </li>
  </template>
}
