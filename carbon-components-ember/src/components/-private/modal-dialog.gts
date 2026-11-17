/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { buildWaiter } from '@ember/test-waiters';
import { modifier } from 'ember-modifier';
import { afterRender } from '../../utils/after-render.ts';
import type LayersService from '../../services/layers.ts';
import '../modal.scss';

const waiter = buildWaiter('carbon-components-ember:modal');

export interface ModalDialogSignature {
  Element: HTMLDialogElement;
  Args: {
    /** Shows it. */
    open?: boolean;
    /** Escape, the browser closing it, or a click outside it. */
    onRequestClose?: (event: Event) => void;
    /** A click outside it calls `@onRequestClose`. */
    closesOnOutsideClick?: boolean;
    /** The element to focus once it opens. */
    focusTarget: (dialog: HTMLDialogElement) => HTMLElement | null | undefined;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Modal and ComposedModal's overlay: a native `<dialog>` opened with
 * `showModal()`, which Carbon styles as `.cds--modal`.
 */
export default class ModalDialog extends Component<ModalDialogSignature> {
  @service('carbon.layers') declare layers: LayersService;

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

  // Opens and closes the <dialog> with `@open`. Closing it, also when it
  // goes away, returns focus to where it was. While it's open, menus,
  // portals and toasts render into it.
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
      const removeLayer = open ? this.layers.addModal(dialog) : undefined;
      return () => {
        removeLayer?.();
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

  focusInitial = () => {
    const dialog = this.dialog;
    if (dialog?.open) this.args.focusTarget(dialog)?.focus();
  };

  noteEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.escape = { reached: false };
  };

  reachEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.escape) this.escape.reached = true;
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
      this.args.closesOnOutsideClick &&
      !pressedInside &&
      !this.isInside(event.target)
    ) {
      this.args.onRequestClose?.(event);
    }
  };

  // Focus moving to a field in scrolling content brings it out from under
  // the content's fade, as in Carbon React.
  handleFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (
      next instanceof HTMLElement &&
      this.isInside(next) &&
      next.closest('.cds--modal-scroll-content')
    ) {
      next.scrollIntoView({ block: 'center' });
    }
  };

  // Around the modal's box is the dialog itself. A menu or toast rendered
  // into it is inside.
  isInside(target: EventTarget | null) {
    const dialog = this.dialog;
    return (
      target instanceof Node && target !== dialog && !!dialog?.contains(target)
    );
  }

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- a modal dialog's cancel, close and backdrop clicks are its own ~}}
    <dialog
      class="cds--modal cds--ember-modal cds--layer-one
        {{if @open 'is-visible'}}"
      ...attributes
      {{this.syncOpen @open}}
      {{on "cancel" this.handleCancel}}
      {{on "close" this.handleClose}}
      {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- only the press shows a drag out of the modal, which isn't a click outside }}
      {{on "pointerdown" this.handlePointerDown}}
      {{on "click" this.handleClick}}
      {{on "keydown" this.noteEscape capture=true}}
      {{on "keydown" this.reachEscape}}
      {{on "focusout" this.handleFocusOut}}
    >{{yield}}</dialog>
  </template>
}
