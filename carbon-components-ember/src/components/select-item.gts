/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';
import type { TOC } from '@ember/component/template-only';
import type Select from './select.gts';

export interface SelectItemSignature {
  Element: HTMLOptionElement;
  Args: {
    /**
     * Specify the value of the <SelectItem>
     */
    value: string | number;
    /**
     * Provide the contents of your <SelectItem>
     */
    text: string;
    /**
     * Specify whether the <SelectItem> should be disabled
     */
    disabled?: boolean;
    /**
     * Specify whether the <SelectItem> is hidden
     */
    hidden?: boolean;
    /** Bound by the `Select` that yields this item. */
    select?: Select;
  };
}

// Tells the Select when this option renders, goes or changes its value, so
// it can select its `@value` again.
const notifySelect = modifier(
  (
    _option: HTMLOptionElement,
    [select, value]: [select: Select | undefined, value: string | number],
  ) => {
    // Reading the value, which destructuring it does, makes the modifier
    // re-run when it changes; nothing else here uses it.
    void value;
    select?.optionsChanged();
    return () => select?.optionsChanged();
  },
);

const SelectItem: TOC<SelectItemSignature> = <template>
  <option
    class="cds--select-option"
    value={{@value}}
    disabled={{@disabled}}
    hidden={{@hidden}}
    ...attributes
    {{notifySelect @select @value}}
  >{{@text}}</option>
</template>;

export default SelectItem;
