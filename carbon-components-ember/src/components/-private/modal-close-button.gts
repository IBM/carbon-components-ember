/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Tooltip from '../tooltip.gts';
import Close from '../icons/close.ts';
import type { TOC } from '@ember/component/template-only';

export interface ModalCloseButtonSignature {
  Element: HTMLDivElement;
  Args: {
    label: string;
    onClick: (event: MouseEvent) => void;
    /** A class for the button. */
    className?: string;
    /** A class for its icon. */
    iconClassName?: string;
  };
}

// A modal header's close button: Carbon React's IconButton, with its tooltip.
const ModalCloseButton: TOC<ModalCloseButtonSignature> = <template>
  <div class="cds--modal-close-button" ...attributes>
    <Tooltip @label={{@label}} @align="left" class="cds--icon-tooltip">
      <button
        class="cds--modal-close cds--btn cds--btn--primary cds--btn--icon-only
          {{@className}}"
        type="button"
        aria-label={{@label}}
        {{on "click" @onClick}}
      >
        <Close
          @size="20"
          @svgClass="cds--modal-close__icon {{@iconClassName}}"
        />
      </button>
    </Tooltip>
  </div>
</template>;

export default ModalCloseButton;
