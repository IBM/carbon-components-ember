/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import captureElement from '../modifiers/capture-element.ts';

export interface ToggleSignature {
  Element: HTMLButtonElement;
  Args: {
    /**
     * Classes for the wrapper, as Carbon React's `className`. `class` and the
     * other attributes go on the `<button>`.
     */
    className?: string;
    /** Specify whether the toggle should be on by default */
    defaultToggled?: boolean;
    /** Whether this control should be disabled */
    disabled?: boolean;
    /**
     * If true, the side labels (props.labelA and props.labelB) will be
     * replaced by props.labelText (if passed), so that the toggle doesn't
     * render a top label.
     */
    hideLabel?: boolean;
    /** Provide an id that unique represents the underlying `<button>` */
    id?: string;
    /** Specify the label for the "off" position */
    labelA?: string;
    /** Specify the label for the "on" position */
    labelB?: string;
    /**
     * Provide the text that will be read by a screen reader when visiting
     * this control. This should be provided unless 'aria-labelledby' is set
     * instead or you use an external `<label>` element with its "for"
     * attribute set to the toggle's id.
     */
    labelText?: string;
    /**
     * Provide an event listener that is called when the control is toggled
     */
    onToggle?: (checked: boolean) => void;
    /** Whether the toggle should be read-only */
    readOnly?: boolean;
    /** Specify the size of the Toggle. Currently only supports 'sm' or 'md' (default) */
    size?: 'sm' | 'md';
    /**
     * Specify whether the control is toggled. When given, it wins over the
     * user's clicks; pair it with `@onToggle` to follow them.
     */
    toggled?: boolean;
  };
}

export default class Toggle extends Component<ToggleSignature> {
  // Read now: a tracked field's initializer only runs when it's first read.
  #initial = this.args.toggled ?? this.args.defaultToggled ?? false;

  // Its state while `@toggled` isn't given, which starts as Carbon React's
  // does.
  @tracked uncontrolled = this.#initial;

  guid = guidFor(this);

  button?: HTMLButtonElement;

  get id() {
    return this.args.id ?? `toggle-${this.guid}`;
  }

  get labelId() {
    return `${this.id}_label`;
  }

  get checked() {
    return this.args.toggled ?? this.uncontrolled;
  }

  get isSm() {
    return this.args.size === 'sm';
  }

  get sideLabel() {
    if (this.args.hideLabel) return this.args.labelText;
    return this.checked
      ? (this.args.labelB ?? 'On')
      : (this.args.labelA ?? 'Off');
  }

  get renderSideLabel() {
    return !(this.args.hideLabel && !this.args.labelText);
  }

  captureButton = (button: HTMLElement) => {
    this.button = button as HTMLButtonElement;
  };

  toggle = () => {
    if (this.args.readOnly) return;
    const checked = !this.checked;
    if (this.args.toggled === undefined) this.uncontrolled = checked;
    this.args.onToggle?.(checked);
  };

  // Without a label to forward clicks to the button, a click anywhere on the
  // toggle clicks it, as in Carbon React, unless it's disabled. The button's
  // own clicks, which only the keyboard makes on the hidden button, need
  // nothing more.
  handleWrapperClick = (event: MouseEvent) => {
    const button = this.button;
    if (this.args.labelText || !button || event.target === button) return;
    button.click();
    button.focus();
  };

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- without a label, the button is hidden and the toggle is clicked instead, as in Carbon React }}
    <div
      class="cds--toggle
        {{if @disabled 'cds--toggle--disabled'}}
        {{if @readOnly 'cds--toggle--readonly'}}
        {{@className}}"
      {{on "click" this.handleWrapperClick}}
    >
      <button
        aria-labelledby={{if @labelText this.labelId}}
        disabled={{@disabled}}
        ...attributes
        id={{this.id}}
        class="cds--toggle__button"
        role="switch"
        type="button"
        aria-checked={{if this.checked "true" "false"}}
        {{on "click" this.toggle}}
        {{captureElement this.captureButton}}
      ></button>
      {{#let (element (if @labelText "label" "div")) as |Label|}}
        <Label id={{this.labelId}} for={{this.id}} class="cds--toggle__label">
          {{~#if @labelText~}}
            <span
              class="cds--toggle__label-text
                {{if @hideLabel 'cds--visually-hidden'}}"
              dir="auto"
            >{{@labelText}}</span>
          {{~/if~}}
          <div
            class="cds--toggle__appearance
              {{if this.isSm 'cds--toggle__appearance--sm'}}"
          >
            <div
              class="cds--toggle__switch
                {{if this.checked 'cds--toggle__switch--checked'}}"
            >
              {{~#if (and this.isSm (not @readOnly))~}}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  class="cds--toggle__check"
                  width="6px"
                  height="5px"
                  viewBox="0 0 6 5"
                ><path d="M2.2 2.7L5 0 6 1 2.2 5 0 2.7 1 1.5z" /></svg>
              {{~/if~}}
            </div>
            {{~#if this.renderSideLabel~}}
              <span
                class="cds--toggle__text"
                aria-hidden="true"
                dir="auto"
              >{{this.sideLabel}}</span>
            {{~/if~}}
          </div>
        </Label>
      {{/let}}
    </div>
  </template>
}
