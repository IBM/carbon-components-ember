/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { concat } from '@ember/helper';
import { guidFor } from '@ember/object/internals';
import { buildWaiter } from '@ember/test-waiters';
import { modifier } from 'ember-modifier';
import AILabel from './ai-label.gts';
import InlineLoading from './inline-loading.gts';
import Tooltip from './tooltip.gts';
import Close from './icons/close.ts';
import { afterRender } from '../utils/after-render.ts';
import { observeResize } from '../utils/resize-observer.ts';
import type { InlineLoadingSignature } from './inline-loading.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import './modal.scss';

const waiter = buildWaiter('carbon-components-ember:modal');

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

// Carbon React's IconButton, with its tooltip.
const CloseButton: TOC<{
  Element: HTMLDivElement;
  Args: { label: string; onClick: (event: MouseEvent) => void };
}> = <template>
  <div class="cds--modal-close-button" ...attributes>
    <Tooltip @label={{@label}} @align="left" class="cds--icon-tooltip">
      <button
        class="cds--modal-close cds--btn cds--btn--primary cds--btn--icon-only"
        type="button"
        aria-label={{@label}}
        {{on "click" @onClick}}
      >
        <Close @size="20" @svgClass="cds--modal-close__icon" />
      </button>
    </Tooltip>
  </div>
</template>;

export default class Modal extends Component<ModalSignature> {
  /** The modal's content is taller than its box. */
  @tracked scrollable = false;

  @tracked contentHeight = 0;

  guid = guidFor(this);

  dialog?: HTMLDialogElement;

  // The element focused when the modal opened, for focus to go back to.
  opener?: HTMLElement;

  pressedInside = false;

  // Closes we started whose `close` events are on their way, so they
  // aren't taken for the browser's.
  closing = 0;

  // An Escape pressed in the modal, and whether it got back up to the
  // dialog: a component in it that closes on Escape, such as an open menu,
  // stops it on the way, as in Carbon React.
  escape?: { reached: boolean };

  // The browser closes the dialog on an Escape that a component in it used.
  keepOpen = false;

  // Where focus was when the browser closed it, for when it opens again.
  refocus?: HTMLElement;

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
    return !!this.args.hasScrollingContent || this.scrollable;
  }

  get threeButtons() {
    return this.args.secondaryButtons?.length === 2;
  }

  get secondaryButtons() {
    const buttons = this.args.secondaryButtons;
    return buttons && buttons.length <= 2 ? buttons : undefined;
  }

  get closesOnOutsideClick() {
    const { passiveModal, preventCloseOnClickOutside } = this.args;
    return passiveModal
      ? !preventCloseOnClickOutside
      : preventCloseOnClickOutside === false;
  }

  // Opens and closes the <dialog> with `@open`. Closing it, also when it
  // goes away, returns focus to where it was.
  syncOpen = modifier(
    (dialog: HTMLDialogElement, [open]: [open: boolean | undefined]) => {
      this.dialog = dialog;
      if (open && !dialog.open) {
        this.opener =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : undefined;
        dialog.showModal();
        afterRender(this, this.focusInitial);
      } else if (!open && dialog.open) {
        this.close(dialog);
      }
      return () => {
        if (dialog.open) this.close(dialog);
      };
    },
  );

  close(dialog: HTMLDialogElement) {
    const token = waiter.beginAsync();
    dialog.addEventListener('close', () => waiter.endAsync(token), {
      once: true,
    });
    this.closing += 1;
    dialog.close();
    // A dialog removed while open doesn't return focus by itself.
    if (document.activeElement === document.body && this.opener?.isConnected) {
      this.opener.focus();
    }
  }

  // As in Carbon React: the `@selectorPrimaryFocus` match, a danger modal's
  // secondary button, or else the primary button (the close button when
  // passive).
  focusInitial = () => {
    const dialog = this.dialog;
    if (!dialog?.open) return;
    const selector =
      this.args.selectorPrimaryFocus ?? '[data-modal-primary-focus]';
    const target =
      dialog.querySelector<HTMLElement>(selector) ??
      (this.args.danger
        ? dialog.querySelector<HTMLElement>('.cds--btn--secondary')
        : null) ??
      dialog.querySelector<HTMLElement>(
        this.args.passiveModal
          ? '.cds--modal-close'
          : '.cds--modal-footer .cds--btn:last-child',
      );
    target?.focus();
  };

  noteEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.escape = { reached: false };
  };

  // Escape asks to close; `@open` decides.
  handleCancel = (event: Event) => {
    event.preventDefault();
    const escape = this.escape;
    this.escape = undefined;
    const used = !!escape && !escape.reached;
    // One the browser won't let us prevent is followed by `close`.
    if (!event.cancelable) {
      this.keepOpen = used;
      this.refocus =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : undefined;
    } else if (!used) {
      this.args.onRequestClose?.(event);
    }
  };

  // The browser can still close it: a second Escape skips a cancelled
  // `cancel`, and so does a form with `method="dialog"`. Ask to close, and
  // open it again if `@open` stays true.
  handleClose = (event: Event) => {
    if (this.closing > 0) {
      this.closing -= 1;
      return;
    }
    if (this.keepOpen) this.keepOpen = false;
    else this.args.onRequestClose?.(event);
    const dialog = event.currentTarget as HTMLDialogElement;
    const refocus = this.refocus;
    this.refocus = undefined;
    if (this.args.open && dialog.isConnected && !dialog.open) {
      dialog.showModal();
      if (refocus && dialog.contains(refocus)) refocus.focus();
      else this.focusInitial();
    }
  };

  // A press that starts in the modal and ends outside it, as when selecting
  // text, isn't a click outside.
  handlePointerDown = (event: PointerEvent) => {
    this.pressedInside = this.isInside(event.target);
  };

  handleClick = (event: MouseEvent) => {
    const pressedInside = this.pressedInside && event.detail > 0;
    this.pressedInside = false;
    if (
      this.closesOnOutsideClick &&
      !pressedInside &&
      !this.isInside(event.target)
    ) {
      this.args.onRequestClose?.(event);
    }
  };

  isInside(target: EventTarget | null) {
    const container = this.dialog?.querySelector('.cds--modal-container');
    return target instanceof Node && !!container?.contains(target);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.escape) this.escape.reached = true;
    const target = event.target;
    if (
      event.key === 'Enter' &&
      this.args.shouldSubmitOnEnter &&
      target instanceof Element &&
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

  // Content taller than its box scrolls, which Carbon marks with a fade. A
  // dead zone keeps the 2px border the class adds from flipping it back.
  measureContent = modifier((content: HTMLElement) =>
    observeResize(content, () => {
      const overflow = content.scrollHeight - content.clientHeight;
      if (overflow > 5) this.scrollable = true;
      else if (overflow < -5) this.scrollable = false;
      this.contentHeight = content.getBoundingClientRect().height;
    }),
  );

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- a modal dialog's cancel, close and backdrop clicks are its own }}
    <dialog
      id={{@id}}
      class="cds--modal cds--ember-modal cds--layer-one
        {{unless @passiveModal 'cds--modal-tall'}}
        {{if @open 'is-visible'}}
        {{if @danger 'cds--modal--danger'}}
        {{if (has-block 'decorator') 'cds--modal--decorator'}}"
      role={{this.role}}
      aria-label={{this.ariaLabel}}
      aria-describedby={{if this.role this.bodyId}}
      ...attributes
      {{this.syncOpen @open}}
      {{on "cancel" this.handleCancel}}
      {{on "close" this.handleClose}}
      {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- only the press shows a drag out of the modal, which isn't a click outside }}
      {{on "pointerdown" this.handlePointerDown}}
      {{on "click" this.handleClick}}
      {{on "keydown" this.noteEscape capture=true}}
      {{on "keydown" this.handleKeyDown}}
    >
      <div
        class="cds--modal-container
          {{if @size (concat 'cds--modal-container--' @size)}}
          {{if @isFullWidth 'cds--modal-container--full-width'}}"
        role={{this.containerRole}}
      >
        <div class="cds--modal-header">
          {{! A passive modal has its close button first, as in Carbon React. }}
          {{#if @passiveModal}}
            <CloseButton
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
              {{yield (component AILabel size="sm") to="decorator"}}
            </div>
          {{/if}}
          {{#unless @passiveModal}}
            <CloseButton
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
              (lte this.contentHeight 300)
              'cds--modal-scroll-content--no-fade'
            }}"
          tabindex={{if this.scrollContent "0"}}
          role={{if this.scrollContent "region"}}
          aria-label={{if this.scrollContent this.ariaLabel}}
          aria-labelledby={{if
            this.scrollContent
            (if @modalLabel this.labelId this.headingId)
          }}
          {{this.measureContent}}
        >
          {{yield}}
        </div>
        {{#unless @passiveModal}}
          <div
            class="cds--btn-set cds--modal-footer
              {{if this.threeButtons 'cds--modal-footer--three-button'}}"
            aria-busy={{if this.loading "true" "false"}}
          >
            {{#if this.secondaryButtons}}
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
              {{#if (and @danger @dangerDescription)}}
                <span
                  id="{{this.guid}}-danger-description"
                  class="cds--visually-hidden"
                >{{@dangerDescription}}</span>
              {{/if}}
              {{#if this.loading}}
                <InlineLoading
                  @status={{@loadingStatus}}
                  @description={{@loadingDescription}}
                  @iconDescription={{@loadingIconDescription}}
                  @onSuccess={{@onLoadingSuccess}}
                  class="cds--inline-loading--btn"
                />
              {{else}}
                {{@primaryButtonText}}
              {{/if}}
            </button>
          </div>
        {{/unless}}
      </div>
    </dialog>
  </template>
}
