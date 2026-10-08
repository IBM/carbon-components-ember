/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface DatePickerSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
    /** Shows two inputs, for a date range. */
    range?: boolean;
  };
}

const SINGLE = [1];
const RANGE = [1, 2];

/** A loading placeholder for a `DatePicker`. */
const DatePickerSkeleton: TOC<DatePickerSkeletonSignature> = <template>
  <div class="cds--form-item">
    <div
      class="cds--date-picker cds--skeleton
        {{if
          @range
          'cds--date-picker--range'
          'cds--date-picker--short cds--date-picker--simple'
        }}"
      ...attributes
    >
      {{#each (if @range RANGE SINGLE)}}
        <div class="cds--date-picker-container">
          {{#unless @hideLabel}}
            <span class="cds--label"></span>
          {{/unless}}
          <div class="cds--date-picker__input cds--skeleton"></div>
        </div>
      {{/each}}
    </div>
  </div>
</template>;

export default DatePickerSkeleton;
