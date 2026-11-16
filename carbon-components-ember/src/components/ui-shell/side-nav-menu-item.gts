/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { getOwner } from '@ember/owner';
import type Owner from '@ember/owner';
import Link from './-link.gts';
import type { LinkSignature } from './-link.gts';
import SideNavLinkText from './side-nav-link-text.gts';
import { isCurrentRoute } from '../-private/router-link.gts';
import { afterRender } from '../../utils/after-render.ts';
import type SideNavMenu from './side-nav-menu.gts';

export interface SideNavMenuItemSignature {
  Element: LinkSignature['Element'];
  Args: LinkSignature['Args'] & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /**
     * Marks it as the current page, with `aria-current="page"`, as does a
     * link to the current route.
     */
    isActive?: boolean;
    menu?: SideNavMenu;
  };
  Blocks: {
    default: [];
  };
}

/** A link in a `SideNavMenu`. */
export default class SideNavMenuItem extends Component<SideNavMenuItemSignature> {
  constructor(owner: Owner, args: SideNavMenuItemSignature['Args']) {
    super(owner, args);
    const { menu } = args;
    if (!menu) return;
    // The menu read its items during this render; register after it.
    afterRender(this, () => {
      menu.registerItem(this);
      registerDestructor(this, () => menu.unregisterItem(this));
    });
  }

  get isActive() {
    return (
      Boolean(this.args.isActive) || isCurrentRoute(getOwner(this)!, this.args)
    );
  }

  <template>
    <li class="cds--side-nav__menu-item {{@className}}">
      <Link
        @as={{@as}}
        @href={{@href}}
        @route={{@route}}
        @externalRoute={{@externalRoute}}
        @models={{@models}}
        @query={{@query}}
        aria-current={{if this.isActive "page"}}
        ...attributes
        class="cds--side-nav__link
          {{if this.isActive 'cds--side-nav__link--current'}}"
      >
        <SideNavLinkText>{{yield}}</SideNavLinkText>
      </Link>
    </li>
  </template>
}
