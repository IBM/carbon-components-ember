import Component from '@glimmer/component';
import { IconNames } from 'carbon-components-ember/components/icon';
import SubMenuComponent from 'carbon-components-ember/components/ui-shell/-sidenav/-sub-menu';

export type SubMenu = {
  icon: IconNames;
  title: string;
};

export interface Signature {
  Args: {
    transitionTo: () => void;
    hidden?: boolean;
    open?: boolean;
    isCurrent: boolean;
    icon: IconNames;
    title: string;
    submenus: SubMenu[];
  };
  Element: null;
  Blocks: {
    default: [typeof SubMenuComponent];
  };
}

export default class NavMenuComponent extends Component<Signature> {}



