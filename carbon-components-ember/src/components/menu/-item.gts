import Component from '@glimmer/component';
import { on } from '@ember/modifier';

export interface MenuItemComponentSignature {
  Args: {
    tooltip?: string;
    title?: string;
    isDanger?: boolean;
    isPrimary?: boolean;
    isDisabled?: boolean;
    isDivider?: boolean;
    onClick?: (...args: any) => void;
  };
  Element: HTMLButtonElement;
  Blocks: {
    default: [];
  };
}

export default class Item extends Component<MenuItemComponentSignature> {

  onClick = () => {
    return this.args.onClick?.();
  }

  <template>
    <li
      class='cds--overflow-menu-options__option
        {{if @isDisabled "cds--overflow-menu-options__option--disabled"}}
        {{if @isDanger "cds--overflow-menu-options__option--danger"}}
        {{if @isDivider "cds--overflow-menu--divider"}}'
    >
      <button
        {{on 'click' this.onClick}}
        class='cds--overflow-menu-options__btn'
        title='{{@tooltip}}'
        data-floating-menu-primary-focus={{@isPrimary}}
        ...attributes
        type='button'
      >
        <span class='cds--overflow-menu-options__option-content'>
          {{@title}}
          {{yield}}
        </span>
      </button>
    </li>
  </template>
}
