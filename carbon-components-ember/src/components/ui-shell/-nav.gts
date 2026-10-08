import UIShellHeaderNavItem from '../../components/ui-shell/-nav/-item.gts';
import UIShellHeaderMenu from '../../components/ui-shell/-header/-menu.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderNavSignature {
  Element: HTMLElement;
  Blocks: {
    default: [
      UIShellHeaderNavItem: typeof UIShellHeaderNavItem,
      UIShellHeaderMenu: typeof UIShellHeaderMenu,
    ];
  };
}

const UIShellHeaderNav: TOC<UIShellHeaderNavSignature> = <template>
  <nav aria-label="IBM [Platform]" class="cds--header__nav" ...attributes>
    <ul class="cds--header__menu-bar">
      {{yield UIShellHeaderNavItem UIShellHeaderMenu}}
    </ul>
  </nav>
</template>;

export default UIShellHeaderNav;
