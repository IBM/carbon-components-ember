import RouterLink from '../../-private/router-link.gts';
import type { RouteArgs } from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderNavItemSignature {
  Element: HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /**
     * The URL it links to. `@route` links it to one of the app's routes,
     * and makes it the current link while that route is current.
     */
    href?: string;
    /** Marks it as the current link, as Carbon React's `isActive`. */
    isActive?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const UIShellHeaderNavItem: TOC<UIShellHeaderNavItemSignature> = <template>
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

export default UIShellHeaderNavItem;
