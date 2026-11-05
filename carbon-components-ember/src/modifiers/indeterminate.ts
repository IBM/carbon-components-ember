/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';

/** Sets a checkbox's `indeterminate` property, which has no attribute. */
export default modifier(
  (element: HTMLInputElement, [indeterminate]: [boolean | undefined]) => {
    element.indeterminate = indeterminate ?? false;
  },
);
