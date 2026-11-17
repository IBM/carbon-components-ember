/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { guidFor } from '@ember/object/internals';
import type Owner from '@ember/owner';
import ModalCloseButton from '../-private/modal-close-button.gts';
import { afterRender } from '../../utils/after-render.ts';
import type ComposedModal from '../composed-modal.gts';

export interface ModalHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    /** The ComposedModal it's in. */
    modal: ComposedModal;
    /** Provide an optional function to be called when the close button is clicked */
    buttonOnClick?: (event: MouseEvent) => void;
    /** Specify an optional class to be applied to the modal close node */
    closeClassName?: string;
    /** Specify an optional class to be applied to the modal close icon node */
    closeIconClassName?: string;
    /** Provide an optional function to be called when the modal is closed */
    closeModal?: (event: Event) => void;
    /** Specify a description for the close icon that can be read by screen readers */
    iconDescription?: string;
    /** Specify an optional label to be displayed */
    label?: string;
    /** Specify an optional class to be applied to the modal header label */
    labelClassName?: string;
    /** Specify an optional title to be displayed */
    title?: string;
    /** Specify an optional class to be applied to the modal heading */
    titleClassName?: string;
  };
  Blocks: {
    /** Content after the label and title. */
    default: [];
  };
}

/** ComposedModal's header: its label, its title and a close button. */
export default class ModalHeader extends Component<ModalHeaderSignature> {
  guid = guidFor(this);

  constructor(owner: Owner, args: ModalHeaderSignature['Args']) {
    super(owner, args);
    // The modal read its parts during this render; register after it.
    afterRender(this, () => {
      args.modal.register(this);
      registerDestructor(this, () => args.modal.unregister(this));
    });
  }

  get labelId() {
    return this.args.label
      ? `cds--modal-header__label--${this.guid}`
      : undefined;
  }

  get titleId() {
    return this.args.title
      ? `cds--modal-header__heading--${this.guid}`
      : undefined;
  }

  handleCloseClick = (event: MouseEvent) => {
    this.args.closeModal?.(event);
    this.args.buttonOnClick?.(event);
  };

  <template>
    <div class="cds--modal-header" ...attributes>
      {{~#if @label~}}
        <h2
          id={{this.labelId}}
          class="cds--modal-header__label cds--type-delta {{@labelClassName}}"
        >{{@label}}</h2>
      {{~/if~}}
      {{~#if @title~}}
        <h2
          id={{this.titleId}}
          class="cds--modal-header__heading cds--type-beta {{@titleClassName}}"
        >{{@title}}</h2>
      {{~/if~}}
      {{~yield~}}
      <ModalCloseButton
        @label={{if @iconDescription @iconDescription "Close"}}
        @onClick={{this.handleCloseClick}}
        @className={{@closeClassName}}
        @iconClassName={{@closeIconClassName}}
      />
    </div>
  </template>
}
