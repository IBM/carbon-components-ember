import Component from '@glimmer/component';
import Icon from 'carbon-components-ember/components/icon';

export interface Signature {
  Args: {
    isCurrent: boolean;
    transitionTo: () => void;
    icon: Icon['args']['icon'];
    title: string;
  };
  Element: null;
  Blocks: {};
}

export default class SubMenuComponent extends Component<Signature> {}



