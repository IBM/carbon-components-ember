/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import AILabel from './ai-label.gts';
import SelectItem from './select-item.gts';
import ChevronDown from './icons/chevron-down.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import WarningFilled from './icons/warning-filled.ts';
import { afterRender } from '../utils/after-render.ts';
import type { WithBoundArgs } from '@glint/template';

export interface SelectSignature {
  Element: HTMLSelectElement;
  Args: {
    /**
     * Specify an optional className to be applied to the node containing the
     * label and the select box. Attributes go to the `<select>`.
     */
    className?: string;
    /**
     * Optionally provide the default value of the `<select>`
     */
    defaultValue?: string | number;
    /**
     * Specify whether the control is disabled
     */
    disabled?: boolean;
    /**
     * Provide text that is used alongside the control label for additional
     * help
     */
    helperText?: string;
    /**
     * Specify whether the label should be hidden, or not
     */
    hideLabel?: boolean;
    /**
     * Specify a custom `id` for the `<select>`
     */
    id?: string;
    /**
     * Specify whether you want the inline version of this control
     */
    inline?: boolean;
    /**
     * Specify if the currently value is invalid.
     */
    invalid?: boolean;
    /**
     * Message which is displayed if the value is invalid.
     */
    invalidText?: string;
    /**
     * Provide label text to be read by screen readers when interacting with
     * the control.
     */
    labelText?: string;
    /**
     * Reserved for use with Pagination component. Will not render a label for
     * the select since Pagination renders one for us.
     */
    noLabel?: boolean;
    /**
     * Provide an optional `onChange` hook that is called each time the value
     * of the underlying `<select>` changes.
     */
    onChange?: (value: string, event: Event) => void;
    /**
     * Whether the select should be read-only
     */
    readOnly?: boolean;
    /**
     * Specify the size of the Select Input.
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * The value of the `<select>`. While it's set, the select shows it, and
     * goes back to it after a change `@onChange` doesn't pass back.
     */
    value?: string | number;
    /**
     * Specify whether the control is currently in warning state
     */
    warn?: boolean;
    /**
     * Provide the text that is displayed when the control is in warning state
     */
    warnText?: string;
  };
  Blocks: {
    /**
     * The options: the yielded `SelectItem`, optionally grouped in
     * `SelectItemGroup`s. It keeps `@value` selected as the options change.
     */
    default: [SelectItem: WithBoundArgs<typeof SelectItem, 'select'>];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * field. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

// Selects a value the way React does for a single <select>: the option with
// that value, or else the first enabled one. A default value also becomes
// that option's default, which a form reset goes back to.
function selectValue(
  select: HTMLSelectElement,
  value: string | number,
  isDefault = false,
) {
  const options = Array.from(select.options);
  const match = options.find((option) => option.value === String(value));
  if (match) {
    match.selected = true;
    if (isDefault) match.defaultSelected = true;
    return;
  }
  const firstEnabled = options.find((option) => !option.disabled);
  if (firstEnabled) firstEnabled.selected = true;
}

// Carbon titles the select with the selected option's text, or the first
// option's.
const selectedText = (select: HTMLSelectElement) =>
  select.options[select.selectedIndex]?.text || select.options[0]?.text || '';

export default class Select extends Component<SelectSignature> {
  @tracked title?: string;

  // Toggling `@inline` renders a new <select>.
  selectElement?: HTMLSelectElement;

  // React applies `@defaultValue` to each <select> it mounts.
  defaulted = new WeakSet<HTMLSelectElement>();

  resyncing = false;

  get id() {
    return this.args.id ?? `select-${guidFor(this)}`;
  }

  get labelText() {
    return this.args.labelText ?? 'Select';
  }

  // As Carbon normalizes them: read-only wins over disabled, and both win
  // over invalid and warn.
  get disabled() {
    return !this.args.readOnly && !!this.args.disabled;
  }

  get invalid() {
    return !this.args.readOnly && !this.args.disabled && !!this.args.invalid;
  }

  get warn() {
    return (
      !this.args.readOnly &&
      !this.args.invalid &&
      !this.args.disabled &&
      !!this.args.warn
    );
  }

  get invalidId() {
    return `${this.id}-error-msg`;
  }

  get warnId() {
    return `${this.id}-warn-msg`;
  }

  get helperId() {
    return `${this.id}-helper-text`;
  }

  // The invalid or warning text replaces the helper text, except inline,
  // where it shows in the field's wrapper instead.
  get showHelper() {
    return (
      !!this.args.helperText &&
      (!!this.args.inline || (!this.invalid && !this.warn))
    );
  }

  get describedBy() {
    if (this.invalid) return this.invalidId;
    if (this.warn) return this.warnId;
    if (!this.args.inline && this.args.helperText) return this.helperId;
    return undefined;
  }

  get sizeClasses() {
    const { size } = this.args;
    return size ? `cds--select--${size} cds--layout--size-${size}` : undefined;
  }

  // The options render after the <select>'s attributes are set, so a value
  // attribute would find nothing to select. Select it once they're in, and
  // whenever `@value` changes.
  syncValue = modifier(
    (
      select: HTMLSelectElement,
      [value]: [value: string | number | undefined],
    ) => {
      if (value !== undefined) {
        selectValue(select, value);
      } else if (
        !this.defaulted.has(select) &&
        this.args.defaultValue !== undefined
      ) {
        selectValue(select, this.args.defaultValue, true);
      }
      this.defaulted.add(select);
      this.selectElement = select;
      afterRender(this, () => (this.title = selectedText(select)));
    },
  );

  // Options rendered later, or in place of the selected one, would lose
  // `@value`; React selects it again on that render, so this does too.
  optionsChanged = () => {
    if (this.resyncing) return;
    this.resyncing = true;
    afterRender(this, () => {
      this.resyncing = false;
      const select = this.selectElement;
      if (!select?.isConnected) return;
      if (this.args.value !== undefined) selectValue(select, this.args.value);
      this.title = selectedText(select);
    });
  };

  handleChange = (event: Event) => {
    const select = event.currentTarget as HTMLSelectElement;
    this.args.onChange?.(select.value, event);
    if (this.args.value !== undefined) selectValue(select, this.args.value);
    this.title = selectedText(select);
  };

  // A read-only select takes focus, but doesn't open or change from the
  // keyboard.
  handleMouseDown = (event: MouseEvent) => {
    if (!this.args.readOnly) return;
    event.preventDefault();
    (event.currentTarget as HTMLSelectElement).focus();
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (
      this.args.readOnly &&
      ['ArrowDown', 'ArrowUp', ' '].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  <template>
    <div class="cds--form-item {{@className}}">
      <div
        class="cds--select
          {{if @inline 'cds--select--inline'}}
          {{if this.invalid 'cds--select--invalid'}}
          {{if this.disabled 'cds--select--disabled'}}
          {{if @readOnly 'cds--select--readonly'}}
          {{if this.warn 'cds--select--warning'}}
          {{if (has-block 'decorator') 'cds--select--decorator'}}
          {{this.sizeClasses}}"
      >
        {{#unless @noLabel}}
          <label
            for={{this.id}}
            class="cds--label
              {{if @hideLabel 'cds--visually-hidden'}}
              {{if this.disabled 'cds--label--disabled'}}"
            dir="auto"
          >{{this.labelText}}</label>
        {{/unless}}
        {{! Inline, the field and its validation message share a wrapper. }}
        {{#let (element (if @inline "div" "")) as |InlineWrapper|}}
          <InlineWrapper class="cds--select-input--inline__wrapper">
            <div
              class="cds--select-input__wrapper"
              data-invalid={{if this.invalid "true"}}
            >
              {{! The title goes first, so a title attribute replaces it. }}
              <select
                title={{this.title}}
                ...attributes
                id={{this.id}}
                class="cds--select-input"
                disabled={{this.disabled}}
                aria-describedby={{this.describedBy}}
                aria-invalid={{if this.invalid "true"}}
                aria-readonly={{if @readOnly "true"}}
                {{this.syncValue @value}}
                {{on "change" this.handleChange}}
                {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- a select opens on mousedown, so a read-only one prevents it there }}
                {{on "mousedown" this.handleMouseDown}}
                {{on "keydown" this.handleKeyDown}}
              >
                {{yield (component SelectItem select=this)}}
              </select>
              <ChevronDown @size="16" @svgClass="cds--select__arrow" />
              {{#if this.invalid}}
                <WarningFilled
                  @size="16"
                  @svgClass="cds--select__invalid-icon"
                />
              {{else if this.warn}}
                <WarningAltFilled
                  @size="16"
                  @svgClass="cds--select__invalid-icon cds--select__invalid-icon--warning"
                />
              {{/if}}
              {{#if (has-block "decorator")}}
                {{#unless @inline}}
                  <div class="cds--select__inner-wrapper--decorator">
                    {{yield (component AILabel size="mini") to="decorator"}}
                  </div>
                {{/unless}}
              {{/if}}
            </div>
            {{#if this.invalid}}
              <div
                class="cds--form-requirement"
                id={{this.invalidId}}
                dir="auto"
              >{{@invalidText}}</div>
            {{else if this.warn}}
              <div
                class="cds--form-requirement"
                id={{this.warnId}}
                dir="auto"
              >{{@warnText}}</div>
            {{/if}}
          </InlineWrapper>
        {{/let}}
        {{#if this.showHelper}}
          <div
            id={{this.helperId}}
            class="cds--form__helper-text
              {{if this.disabled 'cds--form__helper-text--disabled'}}"
            dir="auto"
          >{{@helperText}}</div>
        {{/if}}
      </div>
    </div>
  </template>
}
