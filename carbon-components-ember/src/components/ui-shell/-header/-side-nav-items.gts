import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderSideNavItemsSignature {
  Element: HTMLUListElement;
  Args: {
    hasDivider?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const UIShellHeaderSideNavItems: TOC<UIShellHeaderSideNavItemsSignature> =
  <template>
    <ul
      class="cds--side-nav__header-navigation
        {{if @hasDivider 'cds--side-nav__header-divider'}}"
      ...attributes
    >
      {{yield}}
    </ul>
  </template>;

export default UIShellHeaderSideNavItems;
