import { PopoverContent } from '../popover.gts';

import type { TOC } from '@ember/component/template-only';
import type { PopoverContentSignature } from '../popover.gts';

export interface ToggletipContentSignature {
  Args: {
    id: string;
  };
  Element: PopoverContentSignature['Element'];
  Blocks: {
    default: [];
  };
}

/**
 * Renders the popover content of a `Toggletip`. Yielded by `Toggletip` as
 * `t.Content`.
 */
const ToggletipContent: TOC<ToggletipContentSignature> = <template>
  <PopoverContent id={{@id}} ...attributes>
    <div class="cds--toggletip-content">
      {{yield}}
    </div>
  </PopoverContent>
</template>;

export default ToggletipContent;
