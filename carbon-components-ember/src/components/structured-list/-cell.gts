import type { TOC } from '@ember/component/template-only';
/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StructuredListCellSignature {
  Element: HTMLDivElement | HTMLSpanElement;
  Args: {
    head?: boolean;
    noWrap?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const StructuredListCell: TOC<StructuredListCellSignature> = <template>
  {{! Matches @carbon/react, which renders both cells through its Text
    component: a head cell uses Text's default span tag, a body cell passes
    as div, and both get Text's default dir auto. }}
  {{#if @head}}
    <span
      role="columnheader"
      dir="auto"
      class="cds--structured-list-th
        {{if @noWrap 'cds--structured-list-content--nowrap'}}"
      ...attributes
    >
      {{yield}}
    </span>
  {{else}}
    <div
      role="cell"
      dir="auto"
      class="cds--structured-list-td
        {{if @noWrap 'cds--structured-list-content--nowrap'}}"
      ...attributes
    >
      {{yield}}
    </div>
  {{/if}}
</template>;

export default StructuredListCell;
