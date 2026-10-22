import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderNavItemSignature {
  Element: HTMLAnchorElement;
  Args: {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
  };
  Blocks: {
    default: [];
  };
}

const UIShellHeaderNavItem: TOC<UIShellHeaderNavItemSignature> = <template>
  <li class={{@className}}>
    <a href="#" class="cds--header__menu-item" tabindex="0" ...attributes>
      <span class="cds--text-truncate--end">
        {{yield}}
      </span>
    </a>
  </li>
</template>;

export default UIShellHeaderNavItem;
