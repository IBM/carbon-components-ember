import type { IconComponent } from '../../icon.gts';
import RouterLink from '../../-private/router-link.gts';
import type { RouteArgs } from '../../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

const noop = () => {};

export interface UIShellSideNavSubMenuSignature {
  Element: HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /** Marks it as the current link, as Carbon React's `isActive`. */
    isCurrent?: boolean;
    /**
     * The URL it links to. `@route` links it to one of the app's routes,
     * and makes it the current link while that route is current.
     */
    href?: string;
    /**
     * Called on a click, for an item with neither `@href` nor `@route`.
     * Prefer `@route`, which also marks the current link.
     */
    transitionTo?: () => void;
    icon?: IconComponent;
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
