import Component from '@glimmer/component';
import type { PopoverSignature } from '../popover.gts';

export interface ToggletipButtonSignature {
  Args: {
    open: boolean;
    toggle: () => void;
    id: string;
    /** The Toggletip's Popover's trigger modifier, bound by the Toggletip. */
    trigger: PopoverSignature['Blocks']['default'][1];
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
export default class ToggletipButton extends Component<ToggletipButtonSignature> {
  get label() {
    return this.args.label ?? 'Show information';
  }

  <template>
    <button
      type="button"
      class="cds--toggletip-button"
      aria-label={{this.label}}
      aria-expanded={{if @open "true" "false"}}
      aria-controls={{@id}}
      aria-describedby={{if @open @id}}
      {{on "click" @toggle}}
      {{@trigger}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}
