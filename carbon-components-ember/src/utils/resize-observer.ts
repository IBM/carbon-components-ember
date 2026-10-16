/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ResizeCallback = (entry: ResizeObserverEntry) => void;

// One entry per registration, so registering the same function twice, or a
// stale teardown, can't drop someone else's.
interface Registration {
  callback: ResizeCallback;
}

let observer: ResizeObserver | undefined;
const registrations = new Map<Element, Set<Registration>>();
const pending = new Map<Element, ResizeObserverEntry>();
let frame = 0;

function deliver() {
  frame = 0;
  const entries = [...pending];
  pending.clear();
  for (const [element, entry] of entries) {
    for (const { callback } of registrations.get(element) ?? []) {
      // One failing callback mustn't starve the others in this frame.
      try {
        callback(entry);
      } catch (error) {
        reportError(error);
      }
    }
  }
}

/**
 * Calls `callback` when `element` resizes, and once when it starts
 * observing (the element's other callbacks run once more then too),
 * through one ResizeObserver shared by every caller. Callbacks
 * run in the next animation frame, outside the observer's own
 * notification, so one that changes layout doesn't trigger
 * "ResizeObserver loop completed with undelivered notifications". Returns
 * the teardown.
 */
export function observeResize(
  element: Element,
  callback: ResizeCallback,
): () => void {
  observer ??= new ResizeObserver((entries) => {
    for (const entry of entries) pending.set(entry.target, entry);
    frame ||= requestAnimationFrame(deliver);
  });
  let elementRegistrations = registrations.get(element);
  if (!elementRegistrations) {
    elementRegistrations = new Set();
    registrations.set(element, elementRegistrations);
  }
  const registration = { callback };
  elementRegistrations.add(registration);
  // Observing afresh gives the new callback its first call too (calling
  // observe() on an observed element doesn't, in Chrome).
  observer.unobserve(element);
  observer.observe(element);

  return () => {
    elementRegistrations.delete(registration);
    if (
      elementRegistrations.size === 0 &&
      registrations.get(element) === elementRegistrations
    ) {
      registrations.delete(element);
      pending.delete(element);
      observer?.unobserve(element);
    }
  };
}
