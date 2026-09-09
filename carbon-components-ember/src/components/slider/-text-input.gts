/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { concat, fn } from '@ember/helper';
import { WarningFilled, WarningAltFilled } from '../../icons.ts';
import type { HandlePosition } from '../slider.gts';

export interface SliderTextInputArgs {
  handle: HandlePosition;
  suffix?: string;
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
}

export interface SliderTextInputSignature {
  Args: SliderTextInputArgs;
}

/**
 * Renders the number input alongside a slider handle. `Slider` invokes this
 * twice (once per handle) with the differing bits — id, name, value,
 * aria-label(ledby), and a `--lower`/`--upper` class suffix — already
 * resolved, so the markup and event wiring only exist once.
 */
export default class SliderTextInput extends Component<SliderTextInputSignature> {
  <template>
    <div
      class='cds--text-input-wrapper cds--slider-text-input-wrapper
        {{if @suffix (concat "cds--slider-text-input-wrapper--" @suffix)}}
        {{if @readOnly "cds--text-input-wrapper--readonly"}}
        {{if @hideTextInput "cds--slider-text-input-wrapper--hidden"}}'
    >
      {{! template-lint-disable require-input-label }}
      <input
        type={{if @hideTextInput "hidden" "number"}}
        id={{@id}}
        name={{@name}}
        class='cds--text-input cds--slider-text-input
          {{if @suffix (concat "cds--slider-text-input--" @suffix)}}
          {{if @invalid "cds--text-input--invalid"}}'
        value={{@value}}
        aria-label={{@ariaLabel}}
        aria-labelledby={{@ariaLabelledby}}
        disabled={{@disabled}}
        required={{@required}}
        min={{@min}}
        max={{@max}}
        step={{@step}}
        readonly={{@readOnly}}
        aria-invalid={{if @invalid "true"}}
        {{on 'change' (fn @onChange @handle)}}
        {{on 'input' (fn @onChange @handle)}}
        {{on 'blur' (fn @onBlur @handle)}}
        {{on 'keydown' (fn @onKeyDown @handle)}}
      />
      {{#if @invalid}}
        <WarningFilled @size='16' @svgClass='cds--slider__invalid-icon' />
      {{else if @warn}}
        <WarningAltFilled
          @size='16'
          @svgClass='cds--slider__invalid-icon cds--slider__invalid-icon--warning'
        />
      {{/if}}
    </div>
  </template>
}
