/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { WarningFilled, WarningAltFilled } from '../../icons.ts';
import type { HandlePosition } from '../slider.gts';
import type { TOC } from '@ember/component/template-only';

export interface SliderTextInputSignature {
  Args: {
    handle: HandlePosition;
    suffix: HandlePosition;
    /**
     * Rendered as `data-handle-position`; only set once there are two handles,
     * matching `@carbon/react`.
     */
    dataHandlePosition?: HandlePosition;
    id: string;
    name?: string;
    value: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    disabled?: boolean;
    required?: boolean;
    min: number;
    max: number;
    step?: number;
    readOnly?: boolean;
    invalid?: boolean;
    warn?: boolean;
    hideTextInput?: boolean;
    onChange: (handle: HandlePosition, event: Event) => void;
    onBlur: (handle: HandlePosition, event: FocusEvent) => void;
    onKeyDown: (handle: HandlePosition, event: KeyboardEvent) => void;
  };
}

/**
 * Renders the number input alongside a slider handle. `Slider` invokes this
 * twice (once per handle) with the differing bits — id, name, value,
 * aria-label(ledby), and a `--lower`/`--upper` class suffix — already
 * resolved, so the markup and event wiring only exist once.
 */
const SliderTextInput: TOC<SliderTextInputSignature> = <template>
  <div
    class="cds--text-input-wrapper cds--slider-text-input-wrapper cds--slider-text-input-wrapper--{{@suffix}}
      {{if @readOnly 'cds--text-input-wrapper--readonly'}}
      {{if @hideTextInput 'cds--slider-text-input-wrapper--hidden'}}"
  >
    {{! eslint-disable-next-line ember/template-require-input-label }}
    <input
      type={{if @hideTextInput "hidden" "number"}}
      id={{@id}}
      name={{@name}}
      class="cds--text-input cds--slider-text-input cds--slider-text-input--{{@suffix}}
        {{if @invalid 'cds--text-input--invalid'}}
        {{if @warn 'cds--slider-text-input--warn'}}"
      value={{@value}}
      aria-label={{@ariaLabel}}
      aria-labelledby={{@ariaLabelledby}}
      disabled={{@disabled}}
      required={{@required}}
      min={{@min}}
      max={{@max}}
      step={{@step}}
      readonly={{@readOnly}}
      data-invalid={{if @invalid "true"}}
      data-handle-position={{@dataHandlePosition}}
      aria-invalid={{if @invalid "true"}}
      {{on "change" (fn @onChange @handle)}}
      {{on "input" (fn @onChange @handle)}}
      {{on "blur" (fn @onBlur @handle)}}
      {{on "keydown" (fn @onKeyDown @handle)}}
    />
    {{#if @invalid}}
      <WarningFilled @size="16" @svgClass="cds--slider__invalid-icon" />
    {{else if @warn}}
      <WarningAltFilled
        @size="16"
        @svgClass="cds--slider__invalid-icon cds--slider__invalid-icon--warning"
      />
    {{/if}}
  </div>
</template>;

export default SliderTextInput;
