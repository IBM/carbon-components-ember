import Component from '@glimmer/component';
import UIShellNavItem from '../../components/ui-shell/-nav/-item.gts';
import UIShellHeaderMenu from '../../components/ui-shell/-header/-menu.gts';

export interface Signature {
  Element: null;
  Blocks: {
    default: [typeof UIShellNavItem, typeof UIShellHeaderMenu];
  };
}

export default class InnerClass extends Component<Signature> {
  <template>
    <nav aria-label='IBM [Platform]' class='cds--header__nav'>
      <ul class='cds--header__menu-bar'>
        {{yield UIShellNavItem UIShellHeaderMenu}}
      </ul>
    </nav>
  </template>
}
