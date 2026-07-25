import Component from '@glimmer/component';
import { on } from '@ember/modifier';

export interface ToggletipButtonComponentSignature {
  Args: {
    open: boolean;
    toggle: () => void;
    id: string;
    /**
     * Provide an accessible label for this button. Defaults to `'Show information'`.
     */
    label?: string;
  };
  Element: HTMLButtonElement;
  Blocks: {
    default: [];
  };
}

/**
 * Controls the visibility of a `Toggletip` through mouse clicks and keyboard
 * interactions. Yielded by `Toggletip` as `t.Button`.
 */
export default class ToggletipButtonComponent extends Component<ToggletipButtonComponentSignature> {
  get label() {
    return this.args.label ?? 'Show information';
  }

  <template>
    <button
      type='button'
      class='cds--toggletip-button'
      aria-label={{this.label}}
      aria-expanded={{if @open 'true' 'false'}}
      aria-controls={{@id}}
      aria-describedby={{if @open @id}}
      {{on 'click' @toggle}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}
