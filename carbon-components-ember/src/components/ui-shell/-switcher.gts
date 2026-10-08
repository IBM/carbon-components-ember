import UIShellSwitcherItem from './-switcher/-item.gts';
import UIShellSwitcherDivider from './-switcher/-divider.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSwitcherSignature {
  Element: HTMLUListElement;
  Args: {
    'aria-label'?: string;
    'aria-labelledby'?: string;
  };
  Blocks: {
    default: [
      UIShellSwitcherItem: typeof UIShellSwitcherItem,
      UIShellSwitcherDivider: typeof UIShellSwitcherDivider,
    ];
  };
}

const UIShellSwitcher: TOC<UIShellSwitcherSignature> = <template>
  <ul
    class="cds--switcher"
    aria-label={{@aria-label}}
    aria-labelledby={{@aria-labelledby}}
    ...attributes
  >
    {{yield UIShellSwitcherItem UIShellSwitcherDivider}}
  </ul>
</template>;

export default UIShellSwitcher;
