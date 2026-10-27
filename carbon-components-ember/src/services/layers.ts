/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { afterRender } from '../utils/after-render.ts';

/**
 * Where menus, portals and toasts render, so they stay usable over an open
 * `Modal`. A modal `<dialog>` makes the rest of the page inert, even a
 * popover shown after it, so they render inside the topmost open one.
 */
export default class LayersService extends Service {
  /** The open modals' dialogs, the topmost last. */
  @tracked modals: readonly HTMLDialogElement[] = [];

  /** The topmost open modal's dialog. */
  get modal(): HTMLDialogElement | undefined {
    return this.modals.at(-1);
  }

  /** Where to render a layer: the topmost open modal, else `document.body`. */
  get target(): HTMLElement {
    return this.modal ?? document.body;
  }

  /**
   * Puts an open modal's dialog on top. Returns a function that takes it off.
   * Both apply after the render opening or closing it, which may read them.
   */
  addModal(dialog: HTMLDialogElement): () => void {
    afterRender(this, () => {
      this.modals = [...this.modals, dialog];
    });
    return () => {
      afterRender(this, () => {
        this.modals = this.modals.filter((open) => open !== dialog);
      });
    };
  }
}
