/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { concat } from '@ember/helper';
import type { SafeString } from '@ember/template';
import { modifier } from 'ember-modifier';
import { eq } from 'ember-truth-helpers';
import type { HandlePosition } from '../slider.gts';

const registerElement = modifier<{
  Element: HTMLDivElement;
  Args: { Positional: [(element: HTMLDivElement) => void] };
}>((element, [onInsert]) => {
  onInsert(element);
});

export interface SliderThumbArgs {
  position: HandlePosition;
  twoHandles: boolean;
  style: SafeString;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  ariaValueText?: string;
  ariaValueMax?: number;
  ariaValueMin?: number;
  ariaValueNow?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  onFocus: () => void;
  registerElement: (element: HTMLDivElement) => void;
}

export interface SliderThumbSignature {
  Args: SliderThumbArgs;
}

/**
 * Renders a single slider handle (thumb), used once per handle position by
 * `Slider`. The lower and upper handles differ only in a `--lower`/`--upper`
 * class suffix and which resolved values each reads, so `Slider` resolves
 * those differences into plain args and this component only renders markup.
 */
export default class SliderThumb extends Component<SliderThumbSignature> {
  get suffix() {
    return this.args.twoHandles ? this.args.position : '';
  }

  get tabindex() {
    return this.args.readOnly || this.args.disabled ? undefined : 0;
  }

  <template>
    <div
      class='cds--icon-tooltip cds--slider__thumb-wrapper
        {{if this.suffix (concat "cds--slider__thumb-wrapper--" this.suffix)}}'
      style={{@style}}
    >
      {{! template-lint-disable require-presentational-children }}
      <div
        class='cds--slider__thumb
          {{if this.suffix (concat "cds--slider__thumb--" this.suffix)}}'
        role='slider'
        id={{@id}}
        tabindex={{this.tabindex}}
        aria-valuetext={{@ariaValueText}}
        aria-valuemax={{@ariaValueMax}}
        aria-valuemin={{@ariaValueMin}}
        aria-valuenow={{@ariaValueNow}}
        aria-labelledby={{@ariaLabelledby}}
        aria-label={{@ariaLabel}}
        {{registerElement @registerElement}}
        {{on 'focus' @onFocus}}
      >
        {{#if @twoHandles}}
          {{#if (eq @position 'lower')}}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 24'
              class='cds--slider__thumb-icon cds--slider__thumb-icon--lower'
            >
              <path
                d='M15.08 6.46H16v11.08h-.92zM4.46 17.54c-.25 0-.46-.21-.46-.46V6.92a.465.465 0 0 1 .69-.4l8.77 5.08a.46.46 0 0 1 0 .8l-8.77 5.08c-.07.04-.15.06-.23.06Z'
              />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 24'
              class='cds--slider__thumb-icon cds--slider__thumb-icon--lower cds--slider__thumb-icon--focus'
            >
              <path
                d='M15.08 6.46H16v11.08h-.92zM4.46 17.54c-.25 0-.46-.21-.46-.46V6.92a.465.465 0 0 1 .69-.4l8.77 5.08a.46.46 0 0 1 0 .8l-8.77 5.08c-.07.04-.15.06-.23.06Z'
              />
              <path d='M15.08 0H16v6.46h-.92z' />
              <path d='M0 0h.92v24H0zM15.08 0H16v24h-.92z' />
              <path d='M0 .92V0h16v.92zM0 24v-.92h16V24z' />
            </svg>
          {{else}}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 24'
              class='cds--slider__thumb-icon cds--slider__thumb-icon--upper'
            >
              <path
                d='M0 6.46h.92v11.08H0zM11.54 6.46c.25 0 .46.21.46.46v10.15a.465.465 0 0 1-.69.4L2.54 12.4a.46.46 0 0 1 0-.8l8.77-5.08c.07-.04.15-.06.23-.06Z'
              />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 24'
              class='cds--slider__thumb-icon cds--slider__thumb-icon--upper cds--slider__thumb-icon--focus'
            >
              <path
                d='M0 6.46h.92v11.08H0zM11.54 6.46c.25 0 .46.21.46.46v10.15a.465.465 0 0 1-.69.4L2.54 12.4a.46.46 0 0 1 0-.8l8.77-5.08c.07-.04.15-.06.23-.06Z'
              />
              <path d='M.92 24H0v-6.46h.92z' />
              <path d='M16 24h-.92V0H16zM.92 24H0V0h.92z' />
              <path d='M16 23.08V24H0v-.92zM16 0v.92H0V0z' />
            </svg>
          {{/if}}
        {{/if}}
      </div>
    </div>
  </template>
}
