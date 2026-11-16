/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import TableToolbarMenu from './table-toolbar-menu.gts';
import TableToolbarSearch from './table-toolbar-search.gts';
import type { TableToolbarSignature } from './table-toolbar.gts';

export interface TableToolbarContentSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * The size of the `TableToolbar` it is in, which its search and menu
     * take. Set by the toolbar's yielded `TableToolbarContent`.
     */
    toolbarSize?: TableToolbarSignature['Args']['size'];
  };
  Blocks: {
    /** The content, with the toolbar's search and menu. */
    default: [
      TableToolbarSearch: WithBoundArgs<
        typeof TableToolbarSearch,
        'toolbarSize'
      >,
      TableToolbarMenu: WithBoundArgs<typeof TableToolbarMenu, 'toolbarSize'>,
    ];
  };
}

/** The search, menu and actions of a `TableToolbar`, as Carbon React's `TableToolbarContent`. */
const TableToolbarContent: TOC<TableToolbarContentSignature> = <template>
  <div class="cds--toolbar-content" ...attributes>{{yield
      (component TableToolbarSearch toolbarSize=@toolbarSize)
      (component TableToolbarMenu toolbarSize=@toolbarSize)
    }}</div>
</template>;

export default TableToolbarContent;
