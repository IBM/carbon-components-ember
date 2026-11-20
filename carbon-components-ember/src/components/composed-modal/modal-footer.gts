/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import { modifier } from 'ember-modifier';
import Button from '../button.gts';
import ButtonSet from '../button-set.gts';
import InlineLoading from '../inline-loading.gts';
import { afterRender } from '../../utils/after-render.ts';
import type { ButtonSetSignature } from '../button-set.gts';
import type ComposedModal from '../composed-modal.gts';
import type { ModalSecondaryButton, ModalSignature } from '../modal.gts';

export interface ModalFooterSignature {
  Element: ButtonSetSignature['Element'];
  Args: {
    /** The ComposedModal it's in. */
    modal: ComposedModal;
    /** Specify an optional function that is called whenever the modal is closed */
    closeModal?: (event: Event) => void;
    /**
     * Specify whether the primary button should be replaced with danger
     * button. Note that this prop is not applied if you render primary/danger
     * button by yourself
     */
    danger?: boolean;
    /**
     * Specify the message read by screen readers for the danger button
     */
    dangerDescription?: string;
    /** Specify the description for the loading text */
    loadingDescription?: string;
    /** Specify the description for the loading icon */
    loadingIconDescription?: string;
    /** Loading status */
    loadingStatus?: ModalSignature['Args']['loadingStatus'];
    /** Specify an optional handler to be invoked when loading is successful */
    onLoadingSuccess?: () => void;
    /**
     * Specify an optional function for when the modal is requesting to be
     * closed
     */
    onRequestClose?: (event: MouseEvent) => void;
    /**
     * Specify an optional function for when the modal is requesting to be
     * submitted
     */
    onRequestSubmit?: (event: MouseEvent) => void;
    /** Specify whether the primary button should be disabled */
    primaryButtonDisabled?: boolean;
    /** Specify the text for the primary button */
    primaryButtonText?: string;
    /** Specify a custom className to be applied to the primary button */
    primaryClassName?: string;
    /** Specify the text for the secondary button */
    secondaryButtonText?: string;
    /**
     * Specify an array of config objects for secondary buttons, at most two.
     * A button without an `onClick` closes the modal.
     */
    secondaryButtons?: ModalSecondaryButton[];
    /** Specify a custom className to be applied to the secondary button */
    secondaryClassName?: string;
  };
  Blocks: {
    /** More buttons, after the primary one. */
    default: [];
  };
}

/** ComposedModal's footer: its secondary and primary buttons. */
export default class ModalFooter extends Component<ModalFooterSignature> {
  // For the modal to focus when it opens, as in Carbon React.
  primaryButton?: HTMLElement;

  constructor(owner: Owner, args: ModalFooterSignature['Args']) {
    super(owner, args);
    // The modal read its parts during this render; register after it.
    afterRender(this, () => {
      args.modal.register(this);
      registerDestructor(this, () => args.modal.unregister(this));
    });
  }

  get loading() {
    return (this.args.loadingStatus ?? 'inactive') !== 'inactive';
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

  get threeButtons() {
    return this.args.secondaryButtons?.length === 2;
  }

  capturePrimary = modifier((button: HTMLElement) => {
    this.primaryButton = button;
    return () => {
      if (this.primaryButton === button) this.primaryButton = undefined;
    };
  });

  handleRequestClose = (event: MouseEvent) => {
    this.args.closeModal?.(event);
    this.args.onRequestClose?.(event);
  };

  handleSecondaryButtonClick = (
    button: ModalSecondaryButton,
    event: MouseEvent,
  ) => {
    if (button.onClick) button.onClick(event);
    else this.handleRequestClose(event);
  };

  handlePrimaryClick = (event: MouseEvent) => {
    this.args.onRequestSubmit?.(event);
  };

  <template>
    <ButtonSet
      class="cds--modal-footer
        {{if this.threeButtons 'cds--modal-footer--three-button'}}"
      ...attributes
      aria-busy={{if this.loading "true" "false"}}
    >
      {{~#if this.hasSecondaryButtons~}}
        {{~#each this.secondaryButtons as |secondary|~}}
          <Button
            @kind="secondary"
            class={{@secondaryClassName}}
            {{on "click" (fn this.handleSecondaryButtonClick secondary)}}
          >{{secondary.buttonText}}</Button>
        {{~/each~}}
      {{~else if @secondaryButtonText~}}
        <Button
          @kind="secondary"
          @disabled={{this.loading}}
          class={{@secondaryClassName}}
          {{on "click" this.handleRequestClose}}
        >{{@secondaryButtonText}}</Button>
      {{~/if~}}
      {{~#if @primaryButtonText~}}
        <Button
          @kind={{if @danger "danger" "primary"}}
          @disabled={{or this.loading @primaryButtonDisabled}}
          @dangerDescription={{@dangerDescription}}
          class="{{@primaryClassName}} {{if this.loading 'cds--btn--loading'}}"
          {{on "click" this.handlePrimaryClick}}
          {{this.capturePrimary}}
        >
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
        </Button>
      {{~/if~}}
      {{~yield~}}
    </ButtonSet>
  </template>
}
