/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';
import type { WithBoundArgs } from '@glint/template';
import StructuredListRow from './structured-list-row.gts';

export interface StructuredListWrapperSignature {
  Element: HTMLDivElement;
  Args: {
    /** Condenses the rows. */
    isCondensed?: boolean;
    /** Removes the outer columns' side padding. No effect with `@selection`. */
    isFlush?: boolean;
    /**
     * Styles it for selecting one row. Give each row `@selection` too, for
     * its radio icon, and a `StructuredListInput`.
     */
    selection?: boolean;
    /** The `@id` of the row selected at first. */
    selectedInitialRow?: string;
  };
  Blocks: {
    default: [
      StructuredListRow: WithBoundArgs<typeof StructuredListRow, 'wrapper'>,
    ];
  };
}

/**
 * A table of rows, as Carbon React's `StructuredListWrapper`. It yields
 * `StructuredListRow`, which goes in a `StructuredListHead` or
 * `StructuredListBody` and holds `StructuredListCell`s. Name it with
 * `aria-label`; it defaults to "Structured list section".
 */
export default class StructuredListWrapper extends Component<StructuredListWrapperSignature> {
  @tracked selectedRow: string | null;

  constructor(owner: Owner, args: StructuredListWrapperSignature['Args']) {
    super(owner, args);
    this.selectedRow = args.selectedInitialRow ?? null;
  }

  selectRow = (id: string) => {
    this.selectedRow = id;
  };

  <template>
    <div
      role="table"
      aria-label="Structured list section"
      ...attributes
      class="cds--structured-list
        {{if @selection 'cds--structured-list--selection'}}
        {{if @isCondensed 'cds--structured-list--condensed'}}
        {{if (and @isFlush (not @selection)) 'cds--structured-list--flush'}}"
    >
      {{yield (component StructuredListRow wrapper=this)}}
    </div>
  </template>
}
