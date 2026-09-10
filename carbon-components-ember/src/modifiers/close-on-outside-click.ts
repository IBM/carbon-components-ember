/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';

export interface CloseOnOutsideClickOptions {
  /**
   * Listen for the click during the capture phase instead of the bubble
   * phase. Defaults to `false`.
   */
  capture?: boolean;
  /**
   * Also invoke the callback when the window loses focus entirely (e.g. the
   * user switches to another application or browser tab).
   */
  onWindowBlur?: boolean;
}

/**
 * Invokes `onOutsideClick` when a click happens outside the modified
 * element, and (optionally) when the window loses focus. Shared by
 * `Popover` and `Toggletip`, whose previously-independent implementations
 * of this differed only in capture-phase and window-blur handling.
 */
export default modifier(
  (
    element: HTMLElement,
    [onOutsideClick]: [(event?: MouseEvent) => void],
    { capture = false, onWindowBlur = false }: CloseOnOutsideClickOptions = {},
  ) => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && !element.contains(target)) {
        onOutsideClick(event);
      }
    };
    const handleWindowBlur = () => onOutsideClick();

    document.addEventListener('click', handleClick, capture);
    if (onWindowBlur) {
      window.addEventListener('blur', handleWindowBlur);
    }

    return () => {
      document.removeEventListener('click', handleClick, capture);
      if (onWindowBlur) {
        window.removeEventListener('blur', handleWindowBlur);
      }
    };
  },
);
