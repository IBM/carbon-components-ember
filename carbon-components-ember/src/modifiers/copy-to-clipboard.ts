/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';
import { textOf, writeToClipboard } from '../utils/clipboard.ts';

export interface CopyToClipboardOptions {
  /** The text to copy, or a function that returns it when clicked. */
  text?: string | (() => string);
  /** An element, or its id, whose text to copy (see `textOf`). */
  target?: Element | string;
  onSuccess?: (text: string) => void;
  onError?: (text: string, error: unknown) => void;
}

/**
 * Copies `text`, or `target`'s text, when the element is clicked.
 *
 * ```gjs
 * <button type="button" {{copyToClipboard target="api-key"}}>Copy</button>
 * ```
 */
export default modifier(
  (
    element: HTMLElement,
    _positional: [],
    { text, target, onSuccess, onError }: CopyToClipboardOptions,
  ) => {
    const copy = async () => {
      let value = typeof text === 'function' ? text() : text;
      if (value === undefined && target !== undefined) {
        const targetElement =
          typeof target === 'string' ? document.getElementById(target) : target;
        value = targetElement ? textOf(targetElement) : undefined;
      }
      if (value === undefined) return;
      try {
        await writeToClipboard(value, element);
      } catch (error) {
        onError?.(value, error);
        return;
      }
      onSuccess?.(value);
    };
    // As in Carbon React, a click handler can cancel the copy.
    const handleClick = (event: Event) => {
      if (!event.defaultPrevented) void copy();
    };
    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  },
);
