/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { isTruncated } from '../../../utils/truncation.ts';

export interface ListBoxMenuItemSignature {
  Element: HTMLLIElement;
  Args: {
    isActive?: boolean;
    isHighlighted?: boolean;
    /** Styles the item as one that can't be chosen. */
    disabled?: boolean;
    /** Shown as the item's tooltip when its text is cut off. */
    title?: string;
  };
  Blocks: {
    default: [];
  };
}

// Carbon's styles select a `disabled` attribute, which an `<li>` has no
// property for.
const disabledAttribute = modifier(
  (option: HTMLElement, [disabled]: [disabled: boolean | undefined]) => {
    option.toggleAttribute('disabled', Boolean(disabled));
  },
);

export default class ListBoxMenuItem extends Component<ListBoxMenuItemSignature> {
  @tracked isTruncated = false;

  // Re-measures when the title (the item's text) changes.
  measure = modifier(
    (option: HTMLElement, [title]: [title: string | undefined]) => {
      this.isTruncated = title !== undefined && isTruncated(option);
    },
  );

  <template>
    <li
      class="cds--list-box__menu-item
        {{if @isActive 'cds--list-box__menu-item--active'}}
        {{if @isHighlighted 'cds--list-box__menu-item--highlighted'}}"
      title={{if this.isTruncated @title}}
      ...attributes
      {{disabledAttribute @disabled}}
    >
      <div class="cds--list-box__menu-item__option" {{this.measure @title}}>
        {{yield}}
      </div>
    </li>
  </template>
}
