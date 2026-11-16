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
import { isCurrentRoute } from '../-private/router-link.gts';
import { afterRender } from '../../utils/after-render.ts';
import type HeaderMenu from './header-menu.gts';

export interface HeaderMenuItemSignature {
  Element: LinkSignature['Element'];
  Args: LinkSignature['Args'] & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /** The `role` of the `<li>`, as Carbon React's `role`. */
    role?: string;
    /** Marks it as the current link, as does a link to the current route. */
    isActive?: boolean;
    menu?: HeaderMenu;
  };
  Blocks: {
    default: [];
  };
}

/** A link in `HeaderNavigation`, a `HeaderMenu` or `HeaderSideNavItems`. */
export default class HeaderMenuItem extends Component<HeaderMenuItemSignature> {
  constructor(owner: Owner, args: HeaderMenuItemSignature['Args']) {
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
    <li class={{@className}} role={{@role}}>
      <Link
        @as={{@as}}
        @href={{@href}}
        @route={{@route}}
        @externalRoute={{@externalRoute}}
        @models={{@models}}
        @query={{@query}}
        aria-current={{if this.isActive "true"}}
        tabindex="0"
        ...attributes
        class="cds--header__menu-item
          {{if this.isActive 'cds--header__menu-item--current'}}"
      >
        <span class="cds--text-truncate--end">{{yield}}</span>
      </Link>
    </li>
  </template>
}
