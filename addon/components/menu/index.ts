import Component from '@glimmer/component';
import { IconNames } from 'carbon-components-ember/components/icon';
import MenuItemComponent from 'carbon-components-ember/components/menu/-item';

export interface MenuComponentSignature {
  Args: {
    icon: IconNames;
    direction: 'bottom'|'top'
  };
  Blocks: {
    default: [typeof MenuItemComponent];
  };
}

export default class MenuComponent extends Component<MenuComponentSignature> {

}
