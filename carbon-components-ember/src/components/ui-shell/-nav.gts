import UIShellNavItem from '../../components/ui-shell/-nav/-item.gts';
import UIShellHeaderMenu from '../../components/ui-shell/-header/-menu.gts';
import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Blocks: {
    default: [typeof UIShellNavItem, typeof UIShellHeaderMenu];
  };
}

const InnerClass: TOC<Signature> = <template>
  <nav aria-label="IBM [Platform]" class="cds--header__nav">
    <ul class="cds--header__menu-bar">
      {{yield UIShellNavItem UIShellHeaderMenu}}
    </ul>
  </nav>
</template>;

export default InnerClass;
