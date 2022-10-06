import Component from '@glimmer/component';

export interface MenuItemComponentSignature {
  Args: {
    tooltip?: string;
    title?: string;
    isDanger?: boolean;
    isPrimary?: boolean;
    isDisabled?: boolean;
  };
  Element: HTMLButtonElement;
  Blocks: {
    default: [];
  };
}

export default class MenuItemComponent extends Component<MenuItemComponentSignature> {

}
