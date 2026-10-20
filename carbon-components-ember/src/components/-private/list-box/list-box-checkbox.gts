/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import './list-box-checkbox.scss';

export interface ListBoxCheckboxSignature {
  Element: HTMLDivElement;
  Args: {
    checked?: boolean;
    /** Drawn partly checked, as a select-all option with some items chosen. */
    indeterminate?: boolean;
    disabled?: boolean;
    /** The checkbox's tooltip. */
    title?: string;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The checkbox in a multi-select option, where Carbon React renders a
 * Checkbox. An option's children can't be interactive, so it's only drawn,
 * from Carbon's contained checkbox styles; the option's `aria-checked` says
 * the same.
 */
const ListBoxCheckbox: TOC<ListBoxCheckboxSignature> = <template>
  <div class="cds--checkbox-wrapper" ...attributes>
    <div class="cds--form-item cds--checkbox-wrapper">
      <div
        class="cds--checkbox-label
          {{if @indeterminate 'cds--ember-list-box-checkbox--mixed'}}"
        data-contained-checkbox-state={{if @checked "true" "false"}}
        data-contained-checkbox-disabled={{if @disabled "true" "false"}}
        title={{@title}}
      >
        <div class="cds--checkbox-label-text">{{yield}}</div>
      </div>
    </div>
  </div>
</template>;

export default ListBoxCheckbox;
