/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ToggletipActions from '../toggletip/actions.gts';

import type { TOC } from '@ember/component/template-only';
import type { ToggletipActionsSignature } from '../toggletip/actions.gts';

export interface AILabelActionsSignature {
  Element: ToggletipActionsSignature['Element'];
  Blocks: {
    default: [];
  };
}

const AILabelActions: TOC<AILabelActionsSignature> = <template>
  <ToggletipActions class="cds--ai-label-actions" ...attributes>
    {{yield}}
  </ToggletipActions>
</template>;

export default AILabelActions;
