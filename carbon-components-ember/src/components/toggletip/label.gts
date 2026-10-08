import type { TOC } from '@ember/component/template-only';

export interface ToggletipLabelSignature {
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * Used to render the label for a `Toggletip`.
 */
const ToggletipLabel: TOC<ToggletipLabelSignature> = <template>
  <span class="cds--toggletip-label" ...attributes>
    {{yield}}
  </span>
</template>;

export default ToggletipLabel;
