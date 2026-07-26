/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

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
export default class ListItem extends Component<ListItemSignature> {
  <template>
    <li class='cds--list__item' ...attributes>
      {{yield}}
    </li>
  </template>
}
