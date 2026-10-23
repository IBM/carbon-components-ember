import type Icon from '../../icon.gts';
import RouterLink from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

const noop = () => {};

export interface UIShellSideNavSubMenuSignature {
  Element: HTMLAnchorElement;
  Args: {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /** Marks it as the current link, as Carbon React's `isActive`. */
    isCurrent?: boolean;
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
    /**
     * Called on a click, for an item with neither `@href` nor `@route`.
     * Prefer `@route`, which also marks the current link.
     */
    transitionTo?: () => void;
    icon?: typeof Icon;
    title: string;
  };
}

const UIShellSideNavSubMenu: TOC<UIShellSideNavSubMenuSignature> = <template>
  <li class="cds--side-nav__menu-item {{@className}}">
    {{! Without a link, "#" keeps it focusable for @transitionTo. }}
    <RouterLink
      @href={{if (or @href @route) @href "#"}}
      @route={{@route}}
      @models={{@models}}
      @query={{@query}}
      @isActive={{@isCurrent}}
      @activeClass="cds--side-nav__link--current"
      @ariaCurrent="page"
      class="cds--side-nav__link"
      {{on "click" (if @transitionTo @transitionTo noop)}}
      ...attributes
    >
      {{#if @icon}}
        <div class="cds--side-nav__icon">
          <@icon />
        </div>
      {{/if}}
      <span class="cds--side-nav__link-text">
        {{@title}}
      </span>
    </RouterLink>
  </li>
</template>;

export default UIShellSideNavSubMenu;
