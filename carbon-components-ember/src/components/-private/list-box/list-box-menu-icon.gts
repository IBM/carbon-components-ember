/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ChevronDown from '../../icons/chevron-down.ts';
import type { TOC } from '@ember/component/template-only';

export interface ListBoxMenuIconSignature {
  Element: HTMLDivElement;
  Args: {
    isOpen?: boolean;
  };
}

const ListBoxMenuIcon: TOC<ListBoxMenuIconSignature> = <template>
  <div
    class="cds--list-box__menu-icon
      {{if @isOpen 'cds--list-box__menu-icon--open'}}"
    ...attributes
  >
    {{#let (if @isOpen "Close menu" "Open menu") as |description|}}
      <ChevronDown
        @size="16"
        @title={{description}}
        @ariaLabel={{description}}
      />
    {{/let}}
  </div>
</template>;

export default ListBoxMenuIcon;
