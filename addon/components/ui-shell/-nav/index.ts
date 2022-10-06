import Component from '@glimmer/component';
import UiShellNavItem from 'carbon-components-ember/components/ui-shell/-nav/-item';

export interface Signature {
  Args: {};
  Element: null;
  Blocks: {
    default: [typeof UiShellNavItem];
  };
}

export default class InnerClass extends Component<Signature> {}



