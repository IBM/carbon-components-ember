import Component from '@glimmer/component';
import { IconNames } from 'carbon-components-ember/components/icon';
import MenuItemComponent from 'carbon-components-ember/components/menu/-item';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

BasicDropdown

export interface MenuComponentSignature {
  Args: {
    icon: IconNames;
    direction: 'bottom'|'top';
  };
  Blocks: {
    default: [typeof MenuItemComponent];
  };
}

export default class MenuComponent extends Component<MenuComponentSignature> {

}
