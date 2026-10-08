/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface StructuredListSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Defaults to 5. */
    rowCount?: number;
  };
}

/** A loading placeholder for a `StructuredList`. */
export default class StructuredListSkeleton extends Component<StructuredListSkeletonSignature> {
  get rows() {
    return Array.from({ length: this.args.rowCount ?? 5 });
  }

  <template>
    <div class="cds--skeleton cds--structured-list" ...attributes>
      <div class="cds--structured-list-thead">
        <div
          class="cds--structured-list-row cds--structured-list-row--header-row"
        >
          <div class="cds--structured-list-th"><span></span></div>
          <div class="cds--structured-list-th"><span></span></div>
          <div class="cds--structured-list-th"><span></span></div>
        </div>
      </div>
      <div class="cds--structured-list-tbody">
        {{#each this.rows}}
          <div class="cds--structured-list-row">
            <div class="cds--structured-list-td"></div>
            <div class="cds--structured-list-td"></div>
            <div class="cds--structured-list-td"></div>
          </div>
        {{/each}}
      </div>
    </div>
  </template>
}
