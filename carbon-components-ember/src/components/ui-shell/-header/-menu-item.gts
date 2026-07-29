import Component from '@glimmer/component';

export interface UIShellHeaderMenuItemSignature {
  Element: HTMLAnchorElement;
  Args: {
    isActive?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellHeaderMenuItem extends Component<UIShellHeaderMenuItemSignature> {
  <template>
    <li>
      <a
        class='cds--header__menu-item
          {{if @isActive "cds--header__menu-item--current"}}'
        href='#'
        tabindex='0'
        aria-current='{{if @isActive "page"}}'
        ...attributes
      >
        <span class='cds--text-truncate--end'>
          {{yield}}
        </span>
      </a>
    </li>
  </template>
}
