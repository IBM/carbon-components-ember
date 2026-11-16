/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TableHeadSignature {
  Element: HTMLTableSectionElement;
  Blocks: {
    default: [];
  };
}

/** The `<thead>` of a `Table`, as Carbon React's `TableHead`. */
const TableHead: TOC<TableHeadSignature> = <template>
  <thead ...attributes>{{yield}}</thead>
</template>;

export default TableHead;
