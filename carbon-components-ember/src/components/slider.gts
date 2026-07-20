import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import { fn, concat } from '@ember/helper';
import { htmlSafe } from '@ember/template';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { and, not, or } from 'ember-truth-helpers';
import { WarningFilled, WarningAltFilled } from '../icons.ts';

export type HandlePosition = 'lower' | 'upper';

export type Args = {
  ariaLabelInput?: string;
  ariaLabelInputUpper?: string;
  disabled?: boolean;
  formatLabel?: (value: number, label?: string) => string;
  hideLabel?: boolean;
  hideTextInput?: boolean;
  id?: string;
  invalid?: boolean;
  invalidText?: string;
  labelText?: string;
  max: number;
  maxLabel?: string;
  min: number;
  minLabel?: string;
  name?: string;
  nameUpper?: string;
  onBlur?: (data: { value: string; handlePosition?: HandlePosition }) => void;
  onChange?: (data: { value: number; valueUpper?: number }) => void;
  onRelease?: (data: { value: number; valueUpper?: number }) => void;
  readOnly?: boolean;
  required?: boolean;
  step?: number;
  stepMultiplier?: number;
  value: number;
  valueUpper?: number;
  warn?: boolean;
  warnText?: string;
};

export interface SliderSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class Slider extends Component<SliderSignature> {
  @tracked activeHandle: HandlePosition = 'lower';
  @tracked editingLower: string | null = null;
  @tracked editingUpper: string | null = null;

  trackElement?: HTMLDivElement;
  lowerThumbElement?: HTMLDivElement;
  upperThumbElement?: HTMLDivElement;

  constructor(owner: any, args: Args) {
    super(owner, args);
    registerDestructor(this, () => this.removeDragListeners());
  }

  get guid() {
    return guidFor(this);
  }

  get id() {
    return this.args.id ?? `slider-${this.guid}`;
  }

  get step() {
    return this.args.step ?? 1;
  }

  get stepMultiplier() {
    return this.args.stepMultiplier ?? 4;
  }

  get twoHandles() {
    return typeof this.args.valueUpper === 'number';
  }

  get decimals() {
    return (this.step.toString().split('.')[1] ?? '').length;
  }

  formatLabel(value?: number, label?: string) {
    if (typeof value === 'undefined') return '';
    if (this.args.formatLabel) return this.args.formatLabel(value, label);
    return `${value}${label ?? ''}`;
  }

  roundToStep(value: number) {
    return Number(value.toFixed(this.decimals));
  }

  clampValue(value: number) {
    return Math.min(this.args.max, Math.max(this.args.min, value));
  }

  clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
  }

  percentFor(value?: number) {
    if (typeof value === 'undefined') return 0;
    const range = this.args.max - this.args.min;
    if (range === 0) return 0;
    return this.clamp01((value - this.args.min) / range) * 100;
  }

  get lowerPercent() {
    return this.percentFor(this.args.value);
  }

  get upperPercent() {
    return this.twoHandles ? this.percentFor(this.args.valueUpper) : 0;
  }

  get lowerThumbStyle() {
    return htmlSafe(`inset-inline-start: ${this.lowerPercent}%;`);
  }

  get upperThumbStyle() {
    return htmlSafe(`inset-inline-start: ${this.upperPercent}%;`);
  }

  get filledTrackStyle() {
    if (this.twoHandles) {
      const scale = (this.upperPercent - this.lowerPercent) / 100;
      return htmlSafe(
        `transform: translate(${this.lowerPercent}%, -50%) scaleX(${scale});`,
      );
    }
    return htmlSafe(
      `transform: translate(0%, -50%) scaleX(${this.lowerPercent / 100});`,
    );
  }

  get lowerDisplayValue() {
    return this.editingLower ?? String(this.args.value ?? '');
  }

  get upperDisplayValue() {
    if (this.twoHandles) {
      return this.editingUpper ?? String(this.args.valueUpper ?? '');
    }
    return this.editingUpper ?? String(this.args.value ?? '');
  }

  discreteValueForPercent(percent: number) {
    const { min, max } = this.args;
    const step = this.step;
    const numSteps = Math.floor((max - min) / step) + 1;
    const stepIndex = Math.round(percent * (numSteps - 1));
    return stepIndex === numSteps - 1 ? max : min + step * stepIndex;
  }

  calcValueFromClientX(clientX: number) {
    if (!this.trackElement) return this.args.min;
    const rect = this.trackElement.getBoundingClientRect();
    let width = rect.right - rect.left;
    if (width <= 0) width = 1;
    const percent = this.clamp01((clientX - rect.left) / width);
    return this.discreteValueForPercent(percent);
  }

  clientXFromEvent(event: MouseEvent | TouchEvent): number | undefined {
    if ('clientX' in event) return event.clientX;
    if ('touches' in event && event.touches[0]) {
      return event.touches[0].clientX;
    }
    if ('changedTouches' in event && event.changedTouches[0]) {
      return event.changedTouches[0].clientX;
    }
    return undefined;
  }

  distanceToHandle(element: HTMLElement | undefined, clientX?: number) {
    if (!element || typeof clientX === 'undefined') return Infinity;
    const rect = element.getBoundingClientRect();
    return Math.abs(rect.left + rect.width / 2 - clientX);
  }

  emitChange(value: number, valueUpper?: number) {
    if (value === this.args.value && valueUpper === this.args.valueUpper) {
      return;
    }
    this.args.onChange?.({ value, valueUpper });
  }

  updateValueForHandle(handle: HandlePosition, value: number) {
    if (this.twoHandles) {
      if (handle === 'lower') {
        const upper = this.args.valueUpper;
        const next = typeof upper === 'number' && value > upper ? upper : value;
        this.emitChange(next, this.args.valueUpper);
      } else {
        const lower = this.args.value;
        const next = typeof lower === 'number' && value < lower ? lower : value;
        this.emitChange(this.args.value, next);
      }
    } else {
      this.emitChange(value, undefined);
    }
  }

  isValidForHandle(handle: HandlePosition, value: number) {
    const { min, max } = this.args;
    if (value < min || value > max) return false;
    if (this.twoHandles) {
      if (handle === 'lower') {
        return (
          typeof this.args.valueUpper !== 'number' ||
          value <= this.args.valueUpper
        );
      }
      return value >= this.args.value;
    }
    return true;
  }

  @action
  registerTrack(element: HTMLDivElement) {
    this.trackElement = element;
  }

  @action
  registerLowerThumb(element: HTMLDivElement) {
    this.lowerThumbElement = element;
  }

  @action
  registerUpperThumb(element: HTMLDivElement) {
    this.upperThumbElement = element;
  }

  removeDragListeners() {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('mouseup', this.onDragStop);
    document.removeEventListener('touchend', this.onDragStop);
    document.removeEventListener('touchcancel', this.onDragStop);
  }

  @action
  onDragStart(event: MouseEvent | TouchEvent) {
    if (this.args.disabled || this.args.readOnly) return;
    event.preventDefault();

    let handle: HandlePosition = 'lower';
    if (this.twoHandles) {
      if (event.target === this.lowerThumbElement) {
        handle = 'lower';
      } else if (event.target === this.upperThumbElement) {
        handle = 'upper';
      } else {
        const clientX = this.clientXFromEvent(event);
        const distanceLower = this.distanceToHandle(
          this.lowerThumbElement,
          clientX,
        );
        const distanceUpper = this.distanceToHandle(
          this.upperThumbElement,
          clientX,
        );
        handle = distanceLower <= distanceUpper ? 'lower' : 'upper';
      }
    }
    this.activeHandle = handle;
    (handle === 'lower' ? this.lowerThumbElement : this.upperThumbElement)?.focus(
      { preventScroll: true },
    );

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('mouseup', this.onDragStop);
    document.addEventListener('touchend', this.onDragStop);
    document.addEventListener('touchcancel', this.onDragStop);

    this.onDrag(event);
  }

  onDrag = (event: MouseEvent | TouchEvent) => {
    if (this.args.disabled || this.args.readOnly) return;
    const clientX = this.clientXFromEvent(event);
    if (typeof clientX === 'undefined') return;
    const value = this.roundToStep(this.calcValueFromClientX(clientX));
    this.updateValueForHandle(this.activeHandle, value);
  };

  onDragStop = () => {
    this.removeDragListeners();
    if (this.args.disabled || this.args.readOnly) return;
    this.args.onRelease?.({
      value: this.args.value,
      valueUpper: this.args.valueUpper,
    });
  };

  @action
  onKeyDown(event: KeyboardEvent) {
    if (this.args.disabled || this.args.readOnly) return;

    let delta = 0;
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      delta = -this.step;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      delta = this.step;
    } else {
      return;
    }
    event.preventDefault();

    if (event.shiftKey) {
      delta *= this.stepMultiplier;
    }

    const handle: HandlePosition = this.twoHandles ? this.activeHandle : 'lower';
    const current =
      handle === 'upper' ? (this.args.valueUpper ?? this.args.min) : this.args.value;
    const newValue = this.clampValue(this.roundToStep(current + delta));
    this.updateValueForHandle(handle, newValue);
  }

  @action
  onLowerFocus() {
    this.activeHandle = 'lower';
  }

  @action
  onUpperFocus() {
    this.activeHandle = 'upper';
  }

  @action
  onInputChange(handle: HandlePosition, event: Event) {
    if (this.args.disabled || this.args.readOnly) return;
    const raw = (event.target as HTMLInputElement).value;
    const num = Number.parseFloat(raw);

    if (Number.isNaN(num)) {
      if (handle === 'lower') this.editingLower = raw;
      else this.editingUpper = raw;
      return;
    }

    if (this.isValidForHandle(handle, num)) {
      if (handle === 'lower') this.editingLower = null;
      else this.editingUpper = null;
      this.updateValueForHandle(handle, this.roundToStep(num));
    } else {
      if (handle === 'lower') this.editingLower = raw;
      else this.editingUpper = raw;
    }
  }

  commitInputValue(handle: HandlePosition, raw: string) {
    const num = Number.parseFloat(raw);
    if (handle === 'lower') this.editingLower = null;
    else this.editingUpper = null;

    if (Number.isNaN(num)) return;

    let adjusted = this.clampValue(num);
    if (this.twoHandles) {
      if (handle === 'lower' && typeof this.args.valueUpper === 'number') {
        adjusted = Math.min(adjusted, this.args.valueUpper);
      }
      if (handle === 'upper') {
        adjusted = Math.max(adjusted, this.args.value);
      }
    }
    this.updateValueForHandle(handle, this.roundToStep(adjusted));
  }

  @action
  onInputBlur(handle: HandlePosition, event: FocusEvent) {
    const raw = (event.target as HTMLInputElement).value;
    this.commitInputValue(handle, raw);
    this.args.onBlur?.({
      value: raw,
      handlePosition: this.twoHandles ? handle : undefined,
    });
  }

  @action
  onInputKeyDown(handle: HandlePosition, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.commitInputValue(handle, (event.target as HTMLInputElement).value);
    }
  }

  <template>
    <div class='cds--form-item {{if @invalid "cds--form-item--invalid"}}' ...attributes>
      <label
        for={{this.id}}
        class='cds--label
          {{if @hideLabel "cds--visually-hidden"}}
          {{if @disabled "cds--label--disabled"}}'
        id='{{this.id}}-label'
      >
        {{@labelText}}
      </label>
      <div
        class='cds--slider-container
          {{if this.twoHandles "cds--slider-container--two-handles"}}
          {{if @disabled "cds--slider-container--disabled"}}
          {{if @readOnly "cds--slider-container--readonly"}}'
      >
        {{#if this.twoHandles}}
          <div
            class='cds--text-input-wrapper cds--slider-text-input-wrapper
              cds--slider-text-input-wrapper--lower
              {{if @readOnly "cds--text-input-wrapper--readonly"}}
              {{if @hideTextInput "cds--slider-text-input-wrapper--hidden"}}'
          >
            {{! template-lint-disable require-input-label }}
            <input
              type={{if @hideTextInput "hidden" "number"}}
              id='{{this.id}}-lower-input-for-slider'
              name={{@name}}
              class='cds--text-input cds--slider-text-input cds--slider-text-input--lower
                {{if @invalid "cds--text-input--invalid"}}'
              value={{this.lowerDisplayValue}}
              aria-label={{@ariaLabelInput}}
              disabled={{@disabled}}
              required={{@required}}
              min={{@min}}
              max={{@max}}
              step={{@step}}
              readonly={{@readOnly}}
              aria-invalid={{if @invalid "true"}}
              {{on 'change' (fn this.onInputChange 'lower')}}
              {{on 'input' (fn this.onInputChange 'lower')}}
              {{on 'blur' (fn this.onInputBlur 'lower')}}
              {{on 'keydown' (fn this.onInputKeyDown 'lower')}}
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
        {{/if}}

        <span class='cds--slider__range-label'>{{this.formatLabel @min @minLabel}}</span>

        <div
          class='cds--slider {{if @disabled "cds--slider--disabled"}} {{if @readOnly "cds--slider--readonly"}}'
          role='presentation'
          tabindex='-1'
          data-invalid={{if @invalid "true"}}
          {{didInsert this.registerTrack}}
          {{! template-lint-disable no-pointer-down-event-binding }}
          {{on 'mousedown' this.onDragStart}}
          {{on 'touchstart' this.onDragStart}}
          {{on 'keydown' this.onKeyDown}}
        >
          <div
            class='cds--icon-tooltip cds--slider__thumb-wrapper
              {{if this.twoHandles "cds--slider__thumb-wrapper--lower"}}'
            style={{this.lowerThumbStyle}}
          >
            {{! template-lint-disable require-presentational-children }}
            <div
              class='cds--slider__thumb {{if this.twoHandles "cds--slider__thumb--lower"}}'
              role='slider'
              id={{unless this.twoHandles this.id}}
              tabindex={{if (or @readOnly @disabled) undefined 0}}
              aria-valuetext={{this.formatLabel @value}}
              aria-valuemax={{if this.twoHandles @valueUpper @max}}
              aria-valuemin={{@min}}
              aria-valuenow={{@value}}
              aria-labelledby={{unless this.twoHandles (concat this.id "-label")}}
              aria-label={{if this.twoHandles @ariaLabelInput}}
              {{didInsert this.registerLowerThumb}}
              {{on 'focus' this.onLowerFocus}}
            >
              {{#if this.twoHandles}}
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
              {{/if}}
            </div>
          </div>

          {{#if this.twoHandles}}
            <div
              class='cds--icon-tooltip cds--slider__thumb-wrapper cds--slider__thumb-wrapper--upper'
              style={{this.upperThumbStyle}}
            >
              {{! template-lint-disable require-presentational-children }}
              <div
                class='cds--slider__thumb cds--slider__thumb--upper'
                role='slider'
                tabindex={{if (or @readOnly @disabled) undefined 0}}
                aria-valuemax={{@max}}
                aria-valuemin={{@value}}
                aria-valuenow={{@valueUpper}}
                aria-label={{@ariaLabelInputUpper}}
                {{didInsert this.registerUpperThumb}}
                {{on 'focus' this.onUpperFocus}}
              >
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
              </div>
            </div>
          {{/if}}

          <div class='cds--slider__track'></div>
          <div class='cds--slider__filled-track' style={{this.filledTrackStyle}}></div>
        </div>

        <span class='cds--slider__range-label'>{{this.formatLabel @max @maxLabel}}</span>

        <div
          class='cds--text-input-wrapper cds--slider-text-input-wrapper
            {{if this.twoHandles "cds--slider-text-input-wrapper--upper"}}
            {{if @readOnly "cds--text-input-wrapper--readonly"}}
            {{if @hideTextInput "cds--slider-text-input-wrapper--hidden"}}'
        >
          {{! template-lint-disable require-input-label }}
          <input
            type={{if @hideTextInput "hidden" "number"}}
            id='{{this.id}}-{{if this.twoHandles "upper-"}}input-for-slider'
            name={{if this.twoHandles @nameUpper @name}}
            class='cds--text-input cds--slider-text-input
              {{if this.twoHandles "cds--slider-text-input--upper"}}
              {{if @invalid "cds--text-input--invalid"}}'
            value={{this.upperDisplayValue}}
            aria-labelledby={{if
              (and (not @ariaLabelInput) (not this.twoHandles))
              (concat this.id "-label")
            }}
            aria-label={{if this.twoHandles @ariaLabelInputUpper @ariaLabelInput}}
            disabled={{@disabled}}
            required={{@required}}
            min={{@min}}
            max={{@max}}
            step={{@step}}
            readonly={{@readOnly}}
            aria-invalid={{if @invalid "true"}}
            {{on
              'change'
              (fn this.onInputChange (if this.twoHandles 'upper' 'lower'))
            }}
            {{on
              'input'
              (fn this.onInputChange (if this.twoHandles 'upper' 'lower'))
            }}
            {{on
              'blur'
              (fn this.onInputBlur (if this.twoHandles 'upper' 'lower'))
            }}
            {{on
              'keydown'
              (fn this.onInputKeyDown (if this.twoHandles 'upper' 'lower'))
            }}
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
      </div>
      {{#if @invalid}}
        <div class='cds--slider__validation-msg cds--slider__validation-msg--invalid cds--form-requirement'>
          {{@invalidText}}
        </div>
      {{else if @warn}}
        <div class='cds--slider__validation-msg cds--form-requirement'>
          {{@warnText}}
        </div>
      {{/if}}
    </div>
  </template>
}
