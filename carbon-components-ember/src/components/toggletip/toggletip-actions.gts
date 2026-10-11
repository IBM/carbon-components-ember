import type { TOC } from '@ember/component/template-only';

export interface ToggletipActionsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * Container for one or two actions rendered at the base of a `Toggletip`.
 * It is only responsible for the layout of the actions passed in as children.
 */
const ToggletipActions: TOC<ToggletipActionsSignature> = <template>
  <div class="cds--toggletip-actions" ...attributes>
    {{yield}}
  </div>
</template>;

export default ToggletipActions;
