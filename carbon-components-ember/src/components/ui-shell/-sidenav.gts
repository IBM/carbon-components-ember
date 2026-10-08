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

export type MenuItem = {
  submenus: SubMenu[];
  icon?: typeof Icon;
  title: string;
};

export interface UIShellSideNavSignature {
  Element: HTMLElement;
  Args: {
    open: boolean;
    menuItems: MenuItem[];
    currentMenu: MenuItem;
    transitionTo: (menu: MenuItem | SubMenu) => void;
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
          @transitionTo={{fn @transitionTo menu}}
          as |Sub|
        >
          {{#each menu.submenus as |submenu|}}
            <Sub
              @isCurrent={{eq submenu @currentMenu}}
              @transitionTo={{fn @transitionTo submenu}}
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
