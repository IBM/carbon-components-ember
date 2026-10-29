import type { IconComponent } from '../../icon.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import UIShellSideNavSubMenu from './-sub-menu.gts';
import RouterLink from '../../-private/router-link.gts';
import type { RouteArgs } from '../../-private/router-link.gts';
import ChevronDown from '../../icons/chevron-down.ts';

export type SubMenu = RouteArgs & {
  icon?: IconComponent;
  title: string;
  /** The URL it links to. `route` links it to one of the app's routes. */
  href?: string;
};

export interface UIShellSideNavMenuSignature {
  /** The `<li>` with `@submenus`, as Carbon React's SideNavMenu; else the link, as its SideNavLink. */
  Element: HTMLLIElement | HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * Called on a click, for an item with neither `@href` nor `@route`.
     * Prefer `@route`, which also marks the current link.
     */
    transitionTo?: () => void;
    hidden?: boolean;
    open?: boolean;
    /** Marks it as the current link, as Carbon React's `isActive`. */
    isCurrent?: boolean;
    /**
     * The URL it links to. `@route` links it to one of the app's routes,
     * and makes it the current link while that route is current.
     */
    href?: string;
    icon?: IconComponent;
    title: string;
    submenus: SubMenu[];
  };
  Blocks: {
    default: [UIShellSideNavSubMenu: typeof UIShellSideNavSubMenu];
  };
}

export default class UIShellSideNavMenu extends Component<UIShellSideNavMenuSignature> {
  @tracked expanded = false;

  get isLink() {
    return Boolean(
      this.args.href || this.args.route || this.args.externalRoute,
    );
  }

  transition = () => this.args.transitionTo?.();

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

  <template>
    {{#if @submenus}}
      <li
        class="cds--side-nav__item {{if @icon 'cds--side-nav__item--icon'}}"
        ...attributes
      >
        <button
          class="cds--side-nav__submenu"
          aria-haspopup="true"
          aria-expanded="{{or @open this.expanded}}"
          type="button"
          {{on "click" this.toggleExpanded}}
        >
          {{#if @icon}}
            <div class="cds--side-nav__icon">
              <@icon />
            </div>
          {{/if}}
          <span class="cds--side-nav__submenu-title">
            {{@title}}
          </span>
          <div
            class="cds--side-nav__icon cds--side-nav__icon--small cds--side-nav__submenu-chevron"
          >
            <ChevronDown @size="20" />
          </div>
        </button>
        {{#if (or @open this.expanded)}}
          <ul class="cds--side-nav__menu">
            {{yield UIShellSideNavSubMenu}}
          </ul>
        {{/if}}
      </li>
    {{else}}
      {{#unless @hidden}}
        <li class="cds--side-nav__item">
          {{! Without a link, it's a "#" button for @transitionTo. }}
          <RouterLink
            @href={{if this.isLink @href "#"}}
            @route={{@route}}
            @externalRoute={{@externalRoute}}
            @models={{@models}}
            @query={{@query}}
            @isActive={{@isCurrent}}
            @activeClass="cds--side-nav__link--current"
            @ariaCurrent="page"
            class="cds--side-nav__link"
            role={{unless this.isLink "button"}}
            ...attributes
            {{on "click" this.transition}}
          >
            {{#if @icon}}
              <div class="cds--side-nav__icon cds--side-nav__icon--small">
                <@icon />
              </div>
            {{/if}}
            <span class="cds--side-nav__link-text">
              {{@title}}
            </span>
          </RouterLink>
        </li>
      {{/unless}}
    {{/if}}
  </template>
}
