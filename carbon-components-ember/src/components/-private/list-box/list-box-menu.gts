/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface ListBoxMenuSignature {
  Element: HTMLUListElement;
  Args: {
    id: string;
  };
  Blocks: {
    default: [];
  };
}

const ListBoxMenu: TOC<ListBoxMenuSignature> = <template>
  <ul id={{@id}} class="cds--list-box__menu" role="listbox" ...attributes>
    {{yield}}
  </ul>
</template>;

export default ListBoxMenu;
