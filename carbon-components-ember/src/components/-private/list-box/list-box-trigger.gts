/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ChevronDown from '../../icons/chevron-down.ts';
import type { TOC } from '@ember/component/template-only';

export interface ListBoxTriggerSignature {
  Element: HTMLButtonElement;
  Args: {
    isOpen?: boolean;
  };
}

/**
 * The button that opens and closes a list box's menu, as Carbon React's
 * `ListBoxTrigger`.
 */
const ListBoxTrigger: TOC<ListBoxTriggerSignature> = <template>
  {{#let (if @isOpen "Close" "Open") as |description|}}
    <button
      ...attributes
      type="button"
      class="cds--list-box__menu-icon
        {{if @isOpen 'cds--list-box__menu-icon--open'}}"
      tabindex="-1"
      aria-label={{description}}
      title={{description}}
    >
      <ChevronDown @size="16" @svgClass="cds--list-box__menu-icon__svg" />
    </button>
  {{/let}}
</template>;

export default ListBoxTrigger;
