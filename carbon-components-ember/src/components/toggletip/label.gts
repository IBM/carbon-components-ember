import type { TOC } from '@ember/component/template-only';

export interface ToggletipLabelComponentSignature {
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * Used to render the label for a `Toggletip`.
 */
const ToggletipLabelComponent: TOC<ToggletipLabelComponentSignature> =
  <template>
    <span class="cds--toggletip-label" ...attributes>
      {{yield}}
    </span>
  </template>;

export default ToggletipLabelComponent;
