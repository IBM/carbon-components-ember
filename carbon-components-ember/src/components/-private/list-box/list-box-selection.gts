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
    /**
     * How many items are selected, shown in a tag with the button (as
     * MultiSelect does), rather than the button alone.
     */
    selectionCount?: number;
    disabled?: boolean;
    readOnly?: boolean;
  };
}

// As in Carbon React, the click clears the field and goes no further.
const clear = (clearSelection: (event: MouseEvent) => void, event: Event) => {
  event.stopPropagation();
  clearSelection(event as MouseEvent);
};

const descriptionFor = (selectionCount: number | undefined) =>
  (selectionCount ?? 0) > 1 ? 'Clear selected items' : 'Clear selected item';

/** The button that clears a list box field, as Carbon React's `ListBoxSelection`. */
const ListBoxSelection: TOC<ListBoxSelectionSignature> = <template>
  {{#let (descriptionFor @selectionCount) as |description|}}
    {{#if @selectionCount}}
      <div
        class="cds--tag cds--tag--filter cds--tag--high-contrast
          {{if @disabled 'cds--tag--disabled'}}"
      >
        <span
          class="cds--tag__label"
          title={{@selectionCount}}
        >{{@selectionCount}}</span>
        <button
          ...attributes
          type="button"
          class="cds--tag__close-icon"
          tabindex="-1"
          aria-label={{description}}
          title={{description}}
          disabled={{or @disabled @readOnly}}
          aria-disabled={{if @readOnly "true"}}
          {{on "click" (fn clear @clearSelection)}}
        >
          <Close @size="16" />
        </button>
      </div>
    {{else}}
      <button
        ...attributes
        type="button"
        class="cds--list-box__selection"
        tabindex="-1"
        aria-label={{description}}
        title={{description}}
        disabled={{or @disabled @readOnly}}
        aria-disabled={{if @readOnly "true"}}
        {{on "click" (fn clear @clearSelection)}}
      >
        <Close @size="16" />
      </button>
    {{/if}}
  {{/let}}
</template>;

export default ListBoxSelection;
