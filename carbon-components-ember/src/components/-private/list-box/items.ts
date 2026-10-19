/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * An item's text, as Carbon React's `defaultItemToString`: a string or number
 * item itself, or an object's string `label`.
 */
export function defaultItemToString(item: unknown): string {
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return `${item}`;
  if (
    item !== null &&
    typeof item === 'object' &&
    'label' in item &&
    typeof item.label === 'string'
  ) {
    return item.label;
  }
  return '';
}

/** Whether an item is an object with `disabled: true`, as in Carbon React. */
export function isItemDisabled(item: unknown): boolean {
  return (
    item !== null &&
    typeof item === 'object' &&
    'disabled' in item &&
    item.disabled === true
  );
}

/**
 * The first enabled item's index from `start`, towards the end (or, with
 * `backwards`, the start), or -1.
 */
export function enabledIndex(
  items: unknown[],
  start: number,
  backwards = false,
): number {
  const step = backwards ? -1 : 1;
  for (let index = start; index >= 0 && index < items.length; index += step) {
    if (!isItemDisabled(items[index])) return index;
  }
  return -1;
}

/**
 * The index the highlight moves to, `offset` items on from `current`,
 * wrapping around and skipping disabled items, as downshift moves it.
 */
export function nextEnabledIndex(
  items: unknown[],
  current: number,
  offset: number,
): number {
  const last = items.length - 1;
  if (last < 0) return -1;
  const start =
    current < 0 || current > last ? (offset > 0 ? -1 : last + 1) : current;
  let index = start + offset;
  if (index < 0) index = last;
  else if (index > last) index = 0;
  const backwards = offset < 0;
  let next = enabledIndex(items, index, backwards);
  if (next < 0) next = enabledIndex(items, backwards ? last : 0, backwards);
  if (next < 0) return start > last ? -1 : start;
  return next;
}
