/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { concat } from '@ember/helper';
import { modifier } from 'ember-modifier';
import AILabel from './ai-label.gts';
import ModalBody from './composed-modal/modal-body.gts';
import ModalFooter from './composed-modal/modal-footer.gts';
import ModalHeader from './composed-modal/modal-header.gts';
import ModalDialog from './-private/modal-dialog.gts';
import { afterRender } from '../utils/after-render.ts';
import type { ModalDialogSignature } from './-private/modal-dialog.gts';
import type { ModalSignature } from './modal.gts';
import type { WithBoundArgs } from '@glint/template';

export interface ComposedModalSignature {
  Element: ModalDialogSignature['Element'];
  Args: {
    /** Specify an optional class to be applied to the modal node. */
    containerClassName?: string;
    /**
     * Specify whether the primary button should be replaced with danger
     * button. Note that this prop is not applied if you render primary/danger
     * button by yourself
     */
    danger?: boolean;
    /** Specify whether the Modal content should have any inner padding. */
    isFullWidth?: boolean;
    /**
     * Specify an optional handler for closing modal. Returning `false` here
     * prevents closing modal.
     */
    onClose?: (event: Event) => boolean | void;
    /** Specify whether the Modal is currently open */
    open?: boolean;
    /**
     * Prevent closing on click outside of modal. A passive modal, one with no
     * `ModalFooter`, closes on one unless this is set; any other closes only
     * when it's `false`.
     */
    preventCloseOnClickOutside?: boolean;
    /**
     * Specify a CSS selector that matches the DOM element that should be
     * focused when the Modal opens
     */
    selectorPrimaryFocus?: string;
    /** Specify the size variant. */
    size?: ModalSignature['Args']['size'];
  };
  Blocks: {
    /** The modal's header, body and footer. */
    default: [
      ModalHeader: WithBoundArgs<typeof ModalHeader, 'modal' | 'closeModal'>,
      ModalBody: WithBoundArgs<typeof ModalBody, 'modal'>,
      ModalFooter: WithBoundArgs<
        typeof ModalFooter,
        'modal' | 'closeModal' | 'danger'
      >,
    ];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * modal's corner. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/**
 * A modal put together from a `ModalHeader`, a `ModalBody` and a
 * `ModalFooter`, which it yields. It closes itself when asked to, unless
 * `@onClose` returns `false`, and opens again when `@open` does.
 */
export default class ComposedModal extends Component<ComposedModalSignature> {
  @tracked header?: ModalHeader;

  @tracked footer?: ModalFooter;

  // Closed from inside since `@open` last changed.
  @tracked dismissed = false;

  #lastOpen = this.args.open;

  get isOpen() {
    return !!this.args.open && !this.dismissed;
  }

  // A modal with no footer is passive, as in Carbon React.
  get closesOnOutsideClick() {
    const { preventCloseOnClickOutside } = this.args;
    return this.footer
      ? preventCloseOnClickOutside === false
      : !preventCloseOnClickOutside;
  }

  // Named after its header's label, as in Carbon React, else its title,
  // which React leaves unnamed.
  get ariaLabel() {
    return this.header?.args.label ?? this.header?.args.title;
  }

  // Opening it again after it closed itself, as `@open` changes.
  watchOpen = modifier(
    (_dialog: HTMLDialogElement, [open]: [open: boolean | undefined]) => {
      if (open === this.#lastOpen) return;
      this.#lastOpen = open;
      afterRender(this, () => {
        this.dismissed = false;
      });
    },
  );

  closeModal = (event: Event) => {
    if (this.args.onClose?.(event) !== false) this.dismissed = true;
  };

  // As in Carbon React: the `@selectorPrimaryFocus` match, or a danger
  // modal's secondary button, else the footer's primary button, else the
  // close button.
  focusTarget = (dialog: HTMLDialogElement) => {
    const body = dialog.querySelector('.cds--modal-container-body');
    const selector = this.args.danger
      ? '.cds--btn--secondary'
      : (this.args.selectorPrimaryFocus ?? '[data-modal-primary-focus]');
    return (
      body?.querySelector<HTMLElement>(selector) ??
      this.footer?.primaryButton ??
      dialog.querySelector<HTMLElement>('.cds--modal-close')
    );
  };

  register(part: ModalHeader | ModalFooter) {
    if (part instanceof ModalHeader) this.header = part;
    else this.footer = part;
  }

  unregister(part: ModalHeader | ModalFooter) {
    if (this.header === part) this.header = undefined;
    if (this.footer === part) this.footer = undefined;
  }

  <template>
    <ModalDialog
      @open={{this.isOpen}}
      @onRequestClose={{this.closeModal}}
      @closesOnOutsideClick={{this.closesOnOutsideClick}}
      @focusTarget={{this.focusTarget}}
      class="{{if @danger 'cds--modal--danger'}}
        {{if (has-block 'decorator') 'cds--modal--decorator'}}"
      aria-label={{this.ariaLabel}}
      ...attributes
      {{this.watchOpen @open}}
    ><div
        class="cds--modal-container
          {{if @size (concat 'cds--modal-container--' @size)}}
          {{if @isFullWidth 'cds--modal-container--full-width'}}
          {{@containerClassName}}"
      ><div class="cds--modal-container-body">
          {{~#if (has-block "decorator")~}}
            <div class="cds--modal--inner__decorator">
              {{~yield (component AILabel size="sm") to="decorator"~}}
            </div>
          {{~/if~}}
          {{~yield
            (component ModalHeader modal=this closeModal=this.closeModal)
            (component ModalBody modal=this)
            (component
              ModalFooter modal=this closeModal=this.closeModal danger=@danger
            )
          ~}}
        </div></div></ModalDialog>
  </template>
}
