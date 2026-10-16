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
    {{! Carbon React also labels the icon (aria-label); that needs Icon's
      ariaLabel argument. }}
    <ChevronDown
      @size="16"
      @svgClass="cds--list-box__menu-icon__svg"
      @title={{if @isOpen "Close menu" "Open menu"}}
    />
  </div>
</template>;

export default ListBoxMenuIcon;
