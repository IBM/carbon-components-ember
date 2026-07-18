import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import type Icon from '../../icon.gts';

export interface UIShellHeaderGlobalActionSignature {
  Element: HTMLButtonElement;
  Args: {
    'aria-label': string;
    icon: typeof Icon;
    onClick: () => void;
  };
}

export default class UIShellHeaderGlobalAction extends Component<UIShellHeaderGlobalActionSignature> {
  <template>
    <button
      aria-label={{@aria-label}}
      title={{@aria-label}}
      class='cds--header__action'
      type='button'
      {{on 'click' @onClick}}
      ...attributes
    >
      <this.args.icon @size={{20}} />
    </button>
  </template>
}
