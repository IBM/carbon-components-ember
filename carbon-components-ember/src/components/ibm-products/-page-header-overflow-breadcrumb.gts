/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type PageHeaderBreadcrumbOverflow from './page-header-breadcrumb-overflow.gts';
import type { TOC } from '@ember/component/template-only';

interface OverflowBreadcrumbSignature {
  Args: {
    overflow: PageHeaderBreadcrumbOverflow;
  };
}

// The breadcrumb of the ones that don't fit, which Carbon for IBM Products
// clones to give it `data-fixed` and its classes.
// eslint-disable-next-line ember/template-require-splattributes -- renders the app's component, which takes the attributes
const OverflowBreadcrumb: TOC<OverflowBreadcrumbSignature> = <template>
  {{#if @overflow.args.renderOverflowBreadcrumb}}
    <@overflow.args.renderOverflowBreadcrumb
      @hiddenBreadcrumbs={{@overflow.hiddenBreadcrumbs}}
      data-fixed="true"
      class="c4p--page-header-breadcrumb-overflow-item
        {{if
          @overflow.hiddenBreadcrumbs.length
          'c4p--page-header-overflow-breadcrumb-item-with-items'
        }}"
    />
  {{/if}}
</template>;

export default OverflowBreadcrumb;
