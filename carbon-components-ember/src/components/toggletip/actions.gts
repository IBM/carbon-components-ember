import type { TOC } from '@ember/component/template-only';

export interface ToggletipActionsComponentSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * Container for one or two actions rendered at the base of a `Toggletip`.
 * It is only responsible for the layout of the actions passed in as children.
 */
const ToggletipActionsComponent: TOC<ToggletipActionsComponentSignature> =
  <template>
    <div class="cds--toggletip-actions" ...attributes>
      {{yield}}
    </div>
  </template>;

export default ToggletipActionsComponent;
