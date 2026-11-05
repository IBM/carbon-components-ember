/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import ChevronRight from '../icons/chevron-right.ts';

export interface TableExpandHeaderSignature {
  Element: HTMLTableCellElement;
  Args: {
    /** The `id`s of the `TableExpandedRow`s the button controls, separated by spaces. */
    ariaControls?: string;
    /** Labels the expand button for assistive technology. */
    ariaLabel?: string;
    /** Shows the expand all button, as `enableToggle` does. */
    enableExpando?: boolean;
    /** Shows an expand all button. */
    enableToggle?: boolean;
    /** The expand button's title, and the chevron's label. */
    expandIconDescription?: string;
    /** The `id` of the `<th>`, which each `TableExpandRow`'s `@expandHeader` names. Defaults to `expand`. */
    id?: string;
    /** Whether the rows are expanded. Set it with `@enableToggle`. */
    isExpanded?: boolean;
    /** Called when the expand button is clicked. Set it with `@enableToggle`. */
    onExpand?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The header of the column of `TableExpandRow`'s expand buttons, as Carbon
 * React's `TableExpandHeader`. With `@enableToggle` it renders an expand all
 * button; keep the expanded state and handle `@onExpand` yourself.
 */
export default class TableExpandHeader extends Component<TableExpandHeaderSignature> {
  get showButton() {
    return Boolean(this.args.enableExpando || this.args.enableToggle);
  }

  get ariaExpanded() {
    const { isExpanded } = this.args;
    return isExpanded === undefined ? undefined : String(isExpanded);
  }

  handleExpand = (event: MouseEvent) => {
    this.args.onExpand?.(event);
  };

  <template>
    <th
      scope="col"
      class="cds--table-expand"
      data-previous-value={{if @isExpanded "collapsed"}}
      id={{if @id @id "expand"}}
      ...attributes
    >
      {{#if this.showButton}}
        <button
          type="button"
          class="cds--table-expand__button"
          title={{@expandIconDescription}}
          aria-label={{@ariaLabel}}
          aria-expanded={{this.ariaExpanded}}
          aria-controls={{@ariaControls}}
          {{on "click" this.handleExpand}}
        >
          <ChevronRight
            @size="16"
            @svgClass="cds--table-expand__svg"
            @ariaLabel={{@expandIconDescription}}
          />
        </button>
      {{/if}}
      {{yield}}
    </th>
  </template>
}
