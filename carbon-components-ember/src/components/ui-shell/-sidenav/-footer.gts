import { ChevronRight } from '../../../icons.ts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavFooterSignature {
  Element: HTMLButtonElement;
  Args: {
    open?: boolean;
    onToggle: (value: boolean) => void;
  };
}

const UIShellSideNavFooter: TOC<UIShellSideNavFooterSignature> = <template>
  <button
    aria-label={{if @open "Collapse" "Expand"}}
    class="cds--side-nav__footer"
    type="button"
    {{on "click" (fn @onToggle (not @open))}}
    ...attributes
  >
    <div
      class="cds--side-nav__icon cds--side-nav__icon--sm cds--side-nav__toggle
        {{if @open 'cds--side-nav__icon--expanded'}}"
    >
      <ChevronRight />
    </div>
  </button>
</template>;

export default UIShellSideNavFooter;
