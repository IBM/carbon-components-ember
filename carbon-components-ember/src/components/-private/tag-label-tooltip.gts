/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Tooltip from '../tooltip.gts';

import type { TOC } from '@ember/component/template-only';

export interface TagLabelTooltipSignature {
  Args: {
    /** Whether the tag's label is cut off. */
    show: boolean;
    label?: string;
    closeOnActivation?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The tooltip Carbon React's OperationalTag and SelectableTag wrap themselves
 * in while their label is cut off, showing it whole.
 */
// eslint-disable-next-line ember/template-require-splattributes -- it renders the caller's tag, or wraps it in a Tooltip
const TagLabelTooltip: TOC<TagLabelTooltipSignature> = <template>
  {{~#if @show~}}
    <Tooltip
      class="cds--icon-tooltip cds--tag-label-tooltip"
      @align="bottom"
      @closeOnActivation={{@closeOnActivation}}
      @label={{@label}}
      @leaveDelayMs={{0}}
    >{{yield}}</Tooltip>
  {{~else~}}
    {{yield}}
  {{~/if~}}
</template>;

export default TagLabelTooltip;
