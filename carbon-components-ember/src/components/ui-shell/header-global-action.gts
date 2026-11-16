/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Button from '../button.gts';
import type { ButtonSignature } from '../button.gts';
import type { TOC } from '@ember/component/template-only';

export interface HeaderGlobalActionSignature {
  Element: ButtonSignature['Element'];
  Args: {
    /** Names the button, in its tooltip, as Carbon React's `aria-label`. */
    ariaLabel?: string;
    /** Shows it as active, while the panel it opens is open. */
    isActive?: boolean;
    tooltipAlignment?: ButtonSignature['Args']['tooltipAlignment'];
    tooltipDropShadow?: ButtonSignature['Args']['tooltipDropShadow'];
    tooltipHighContrast?: ButtonSignature['Args']['tooltipHighContrast'];
  };
  Blocks: {
    /** The icon, at 20px: `<Search @size={{20}} />`. */
    default: [];
  };
}

/**
 * An icon button in the `HeaderGlobalBar`, with a tooltip below it. Handle
 * its click with `{{on "click"}}`.
 */
const HeaderGlobalAction: TOC<HeaderGlobalActionSignature> = <template>
  <Button
    aria-label={{@ariaLabel}}
    ...attributes
    class="cds--header__action {{if @isActive 'cds--header__action--active'}}"
    type="button"
    @hasIconOnly={{true}}
    @size="lg"
    @kind="ghost"
    @iconDescription={{@ariaLabel}}
    @tooltipPosition="bottom"
    @tooltipAlignment={{@tooltipAlignment}}
    @tooltipDropShadow={{@tooltipDropShadow}}
    @tooltipHighContrast={{@tooltipHighContrast}}
  >
    {{~yield~}}
  </Button>
</template>;

export default HeaderGlobalAction;
