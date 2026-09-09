/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier as eModifier } from 'ember-modifier';

// A minimal `useRef` equivalent: hands the element back to the component so
// it can be driven imperatively (`.click()`, `.value = ''`) the same way
// React's `FileUploaderButton`/`FileUploaderDropContainer` drive their
// hidden `<input type="file">` via a ref.
const captureElement = eModifier<{
  Element: HTMLElement;
  Args: { Named: { onInsert: (element: HTMLElement) => void } };
}>((element, _positional, { onInsert }) => {
  onInsert(element);
});

export default captureElement;
