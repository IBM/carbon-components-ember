/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import Link from './-link.gts';
import type { LinkSignature } from './-link.gts';
import SideNavIcon from './side-nav-icon.gts';
import SideNavItem from './side-nav-item.gts';
import SideNavLinkText from './side-nav-link-text.gts';
import { isCurrentRoute } from '../-private/router-link.gts';
import type { IconComponent } from '../icon.gts';
import type { SideNavState } from './side-nav-items.gts';

export interface SideNavLinkSignature {
  Element: LinkSignature['Element'];
  Args: LinkSignature['Args'] & {
    /**
     * Marks it as the current page, with `aria-current="page"`, as does a
     * link to the current route.
     */
    isActive?: boolean;
    /**
     * Whether the side nav is open, in place of the `SideNav`'s: while it's
     * closed, the link leaves the tab order.
     */
    isSideNavExpanded?: boolean;
    /** Makes it taller, for a label that wraps. */
    large?: boolean;
    /** An icon before the label. */
    renderIcon?: IconComponent;
    sideNav?: SideNavState;
  };
  Blocks: {
    default: [];
  };
}

/** A link in `SideNavItems`. */
export default class SideNavLink extends Component<SideNavLinkSignature> {
  get isActive() {
    return (
      Boolean(this.args.isActive) || isCurrentRoute(getOwner(this)!, this.args)
    );
  }

  get tabindex() {
    const { isSideNavExpanded, sideNav } = this.args;
    const expanded = isSideNavExpanded ?? sideNav?.isSideNavExpanded;
    return !expanded && !sideNav?.isRail ? '-1' : '0';
  }

  <template>
    <SideNavItem @large={{@large}}>
      <Link
        @as={{@as}}
        @href={{@href}}
        @route={{@route}}
        @externalRoute={{@externalRoute}}
        @models={{@models}}
        @query={{@query}}
        aria-current={{if this.isActive "page"}}
        tabindex={{this.tabindex}}
        ...attributes
        class="cds--side-nav__link
          {{if this.isActive 'cds--side-nav__link--current'}}"
      >
        {{#if @renderIcon}}
          <SideNavIcon @small={{true}}>
            <@renderIcon />
          </SideNavIcon>
        {{/if}}
        <SideNavLinkText>{{yield}}</SideNavLinkText>
      </Link>
    </SideNavItem>
  </template>
}
