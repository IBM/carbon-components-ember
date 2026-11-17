/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { concat } from '@ember/helper';
import { guidFor } from '@ember/object/internals';
import AILabel from './ai-label.gts';
import InlineLoading from './inline-loading.gts';
import ModalCloseButton from './-private/modal-close-button.gts';
import ModalContentSize from './-private/modal-content-size.ts';
import ModalDialog from './-private/modal-dialog.gts';
import type { InlineLoadingSignature } from './inline-loading.gts';
import type { WithBoundArgs } from '@glint/template';

export interface ModalSecondaryButton {
  buttonText?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface ModalSignature {
  Element: HTMLDialogElement;
  Args: {
    /**
     * Specify whether the Modal is displaying an alert, error or warning
     * Should go hand in hand with the danger prop.
     */
    alert?: boolean;
    /**
     * Specify label for the close button of the modal; defaults to close
     */
    closeButtonLabel?: string;
    /**
     * Specify whether the Modal is for dangerous actions
     */
    danger?: boolean;
    /**
     * Specify the message read by screen readers for the danger primary
     * button. Defaults to an empty string; provide localized text to opt in.
     */
    dangerDescription?: string;
    /**
     * Specify whether the modal contains scrolling content
     */
    hasScrollingContent?: boolean;
    /**
     * Specify the DOM element ID of the top-level node.
     */
    id?: string;
    /**
     * Specify whether or not the Modal content should have any inner padding.
     */
    isFullWidth?: boolean;
    /**
     * Specify the description for the loading text
     */
    loadingDescription?: string;
    /**
     * Specify the description for the loading text
     */
    loadingIconDescription?: string;
    /**
     * Specify loading status
     */
    loadingStatus?: InlineLoadingSignature['Args']['status'];
    /**
     * Specify a label to be read by screen readers on the modal root node
     */
    modalAriaLabel?: string;
    /**
     * Specify the content of the modal header title.
     */
    modalHeading?: string;
    /**
     * Specify the content of the modal header label.
     */
    modalLabel?: string;
    /**
     * Specify an optional handler to be invoked when loading is successful
     */
    onLoadingSuccess?: () => void;
    /**
     * Specify a handler for closing modal. The handler should take care of
     * closing modal, e.g. changing `@open`.
     */
    onRequestClose?: (event: Event) => void;
    /**
     * Specify a handler for "submitting" modal. The handler should take care
     * of closing modal, e.g. changing `@open`, if necessary.
     */
    onRequestSubmit?: (event: Event) => void;
    /**
     * Specify a handler for the secondary button. Useful if separate handler
     * from `onRequestClose` is desirable
     */
    onSecondarySubmit?: (event: MouseEvent) => void;
    /**
     * Specify whether the Modal is currently open
     */
    open?: boolean;
    /**
     * Specify whether the modal should be button-less
     */
    passiveModal?: boolean;
    /**
     * Prevent closing on click outside of modal. A passive modal closes on
     * one unless this is set; any other closes only when it's `false`.
     */
    preventCloseOnClickOutside?: boolean;
    /**
     * Specify whether the Button should be disabled, or not
     */
    primaryButtonDisabled?: boolean;
    /**
     * Specify the text for the primary button
     */
    primaryButtonText?: string;
    /**
     * Specify the text for the secondary button
     */
    secondaryButtonText?: string;
    /**
     * Specify an array of config objects for secondary buttons, at most two
     */
    secondaryButtons?: ModalSecondaryButton[];
    /**
     * Specify a CSS selector that matches the DOM element that should be
     * focused when the Modal opens
     */
    selectorPrimaryFocus?: string;
    /**
     * Specify if Enter key should be used as "submit" action
     */
    shouldSubmitOnEnter?: boolean;
    /**
     * Specify the size variant.
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };
  Blocks: {
    /** The modal's content. */
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * header. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

export default class Modal extends Component<ModalSignature> {
  content = new ModalContentSize();

  guid = guidFor(this);

  get closeButtonLabel() {
    return this.args.closeButtonLabel ?? 'Close';
  }

  get labelId() {
    return `cds--modal-header__label--modal-${this.guid}`;
  }

  get headingId() {
    return `cds--modal-header__heading--modal-${this.guid}`;
  }

  get bodyId() {
    return `cds--modal-body--modal-${this.guid}`;
  }

  get ariaLabel() {
    return (
      this.args.modalLabel || this.args.modalAriaLabel || this.args.modalHeading
    );
  }

  // alertdialog is the only role a <dialog> may take; a passive alert marks
  // its container instead.
  get role() {
    return this.args.alert && !this.args.passiveModal
      ? 'alertdialog'
      : undefined;
  }

  get containerRole() {
    return this.args.alert && this.args.passiveModal ? 'alert' : undefined;
  }

  get loading() {
    return (this.args.loadingStatus ?? 'inactive') !== 'inactive';
  }

  get scrollContent() {
    return !!this.args.hasScrollingContent || this.content.scrollable;
  }

  get threeButtons() {
    return this.args.secondaryButtons?.length === 2;
  }

  // An array of at most two replaces `@secondaryButtonText`, even an empty
  // one, as in Carbon React.
  get secondaryButtons() {
    const buttons = this.args.secondaryButtons;
    return Array.isArray(buttons) && buttons.length <= 2 ? buttons : undefined;
  }

  get hasSecondaryButtons() {
    return this.secondaryButtons !== undefined;
  }

  get closesOnOutsideClick() {
    const { passiveModal, preventCloseOnClickOutside } = this.args;
    return passiveModal
      ? !preventCloseOnClickOutside
      : preventCloseOnClickOutside === false;
  }

  // As in Carbon React: the `@selectorPrimaryFocus` match, a danger modal's
  // secondary button, or else the close button.
  focusTarget = (dialog: HTMLDialogElement) => {
    const container = dialog.querySelector('.cds--modal-container');
    if (!container) return;
    const selector =
      this.args.selectorPrimaryFocus ?? '[data-modal-primary-focus]';
    const target =
      container.querySelector<HTMLElement>(selector) ??
      (this.args.danger
        ? container.querySelector<HTMLElement>('.cds--btn--secondary')
        : null) ??
      container.querySelector<HTMLElement>('.cds--modal-close');
    return target;
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target;
    const container = (event.currentTarget as HTMLElement).querySelector(
      '.cds--modal-container',
    );
    if (
      event.key === 'Enter' &&
      this.args.shouldSubmitOnEnter &&
      target instanceof Element &&
      container?.contains(target) &&
      !this.isCloseButton(target) &&
      !target.closest('.cds--modal-footer .cds--btn:last-child')
    ) {
      event.stopPropagation();
      this.args.onRequestSubmit?.(event);
    }
  };

  isCloseButton(element: Element) {
    return (
      element.classList.contains('cds--modal-close') ||
      (!this.args.onSecondarySubmit &&
        element.classList.contains('cds--btn--secondary'))
    );
  }

  handleSecondaryClick = (event: MouseEvent) => {
    if (this.args.onSecondarySubmit) this.args.onSecondarySubmit(event);
    else this.args.onRequestClose?.(event);
  };

  handleCloseClick = (event: MouseEvent) => {
    this.args.onRequestClose?.(event);
  };

  handlePrimaryClick = (event: MouseEvent) => {
    this.args.onRequestSubmit?.(event);
  };

  handleSecondaryButtonClick = (
    button: ModalSecondaryButton,
    event: MouseEvent,
  ) => {
    button.onClick?.(event);
  };

  <template>
    <ModalDialog
      @open={{@open}}
      @onRequestClose={{@onRequestClose}}
      @closesOnOutsideClick={{this.closesOnOutsideClick}}
      @focusTarget={{this.focusTarget}}
      id={{@id}}
      class="{{unless @passiveModal 'cds--modal-tall'}}
        {{if @danger 'cds--modal--danger'}}
        {{if (has-block 'decorator') 'cds--modal--decorator'}}"
      role={{this.role}}
      aria-label={{this.ariaLabel}}
      aria-describedby={{if this.role this.bodyId}}
      ...attributes
      {{on "keydown" this.handleKeyDown}}
    ><div
        class="cds--modal-container
          {{if @size (concat 'cds--modal-container--' @size)}}
          {{if @isFullWidth 'cds--modal-container--full-width'}}"
        role={{this.containerRole}}
      >
        <div class="cds--modal-header">
          {{! A passive modal has its close button first, as in Carbon React. }}
          {{#if @passiveModal}}
            <ModalCloseButton
              @label={{this.closeButtonLabel}}
              @onClick={{this.handleCloseClick}}
            />
          {{/if}}
          {{#if @modalLabel}}
            <h2
              id={{this.labelId}}
              class="cds--modal-header__label"
              dir="auto"
            >{{@modalLabel}}</h2>
          {{/if}}
          <h2
            id={{this.headingId}}
            class="cds--modal-header__heading"
            dir="auto"
          >{{@modalHeading}}</h2>
          {{#if (has-block "decorator")}}
            <div class="cds--modal--inner__decorator">
              {{~yield (component AILabel size="sm") to="decorator"~}}
            </div>
          {{/if}}
          {{#unless @passiveModal}}
            <ModalCloseButton
              @label={{this.closeButtonLabel}}
              @onClick={{this.handleCloseClick}}
            />
          {{/unless}}
        </div>
        <div
          id={{this.bodyId}}
          class="cds--modal-content cds--layer-two
            {{if this.scrollContent 'cds--modal-scroll-content'}}
            {{if
              (lte this.content.height 300)
              'cds--modal-scroll-content--no-fade'
            }}"
          tabindex={{if this.scrollContent "0"}}
          role={{if this.scrollContent "region"}}
          aria-label={{if this.scrollContent this.ariaLabel}}
          aria-labelledby={{if
            this.scrollContent
            (if @modalLabel this.labelId this.headingId)
          }}
          {{this.content.measure}}
        >
          {{~yield~}}
        </div>
        {{#unless @passiveModal}}
          <div
            class="cds--btn-set cds--modal-footer
              {{if this.threeButtons 'cds--modal-footer--three-button'}}"
            aria-busy={{if this.loading "true" "false"}}
          >
            {{#if this.hasSecondaryButtons}}
              {{#each this.secondaryButtons as |secondary|}}
                <button
                  class="cds--btn cds--btn--secondary"
                  type="button"
                  {{on "click" (fn this.handleSecondaryButtonClick secondary)}}
                >{{secondary.buttonText}}</button>
              {{/each}}
            {{else if @secondaryButtonText}}
              <button
                class="cds--btn cds--btn--secondary"
                type="button"
                disabled={{this.loading}}
                {{on "click" this.handleSecondaryClick}}
              >{{@secondaryButtonText}}</button>
            {{/if}}
            <button
              class="cds--btn
                {{if @danger 'cds--btn--danger' 'cds--btn--primary'}}
                {{if this.loading 'cds--btn--loading'}}"
              type="button"
              disabled={{or this.loading @primaryButtonDisabled}}
              aria-describedby={{if
                (and @danger @dangerDescription)
                (concat this.guid "-danger-description")
              }}
              {{on "click" this.handlePrimaryClick}}
            >
              {{~#if (and @danger @dangerDescription)~}}
                <span
                  id="{{this.guid}}-danger-description"
                  class="cds--visually-hidden"
                >{{@dangerDescription}}</span>
              {{~/if~}}
              {{~#if this.loading~}}
                <InlineLoading
                  @status={{@loadingStatus}}
                  @description={{@loadingDescription}}
                  @iconDescription={{@loadingIconDescription}}
                  @onSuccess={{@onLoadingSuccess}}
                  class="cds--inline-loading--btn"
                />
              {{~else~}}
                {{@primaryButtonText}}
              {{~/if~}}
            </button>
          </div>
        {{/unless}}
      </div></ModalDialog>
  </template>
}
