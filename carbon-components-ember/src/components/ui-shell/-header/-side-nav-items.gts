import Component from '@glimmer/component';

export interface UIShellHeaderSideNavItemsSignature {
  Element: HTMLUListElement;
  Args: {
    hasDivider?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellHeaderSideNavItems extends Component<UIShellHeaderSideNavItemsSignature> {
  <template>
    <ul
      class='cds--side-nav__header-navigation
        {{if @hasDivider "cds--side-nav__header-divider"}}'
      ...attributes
    >
      {{yield}}
    </ul>
  </template>
}
