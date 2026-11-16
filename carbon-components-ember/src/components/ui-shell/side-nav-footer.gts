/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ChevronRight from '../icons/chevron-right.ts';
import Close from '../icons/close.ts';
import type { TOC } from '@ember/component/template-only';

export interface SideNavFooterSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Names the toggle. Defaults to "Toggle opening or closing the side
     * navigation".
     */
    assistiveText?: string;
    /** Whether the side nav is open; its toggle then shows a close icon. */
    expanded: boolean;
    /** Called when the toggle is clicked. */
    onToggle: (event: MouseEvent) => void;
  };
}

/**
 * A toggle at the bottom of the `SideNav` that opens and closes it. Carbon's
 * stylesheet no longer styles it, and Carbon React leaves it out of its
 * `SideNav` until rails have a footer.
 */
const SideNavFooter: TOC<SideNavFooterSignature> = <template>
  {{#let
    (if
      (eq @assistiveText undefined)
      "Toggle opening or closing the side navigation"
      @assistiveText
    )
    as |text|
  ~}}
    <footer ...attributes class="cds--side-nav__footer">
      <button
        class="cds--side-nav__toggle"
        type="button"
        title={{text}}
        {{on "click" @onToggle}}
      >
        <div class="cds--side-nav__icon">
          {{#if @expanded}}
            <Close @size={{20}} />
          {{else}}
            <ChevronRight @size={{20}} />
          {{/if}}
        </div>
        <span class="cds--assistive-text">{{text}}</span>
      </button>
    </footer>
  {{~/let}}
</template>;

export default SideNavFooter;
