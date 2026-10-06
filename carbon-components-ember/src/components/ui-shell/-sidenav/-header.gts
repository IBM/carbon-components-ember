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
    {{! Yielded into the side nav's list, so it sits in a list item. }}
    <li>
      <header class="cds--side-nav__header" ...attributes>
        <UIShellSideNavIcon>
          <this.args.icon />
        </UIShellSideNavIcon>
        {{yield}}
      </header>
    </li>
  </template>
}
