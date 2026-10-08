import type { TOC } from '@ember/component/template-only';

export interface ToggletipContentSignature {
  Args: {
    id: string;
  };
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * Renders the popover content of a `Toggletip`. Yielded by `Toggletip` as
 * `t.Content`.
 */
const ToggletipContent: TOC<ToggletipContentSignature> = <template>
  <span class="cds--popover">
    <span id={{@id}} class="cds--popover-content" ...attributes>
      <div class="cds--toggletip-content">
        {{yield}}
      </div>
    </span>
    <span class="cds--popover-caret"></span>
  </span>
</template>;

export default ToggletipContent;
