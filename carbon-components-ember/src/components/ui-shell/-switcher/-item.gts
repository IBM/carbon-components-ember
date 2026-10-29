import RouterLink from '../../-private/router-link.gts';
import type { RouteArgs } from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSwitcherItemSignature {
  Element: HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    'aria-label'?: string;
    /** Marks the current product, as does `@route` while it's current. */
    isSelected?: boolean;
    /**
     * The URL it links to. `@route` links it to one of the app's routes,
     * and makes it the current link while that route is current.
     */
    href?: string;
  };
  Blocks: {
    default: [];
  };
}

const UIShellSwitcherItem: TOC<UIShellSwitcherItemSignature> = <template>
  <li class="cds--switcher__item {{@className}}">
    <RouterLink
      @href={{@href}}
      @route={{@route}}
      @externalRoute={{@externalRoute}}
      @models={{@models}}
      @query={{@query}}
      @isActive={{@isSelected}}
      @activeClass="cds--switcher__item-link--selected"
      class="cds--switcher__item-link"
      tabindex="0"
      aria-label={{@aria-label}}
      ...attributes
    >
      {{yield}}
    </RouterLink>
  </li>
</template>;

export default UIShellSwitcherItem;
