import Component from '@glimmer/component';
import NavMenuComponent, { SubMenu } from './-menu';
import { IconNames } from 'carbon-components-ember/components/icon';

export type MenuItem = {
  submenus: SubMenu[];
  icon: IconNames;
  title: string;
}

export interface UiShellNavSignature {
  Args: {
    open: boolean;
    menuItems: MenuItem[];
    currentMenu: MenuItem;
    transitionTo: (menu: MenuItem) => void;
  };
  Blocks: {
    default: [typeof NavMenuComponent];
    shell: [{Header; Sidenav; Nav}];
    content: [];
  };
}

export default class UiShellNav extends Component<UiShellNavSignature> {}



