/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import BreadcrumbItem from './breadcrumb/breadcrumb-item.gts';
import type { TOC } from '@ember/component/template-only';

export interface BreadcrumbSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Optional prop to omit the trailing slash for the breadcrumbs
     */
    noTrailingSlash?: boolean;
    /**
     * Specify the size of the Breadcrumb. Currently supports the following:
     * `sm` & `md` (default: 'md')
     */
    size?: 'sm' | 'md';
  };
  Blocks: {
    /** The trail: the yielded `BreadcrumbItem`s. */
    default: [BreadcrumbItem: typeof BreadcrumbItem];
  };
}

const Breadcrumb: TOC<BreadcrumbSignature> = <template>
  <nav aria-label="Breadcrumb" ...attributes>
    <ol
      class="cds--breadcrumb
        {{if @noTrailingSlash 'cds--breadcrumb--no-trailing-slash'}}
        {{if (eq @size 'sm') 'cds--breadcrumb--sm'}}"
    >
      {{yield BreadcrumbItem}}
    </ol>
  </nav>
</template>;

export default Breadcrumb;
