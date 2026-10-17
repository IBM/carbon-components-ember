/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isDestroyed, isDestroying } from '@ember/destroyable';

/**
 * Runs `callback` in a microtask, unless `destroyable` is torn down first.
 * Called during a render, that's once the render is done, so the callback
 * can write tracked state the render read (a child registering with its
 * parent). Returns a function that cancels it.
 */
export function afterRender(
  destroyable: object,
  callback: () => void,
): () => void {
  let cancelled = false;
  queueMicrotask(() => {
    if (cancelled || isDestroying(destroyable) || isDestroyed(destroyable)) {
      return;
    }
    callback();
  });
  return () => {
    cancelled = true;
  };
}
