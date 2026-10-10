/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface BreadcrumbSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** How many items to show. Defaults to 3. */
    items?: number;
    /** Leaves out the slash after the last item. */
    noTrailingSlash?: boolean;
    size?: 'sm' | 'md';
  };
}

/** A loading placeholder for a `Breadcrumbs` trail. */
export default class BreadcrumbSkeleton extends Component<BreadcrumbSkeletonSignature> {
  get items() {
    return Array.from({ length: this.args.items ?? 3 });
  }

  <template>
    <div
      class="cds--breadcrumb cds--skeleton
        {{if @noTrailingSlash 'cds--breadcrumb--no-trailing-slash'}}
        {{if (eq @size 'sm') 'cds--breadcrumb--sm'}}"
      ...attributes
    >
      {{#each this.items}}
        <div class="cds--breadcrumb-item">
          <span class="cds--link">&nbsp;</span>
        </div>
      {{/each}}
    </div>
  </template>
}
