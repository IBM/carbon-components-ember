/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import indeterminate from '../modifiers/indeterminate.ts';

export interface InlineCheckboxSignature {
  Element: HTMLDivElement;
  Args: {
    /** Names the control, in a visually hidden label: Carbon React's `aria-label`. */
    ariaLabel: string;
    /** Whether the control is checked. An indeterminate control is unchecked. */
    checked?: boolean;
    disabled?: boolean;
    /** The `id` of the `<input>`, which its label points at. */
    id: string;
    /** Whether the control is in an indeterminate state. */
    indeterminate?: boolean;
    /** The `name` of the `<input>`. */
    name: string;
    /**
     * Called with the new checked state, the `<input>`'s id and the `change`
     * event.
     */
    onChange?: (checked: boolean, id: string, event: Event) => void;
    /**
     * Called with the `click` event on the `<input>`, after an indeterminate
     * control is unchecked.
     */
    onClick?: (event: MouseEvent) => void;
    /** The label's tooltip. */
    title?: string;
  };
}

function stopPropagation(event: Event) {
  event.stopPropagation();
}

/**
 * A checkbox without a visible label, for a table's selection cells, as
 * Carbon React's `InlineCheckbox`. `...attributes` goes on its root, so a
 * `keydown` listener there hears the `<input>`'s.
 */
export default class InlineCheckbox extends Component<InlineCheckboxSignature> {
  get checked() {
    return this.args.indeterminate ? false : (this.args.checked ?? false);
  }

  handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.args.onChange?.(input.checked, this.args.id, event);
  };

  handleClick = (event: MouseEvent) => {
    if (!this.args.onClick) return;
    if (this.args.indeterminate) {
      (event.target as HTMLInputElement).checked = false;
    }
    this.args.onClick(event);
  };

  <template>
    <div class="cds--checkbox--inline" ...attributes>
      <input
        type="checkbox"
        class="cds--checkbox"
        id={{@id}}
        name={{@name}}
        disabled={{@disabled}}
        checked={{this.checked}}
        {{indeterminate @indeterminate}}
        {{on "click" this.handleClick}}
        {{on "change" this.handleChange}}
      />
      <label
        for={{@id}}
        class="cds--checkbox-label"
        title={{@title}}
        {{on "click" stopPropagation}}
      >
        <span class="cds--visually-hidden">{{@ariaLabel}}</span>
      </label>
    </div>
  </template>
}
