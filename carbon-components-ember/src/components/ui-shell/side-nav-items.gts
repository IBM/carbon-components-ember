/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import SideNavLink from './side-nav-link.gts';
import SideNavMenu from './side-nav-menu.gts';

/** What a side nav's links and menus follow, as Carbon React's SideNavContext. */
export interface SideNavState {
  isRail?: boolean;
  isSideNavExpanded?: boolean;
}

export interface SideNavItemsSignature {
  Element: HTMLUListElement;
  Args: {
    /**
     * Whether the side nav is open, for its links' tab order, in place of
     * the `SideNav`'s.
     */
    isSideNavExpanded?: boolean;
    sideNav?: SideNavState;
  };
  Blocks: {
    default: [
      SideNavLink: WithBoundArgs<typeof SideNavLink, 'sideNav'>,
      SideNavMenu: WithBoundArgs<typeof SideNavMenu, 'sideNav'>,
    ];
  };
}

/**
 * The `SideNav`'s list. It yields `SideNavLink` and `SideNavMenu`, which
 * leave the tab order while the side nav is closed; `SideNavDivider`,
 * `SideNavItem` and `HeaderSideNavItems` go in it too.
 */
export default class SideNavItems
  extends Component<SideNavItemsSignature>
  implements SideNavState
{
  get isRail() {
    return this.args.sideNav?.isRail;
  }

  get isSideNavExpanded() {
    return this.args.isSideNavExpanded ?? this.args.sideNav?.isSideNavExpanded;
  }

  <template>
    <ul ...attributes class="cds--side-nav__items">
      {{yield
        (component SideNavLink sideNav=this)
        (component SideNavMenu sideNav=this)
      }}
    </ul>
  </template>
}
