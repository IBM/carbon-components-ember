import Tooltip from '../tooltip.gts';
import ButtonBase from './button-base.gts';
import type { TOC } from '@ember/component/template-only';
import type { ButtonSignature } from '../button.gts';
import type { PopoverAlignment } from '../popover.gts';

export interface CopyTriggerSignature {
  Element: ButtonSignature['Element'];
  Args: {
    align: PopoverAlignment;
    autoAlign?: boolean;
    disabled?: boolean;
    /** The tooltip, which names the button. */
    label: string;
    /** How long the tooltip stays after the pointer leaves. */
    leaveDelayMs: number;
    size?: ButtonSignature['Args']['size'];
  };
  Blocks: {
    default: [];
  };
}

// Carbon React's Copy, for Copy and CopyButton: an icon button named by its
// tooltip, which stays open on a click to show the feedback.
const CopyTrigger: TOC<CopyTriggerSignature> = <template>
  <Tooltip
    class="cds--icon-tooltip {{if @disabled 'cds--icon-tooltip--disabled'}}"
    @align={{@align}}
    @autoAlign={{@autoAlign}}
    @label={{@label}}
    @closeOnActivation={{false}}
    @leaveDelayMs={{@leaveDelayMs}}
  >
    <ButtonBase
      @kind="primary"
      @hasIconOnly={{true}}
      @size={{@size}}
      @disabled={{@disabled}}
      class="cds--copy"
      ...attributes
    >
      {{yield}}
    </ButtonBase>
  </Tooltip>
</template>;

export default CopyTrigger;
