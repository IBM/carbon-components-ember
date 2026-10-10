/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TabsSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Shows contained tabs. */
    contained?: boolean;
  };
}

const TABS = [1, 2, 3, 4, 5];

/**
 * A loading placeholder for `Tabs`. `Tabs` can also show it through
 * `@loading`.
 */
const TabsSkeleton: TOC<TabsSkeletonSignature> = <template>
  <div
    class="cds--tabs cds--skeleton {{if @contained 'cds--tabs--contained'}}"
    ...attributes
  >
    <ul class="cds--tabs__nav">
      {{#each TABS}}
        <li class="cds--tabs__nav-item">
          <div class="cds--tabs__nav-link">
            <span></span>
          </div>
        </li>
      {{/each}}
    </ul>
  </div>
</template>;

export default TabsSkeleton;
