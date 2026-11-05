/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SideNavDetailsSignature {
  Element: HTMLDivElement;
  Args: {
    /** The heading. */
    title: string;
  };
  Blocks: {
    /** Content under the heading, such as a `SideNavSwitcher`. */
    default: [];
  };
}

/**
 * A heading for the `SideNav`, in its `SideNavHeader`. Carbon's stylesheet
 * no longer styles it, as Carbon React's Storybook has no story for it.
 */
const SideNavDetails: TOC<SideNavDetailsSignature> = <template>
  <div ...attributes class="cds--side-nav__details">
    <h2 class="cds--side-nav__title" title={{@title}}>{{@title}}</h2>
    {{yield}}
  </div>
</template>;

export default SideNavDetails;
