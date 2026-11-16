/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TableBodySignature {
  Element: HTMLTableSectionElement;
  Blocks: {
    default: [];
  };
}

/**
 * The `<tbody>` of a `Table`, as Carbon React's `TableBody`. It is a polite
 * live region by default; set `aria-live` to change that.
 */
const TableBody: TOC<TableBodySignature> = <template>
  <tbody aria-live="polite" ...attributes>{{yield}}</tbody>
</template>;

export default TableBody;
