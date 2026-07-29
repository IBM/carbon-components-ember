import Component from '@glimmer/component';
import UIShellSideNavIcon from './-icon.gts';
import type Icon from '../../icon.gts';

export interface UIShellSideNavHeaderSignature {
  Element: HTMLElement;
  Args: {
    icon: typeof Icon;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellSideNavHeader extends Component<UIShellSideNavHeaderSignature> {
  <template>
    <header class='cds--side-nav__header' ...attributes>
      <UIShellSideNavIcon>
        <this.args.icon />
      </UIShellSideNavIcon>
      {{yield}}
    </header>
  </template>
}
