/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import type ToggletipContent from '../toggletip/content.gts';
import type { ToggletipContentSignature } from '../toggletip/content.gts';

export interface AILabelContentSignature {
  Element: ToggletipContentSignature['Element'];
  Args: {
    /** The AI label's toggletip content, already bound to it. */
    Content: WithBoundArgs<typeof ToggletipContent, 'id'>;
  };
  Blocks: {
    default: [];
  };
}

const AILabelContent: TOC<AILabelContentSignature> = <template>
  <@Content class="cds--ai-label-content" ...attributes>
    {{yield}}
  </@Content>
</template>;

export default AILabelContent;
