/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Close from '../../icons/close.ts';
import type { TOC } from '@ember/component/template-only';

export interface ListBoxSelectionSignature {
  Element: HTMLButtonElement;
  Args: {
    clearSelection: (event: MouseEvent) => void;
    disabled?: boolean;
    readOnly?: boolean;
  };
}

// As in Carbon React, the click clears the field and goes no further.
const clear = (clearSelection: (event: MouseEvent) => void, event: Event) => {
  event.stopPropagation();
  clearSelection(event as MouseEvent);
};

/** The button that clears a list box field, as Carbon React's `ListBoxSelection`. */
const ListBoxSelection: TOC<ListBoxSelectionSignature> = <template>
  <button
    ...attributes
    type="button"
    class="cds--list-box__selection"
    tabindex="-1"
    aria-label="Clear selected item"
    title="Clear selected item"
    disabled={{or @disabled @readOnly}}
    aria-disabled={{if @readOnly "true"}}
    {{on "click" (fn clear @clearSelection)}}
  >
    <Close @size="16" @svgClass="cds--list-box__selection-icon" />
  </button>
</template>;

export default ListBoxSelection;
