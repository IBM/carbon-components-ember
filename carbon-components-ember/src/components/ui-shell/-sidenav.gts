import Menu from '../../components/ui-shell/-sidenav/-menu.gts';
import type UIShellSideNavMenu from './-sidenav/-menu.gts';
import type { SubMenu } from './-sidenav/-menu.gts';
import UIShellSideNavDivider from './-sidenav/-divider.gts';
import UIShellSideNavFooter from './-sidenav/-footer.gts';
import UIShellSideNavHeader from './-sidenav/-header.gts';
import UIShellSideNavDetails from './-sidenav/-details.gts';
import UIShellSideNavIcon from './-sidenav/-icon.gts';
import UIShellHeaderSideNavItems from './-header/-side-nav-items.gts';
import type Icon from '../icon.gts';
import type { TOC } from '@ember/component/template-only';
import type { RouteArgs } from '../-private/router-link.gts';

export type MenuItem = RouteArgs & {
  submenus: SubMenu[];
  icon?: typeof Icon;
  title: string;
  /** The URL it links to. `route` links it to one of the app's routes. */
  href?: string;
};

export interface UIShellSideNavSignature {
  Element: HTMLElement;
  Args: {
    open: boolean;
    /** The menus to render, in place of the block. */
    menuItems?: MenuItem[];
    /** The current one of `@menuItems`, for an item without a route. */
    currentMenu?: MenuItem;
    /** Called with the clicked one of `@menuItems`. */
    transitionTo?: (menu: MenuItem | SubMenu) => void;
  };
  Blocks: {
    default: [
      UIShellSideNavMenu: typeof UIShellSideNavMenu,
      UIShellSideNavDivider: typeof UIShellSideNavDivider,
      UIShellSideNavHeader: typeof UIShellSideNavHeader,
      UIShellSideNavDetails: typeof UIShellSideNavDetails,
      UIShellSideNavIcon: typeof UIShellSideNavIcon,
      UIShellHeaderSideNavItems: typeof UIShellHeaderSideNavItems,
    ];
    footer: [UIShellSideNavFooter: typeof UIShellSideNavFooter];
  };
}

const UIShellSideNav: TOC<UIShellSideNavSignature> = <template>
  <nav
    class="cds--side-nav__navigation cds--side-nav
      {{if @open 'cds--side-nav--expanded'}}"
    role="navigation"
    aria-label="Page Navigation"
    ...attributes
  >
    <ul class="cds--side-nav__items">
      {{#unless @menuItems}}
        {{yield
          Menu
          UIShellSideNavDivider
          UIShellSideNavHeader
          UIShellSideNavDetails
          UIShellSideNavIcon
          UIShellHeaderSideNavItems
        }}
      {{/unless}}
      {{#each @menuItems as |menu|}}
        <Menu
          @submenus={{menu.submenus}}
          @icon={{menu.icon}}
          @title={{menu.title}}
          @open={{@open}}
          @isCurrent={{eq menu @currentMenu}}
          @transitionTo={{if @transitionTo (fn @transitionTo menu)}}
          @href={{menu.href}}
          @route={{menu.route}}
          @models={{menu.models}}
          @query={{menu.query}}
          as |Sub|
        >
          {{#each menu.submenus as |submenu|}}
            <Sub
              @isCurrent={{eq submenu @currentMenu}}
              @transitionTo={{if @transitionTo (fn @transitionTo submenu)}}
              @href={{submenu.href}}
              @route={{submenu.route}}
              @models={{submenu.models}}
              @query={{submenu.query}}
              @icon={{submenu.icon}}
              @title={{submenu.title}}
            />
          {{/each}}
        </Menu>
      {{/each}}
    </ul>
    {{yield UIShellSideNavFooter to="footer"}}
  </nav>
</template>;

export default UIShellSideNav;
