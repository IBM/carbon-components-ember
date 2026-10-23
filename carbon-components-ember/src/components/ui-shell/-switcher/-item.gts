import RouterLink from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSwitcherItemSignature {
  Element: HTMLAnchorElement;
  Args: {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    'aria-label'?: string;
    /** Marks the current product, as does `@route` while it's current. */
    isSelected?: boolean;
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
