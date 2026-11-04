/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ComponentLike } from '@glint/template';
import Close from '../icons/close.ts';
import Menu from '../icons/menu.ts';
import type { TOC } from '@ember/component/template-only';

export interface HeaderMenuButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    /** Names the button, and titles it, as Carbon React's `aria-label`. */
    ariaLabel?: string;
    /** Shows the close icon, while the side nav it opens is open. */
    isActive?: boolean;
    /** Shows it at every width, not only below the `lg` breakpoint. */
    isCollapsible?: boolean;
    /** An icon in place of the menu icon. */
    renderMenuIcon?: ComponentLike;
    /** An icon in place of the close icon. */
    renderCloseIcon?: ComponentLike;
  };
}

/**
 * The `Header`'s button that opens and closes the `SideNav`. Toggle the side
 * nav's `@expanded` with `{{on "click"}}`, or use `HeaderContainer`.
 */
const HeaderMenuButton: TOC<HeaderMenuButtonSignature> = <template>
  <button
    aria-label={{@ariaLabel}}
    title={{@ariaLabel}}
    ...attributes
    class="cds--header__action cds--header__menu-trigger
      {{if @isActive 'cds--header__action--active'}}
      cds--header__menu-toggle
      {{unless @isCollapsible 'cds--header__menu-toggle__hidden'}}"
    type="button"
  >
    {{#if @isActive}}
      {{#if @renderCloseIcon}}
        <@renderCloseIcon />
      {{else}}
        <Close @size={{20}} />
      {{/if}}
    {{else if @renderMenuIcon}}
      <@renderMenuIcon />
    {{else}}
      <Menu @size={{20}} />
    {{/if}}
  </button>
</template>;

export default HeaderMenuButton;
