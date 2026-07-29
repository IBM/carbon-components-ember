import Component from '@glimmer/component';
import UIShellSwitcherItem from './-switcher/-item.gts';
import UIShellSwitcherDivider from './-switcher/-divider.gts';

export interface UIShellSwitcherSignature {
  Element: HTMLUListElement;
  Args: {
    'aria-label'?: string;
    'aria-labelledby'?: string;
  };
  Blocks: {
    default: [typeof UIShellSwitcherItem, typeof UIShellSwitcherDivider];
  };
}

export default class UIShellSwitcher extends Component<UIShellSwitcherSignature> {
  <template>
    <ul
      class='cds--switcher'
      aria-label={{@aria-label}}
      aria-labelledby={{@aria-labelledby}}
      ...attributes
    >
      {{yield UIShellSwitcherItem UIShellSwitcherDivider}}
    </ul>
  </template>
}
