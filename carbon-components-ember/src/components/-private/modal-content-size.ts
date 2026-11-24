/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { observeResize } from '../../utils/resize-observer.ts';

/** Whether a modal's content scrolls, and how tall it is, as Carbon React measures them. */
export default class ModalContentSize {
  /** The content is taller than its box. */
  @tracked scrollable = false;

  @tracked height = 0;

  // Content taller than its box scrolls, which Carbon marks with a fade. A
  // dead zone keeps the 2px border the class adds from flipping it back.
  measure = modifier((content: HTMLElement) =>
    observeResize(content, () => {
      const overflow = content.scrollHeight - content.clientHeight;
      if (overflow > 5) this.scrollable = true;
      else if (overflow < -5) this.scrollable = false;
      this.height = content.getBoundingClientRect().height;
    }),
  );
}
