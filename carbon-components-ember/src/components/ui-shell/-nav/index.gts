import { default as Item } from './-item';
import Component from '@glimmer/component';
import UiShellNavItem from 'carbon-components-ember/components/ui-shell/-nav/-item';

export interface Signature {
  Args: {};
  Element: null;
  Blocks: {
    default: [typeof UiShellNavItem];
  };
}

export default class InnerClass extends Component<Signature> {
  <template>
    <nav aria-label='IBM [Platform]' class='cds--header__nav'>
      <ul class='cds--header__menu-bar'>
        {{yield Item}}
      </ul>
    </nav>
  </template>
}
