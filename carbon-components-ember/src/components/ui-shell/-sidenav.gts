import Menu from '../../components/ui-shell/-sidenav/-menu.gts';
import type NavMenuComponent from './-sidenav/-menu.gts';
import type { SubMenu } from './-sidenav/-menu.gts';
import Divider from './-sidenav/-divider.gts';
import Footer from './-sidenav/-footer.gts';
import SideNavHeader from './-sidenav/-header.gts';
import SideNavDetails from './-sidenav/-details.gts';
import SideNavIcon from './-sidenav/-icon.gts';
import HeaderSideNavItems from './-header/-side-nav-items.gts';
import type Icon from '../icon.gts';
import type { TOC } from '@ember/component/template-only';

export type MenuItem = {
  submenus: SubMenu[];
  icon: typeof Icon;
  title: string;
};

export interface UIShellSideNavSignature {
  Args: {
    open: boolean;
    menuItems: MenuItem[];
    currentMenu: MenuItem;
    transitionTo: (menu: MenuItem | SubMenu) => void;
  };
  Blocks: {
    default: [
      typeof NavMenuComponent,
      typeof Divider,
      typeof SideNavHeader,
      typeof SideNavDetails,
      typeof SideNavIcon,
      typeof HeaderSideNavItems,
    ];
    footer: [typeof Footer];
  };
}

const UIShellSideNav: TOC<UIShellSideNavSignature> = <template>
  <nav
    class="cds--side-nav__navigation cds--side-nav
      {{if @open 'cds--side-nav--expanded'}}"
    role="navigation"
    aria-label="Page Navigation"
  >
    <ul class="cds--side-nav__items">
      {{#unless @menuItems}}
        {{yield
          Menu
          Divider
          SideNavHeader
          SideNavDetails
          SideNavIcon
          HeaderSideNavItems
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
    {{yield Footer to="footer"}}
  </nav>
</template>;

export default UIShellSideNav;
