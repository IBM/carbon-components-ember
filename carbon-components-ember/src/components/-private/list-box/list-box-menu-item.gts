/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

export interface ListBoxMenuItemSignature {
  Element: HTMLLIElement;
  Args: {
    isActive?: boolean;
    isHighlighted?: boolean;
    /** Shown as the item's tooltip when its text is cut off. */
    title?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class ListBoxMenuItem extends Component<ListBoxMenuItemSignature> {
  @tracked isTruncated = false;

  // Re-measures when the title (the item's text) changes.
  measure = modifier(
    (option: HTMLElement, [title]: [title: string | undefined]) => {
      this.isTruncated =
        title !== undefined && option.offsetWidth < option.scrollWidth;
    },
  );

  <template>
    <li
      class="cds--list-box__menu-item
        {{if @isActive 'cds--list-box__menu-item--active'}}
        {{if @isHighlighted 'cds--list-box__menu-item--highlighted'}}"
      title={{if this.isTruncated @title}}
      ...attributes
    >
      <div class="cds--list-box__menu-item__option" {{this.measure @title}}>
        {{yield}}
      </div>
    </li>
  </template>
}
