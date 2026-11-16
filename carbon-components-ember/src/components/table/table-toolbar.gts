/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import TableToolbarContent from './table-toolbar-content.gts';

export interface TableToolbarSignature {
  Element: HTMLElement;
  Args: {
    /** The toolbar's size, which its search and menu take too. */
    size?: 'xs' | 'sm' | 'lg';
  };
  Blocks: {
    /** The toolbar's content, which yields its search and menu. */
    default: [
      TableToolbarContent: WithBoundArgs<
        typeof TableToolbarContent,
        'toolbarSize'
      >,
    ];
  };
}

/**
 * The toolbar above a table, as Carbon React's `TableToolbar`. It is a group
 * named "data table toolbar" unless you set `aria-label`.
 */
const TableToolbar: TOC<TableToolbarSignature> = <template>
  <section
    role="group"
    aria-label="data table toolbar"
    class="cds--table-toolbar
      {{if @size (concat 'cds--table-toolbar--' @size)}}
      {{if @size (concat 'cds--layout--size-' @size)}}"
    ...attributes
  >{{yield (component TableToolbarContent toolbarSize=@size)}}</section>
</template>;

export default TableToolbar;
