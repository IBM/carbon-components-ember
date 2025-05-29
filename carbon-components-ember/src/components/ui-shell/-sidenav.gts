import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as Menu } from '../../components/ui-shell/-sidenav/-menu.gts';
import Component from '@glimmer/component';
import NavMenuComponent, { type SubMenu } from './-sidenav/-menu.gts';
import { fn } from '@ember/helper';
import { stylesheet } from 'astroturf';
import type Icon from '../icon';

export type MenuItem = {
  submenus: SubMenu[];
  icon: typeof Icon;
  title: string;
};

export interface UiShellNavSignature {
  Args: {
    open: boolean;
    menuItems: MenuItem[];
    currentMenu: MenuItem;
    transitionTo: (menu: MenuItem | SubMenu) => void;
  };
  Blocks: {
    default: [typeof NavMenuComponent];
    content: [];
  };
}

export default class UiShellNav extends Component<UiShellNavSignature> {
  styles = stylesheet`
    .namespace {
      &.cds--side-nav--ux {
        width: 3.5rem;
      }

      &.cds--side-nav--expanded {
        width: 16rem;
      }
    }
  ` as { namespace: string };

  <template>
    <nav
      class='cds--side-nav__navigation cds--side-nav
        {{if @open "cds--side-nav--expanded"}}
        {{this.styles.namespace}}'
      role='navigation'
      aria-label='Page Navigation'
    >
      <ul class='cds--side-nav__items'>
        {{#unless @menuItems}}
          {{yield Menu}}
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
    </nav>
  </template>
}
