import RouterLink from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderMenuItemSignature {
  Element: HTMLAnchorElement;
  Args: {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /** The URL it links to. */
    href?: string;
    /**
     * A route to link to through the Ember router, in place of `@href`, as
     * Ember's `LinkTo`. It's the current link while the route is current.
     */
    route?: string;
    /** The models for `@route`'s dynamic segments, in order. */
    models?: unknown[];
    /** Query params for `@route`. */
    query?: Record<string, unknown>;
    /** Marks it as the current link, as Carbon React's `isActive`. */
    isActive?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const UIShellHeaderMenuItem: TOC<UIShellHeaderMenuItemSignature> = <template>
  <li class={{@className}}>
    <RouterLink
      @href={{@href}}
      @route={{@route}}
      @models={{@models}}
      @query={{@query}}
      @isActive={{@isActive}}
      @activeClass="cds--header__menu-item--current"
      @ariaCurrent="true"
      class="cds--header__menu-item"
      tabindex="0"
      ...attributes
    >
      <span class="cds--text-truncate--end">
        {{yield}}
      </span>
    </RouterLink>
  </li>
</template>;

export default UIShellHeaderMenuItem;
