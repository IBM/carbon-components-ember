/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SideNavIcon from './side-nav-icon.gts';
import type { IconComponent } from '../icon.gts';
import type { TOC } from '@ember/component/template-only';

export interface SideNavHeaderSignature {
  Element: HTMLElement;
  Args: {
    /** The icon before the content. */
    renderIcon: IconComponent;
  };
  Blocks: {
    /** Usually `SideNavDetails`. */
    default: [];
  };
}

/** The top of the `SideNav`: an icon and `SideNavDetails`. */
const SideNavHeader: TOC<SideNavHeaderSignature> = <template>
  <header ...attributes class="cds--side-nav__header">
    <SideNavIcon>
      <@renderIcon />
    </SideNavIcon>
    {{yield}}
  </header>
</template>;

export default SideNavHeader;
