/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { observeResize } from './resize-observer.ts';

/**
 * Whether `element`'s content is cut off, as by `text-overflow: ellipsis`
 * (Carbon React's `isEllipsisActive`).
 */
export function isTruncated(element: HTMLElement): boolean {
  return element.offsetWidth < element.scrollWidth;
}

/**
 * Calls `callback` with whether `element`'s content is cut off, once when it
 * starts observing and whenever the element resizes, in the next animation
 * frame (see `observeResize`). Returns the teardown.
 */
export function observeTruncation(
  element: HTMLElement,
  callback: (truncated: boolean) => void,
): () => void {
  return observeResize(element, () => callback(isTruncated(element)));
}
