/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface ListItemSignature {
  Element: HTMLLIElement;
  Blocks: {
    /**
     * Specify the content for the ListItem
     */
    default: [];
  };
}

/**
 * A single item within an `OrderedList` or `UnorderedList`.
 *
 * ```gjs
 * import ListItem from 'carbon-components-ember/components/list-item';
 * import OrderedList from 'carbon-components-ember/components/ordered-list';
 *
 * <template>
 *   <OrderedList>
 *     <ListItem>Item 1</ListItem>
 *     <ListItem>Item 2</ListItem>
 *   </OrderedList>
 * </template>
 * ```
 */
const ListItem: TOC<ListItemSignature> = <template>
  <li class="cds--list__item" dir="auto" ...attributes>
    {{yield}}
  </li>
</template>;

export default ListItem;
