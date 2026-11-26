/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';

/**
 * On a fieldset, gives its legend the id a caller's `aria-labelledby` points
 * at when there is no `@legendId`, as Carbon React does.
 */
export default modifier(
  (element: HTMLFieldSetElement, [legendId]: [string | undefined]) => {
    // Follows @legendId only, and the attribute's first value.
    const labelledby = element.getAttribute('aria-labelledby');
    const legend = element.querySelector(':scope > legend');

    if (!legendId && labelledby && legend) {
      legend.id = labelledby;
    }
  },
);
