import { default as Icon } from 'carbon-components-ember/components/icon';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as toggle } from 'ember-composable-helpers/helpers/toggle';
import { default as styles } from './styles.scoped.scss';
import { default as Menu } from './-menu';
import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import NavMenuComponent, { SubMenu } from './-menu';
import { IconNames } from 'carbon-components-ember/components/icon';

export type MenuItem = {
  submenus: SubMenu[];
  icon: IconNames;
  title: string;
};

export interface UiShellNavSignature {
  Args: {
    open: boolean;
    menuItems: MenuItem[];
    currentMenu: MenuItem;
    transitionTo: (menu: MenuItem) => void;
  };
  Blocks: {
    default: [typeof NavMenuComponent];
    shell: [{ Header; Sidenav; Nav }];
    content: [];
  };
}

export default class UiShellNav extends Component<UiShellNavSignature> {
  <template>
    <nav
      class='cds--side-nav__navigation cds--side-nav cds--side-nav--ux
        {{if @open "cds--side-nav--expanded"}}
        {{styles.namespace}}'
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
