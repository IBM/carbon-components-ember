/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CircleDash from './icons/circle-dash.ts';

import type { TOC } from '@ember/component/template-only';

export interface ProgressIndicatorSkeletonSignature {
  Element: HTMLUListElement;
  Args: {
    /** Stacks the steps vertically. */
    vertical?: boolean;
  };
}

const STEPS = [1, 2, 3, 4];

/** A loading placeholder for a `ProgressIndicator`. */
const ProgressIndicatorSkeleton: TOC<ProgressIndicatorSkeletonSignature> =
  <template>
    <ul
      class="cds--progress cds--skeleton
        {{if @vertical 'cds--progress--vertical'}}"
      ...attributes
    >
      {{#each STEPS}}
        <li class="cds--progress-step cds--progress-step--incomplete">
          <div
            class="cds--progress-step-button cds--progress-step-button--unclickable"
          >
            <CircleDash
              @size="16"
              @svgClass="cds--progress-indicator-skeleton__icon"
            />
            <p class="cds--progress-label"></p>
            <span class="cds--progress-line"></span>
          </div>
        </li>
      {{/each}}
    </ul>
  </template>;

export default ProgressIndicatorSkeleton;
