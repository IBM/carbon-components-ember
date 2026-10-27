/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';

import type { TOC } from '@ember/component/template-only';

/** The list boxes' heights, as Carbon React's `listBoxSizes`. */
export const listBoxSizes = ['xs', 'sm', 'md', 'lg'] as const;

export type ListBoxSize = (typeof listBoxSizes)[number];

export interface ListBoxSignature {
  Element: HTMLDivElement;
  Args: {
    size?: ListBoxSize;
    type?: 'default' | 'inline';
    disabled?: boolean;
    isOpen?: boolean;
    invalid?: boolean;
    invalidText?: string;
    invalidTextId?: string;
    warn?: boolean;
    warnText?: string;
    warnTextId?: string;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The box of a list box field (Dropdown, ComboBox and MultiSelect), with its
 * invalid or warning text after it, as Carbon React's internal `ListBox`.
 */
// As Carbon React's ListBox, every Escape inside the box stops here, so
// closing the menu doesn't also close an enclosing Popover or Modal (nor
// does Escape on a closed field). React's ListBox also stops clicks; that
// would keep an open Popover elsewhere from closing on them, so it doesn't.
const stopEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') event.stopPropagation();
};

const ListBox: TOC<ListBoxSignature> = <template>
  {{! eslint-disable-next-line ember/template-no-invalid-interactive -- the handler only stops Escape, as Carbon React's ListBox does }}
  <div
    class="cds--list-box
      {{if @size (concat 'cds--list-box--' @size ' cds--layout--size-' @size)}}
      {{if (eq @type 'inline') 'cds--list-box--inline'}}
      {{if @disabled 'cds--list-box--disabled'}}
      {{if @isOpen 'cds--list-box--expanded'}}
      {{if @invalid 'cds--list-box--invalid'}}
      {{if (and @warn (not @invalid)) 'cds--list-box--warning'}}"
    data-invalid={{if @invalid "true"}}
    ...attributes
    {{on "keydown" stopEscape}}
  >
    {{yield}}
  </div>
  {{#if @invalid}}
    <div
      id={{@invalidTextId}}
      class="cds--form-requirement"
    >{{@invalidText}}</div>
  {{else if @warn}}
    <div id={{@warnTextId}} class="cds--form-requirement">{{@warnText}}</div>
  {{/if}}
</template>;

export default ListBox;
