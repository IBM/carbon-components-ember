/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';

/**
 * Hands the element to `onInsert` once it renders, as a React ref would, for
 * a component that measures its element or drives it itself (`.click()`,
 * `.value = ''`).
 */
export default modifier(
  (element: HTMLElement, [onInsert]: [(element: HTMLElement) => void]) => {
    onInsert(element);
  },
);
