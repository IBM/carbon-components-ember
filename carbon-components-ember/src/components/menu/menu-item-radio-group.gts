/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import MenuItem from './menu-item.gts';

export interface MenuItemRadioGroupSignature<Item = string> {
  Element: HTMLLIElement;
  Args: {
    /**
     * A required label titling this radio group.
     */
    label: string;
    /**
     * Provide the options for this radio group. Can be of any type, as
     * long as you provide an appropriate `@itemToString` function.
     */
    items: Item[];
    /**
     * Converts an item into a string for display. Defaults to `String(item)`.
     */
    itemToString?: (item: Item) => string;
    /**
     * Specify the default selected item.
     */
    defaultSelectedItem?: Item;
    /**
     * Provide `@selectedItem` to control the state of this radio group.
     */
    selectedItem?: Item;
    /**
     * Provide an optional function to be called when the selection changes.
     */
    onChange?: (selectedItem: Item) => void;
  };
}

export default class MenuItemRadioGroup<
  Item = string,
> extends Component<MenuItemRadioGroupSignature<Item>> {
  // Seeds the uncontrolled default once; `select()` and `@selectedItem`
  // drive subsequent state, matching MenuItemSelectable/TreeNode's pattern.
  // eslint-disable-next-line ember/no-tracked-properties-from-args
  @tracked uncontrolledSelection = this.args.defaultSelectedItem;

  get selection() {
    return this.args.selectedItem ?? this.uncontrolledSelection;
  }

  get entries() {
    const toString = this.args.itemToString ?? ((item: Item) => String(item));
    return (this.args.items ?? []).map((item) => ({
      item,
      label: toString(item),
      checked: item === this.selection,
    }));
  }

  @action
  select(item: Item) {
    this.uncontrolledSelection = item;
    this.args.onChange?.(item);
  }

  <template>
    <li class='cds--menu-item-radio-group' role='none' ...attributes>
      <ul role='group' aria-label={{@label}}>
        {{#each this.entries as |entry|}}
          <MenuItem
            @label={{entry.label}}
            @role='menuitemradio'
            @ariaChecked={{entry.checked}}
            @onClick={{fn this.select entry.item}}
          />
        {{/each}}
      </ul>
    </li>
  </template>
}
