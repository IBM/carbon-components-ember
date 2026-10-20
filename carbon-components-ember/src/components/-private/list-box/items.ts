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
 * skipping disabled items, as downshift moves it. With `loop: false`, as in a
 * select rather than a combobox, it stops at either end instead of wrapping.
 */
export function nextEnabledIndex(
  items: unknown[],
  current: number,
  offset: number,
  { loop = true }: { loop?: boolean } = {},
): number {
  const last = items.length - 1;
  if (last < 0) return -1;
  const start =
    current < 0 || current > last ? (offset > 0 ? -1 : last + 1) : current;
  let index = start + offset;
  if (index < 0) index = loop ? last : 0;
  else if (index > last) index = loop ? 0 : last;
  const backwards = offset < 0;
  let next = enabledIndex(items, index, backwards);
  if (next < 0 && loop) {
    next = enabledIndex(items, backwards ? last : 0, backwards);
  }
  if (next < 0) return start > last ? -1 : start;
  return next;
}

/** Whether an item is MultiSelect's select-all option (`isSelectAll`). */
export function isSelectAllItem(item: unknown): boolean {
  return (
    item !== null &&
    typeof item === 'object' &&
    'isSelectAll' in item &&
    Boolean(item.isSelectAll)
  );
}

/**
 * Whether two items are equal: the same value, or arrays, plain objects,
 * dates and regular expressions with equal contents, as Carbon React
 * compares selected items. Any other object, such as a class instance, only
 * equals itself.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return String(a) === String(b);
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => isEqual(value, b[index]))
    );
  }
  if (!isPlainObject(a) || !isPlainObject(b)) return false;
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key) && isEqual(a[key], b[key]))
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * The items without objects that have an undefined value, which Carbon
 * React's MultiSelect leaves out.
 */
export function withoutUndefinedValues<T>(items: T[]): T[] {
  return items.filter(
    (item) =>
      item === null ||
      typeof item !== 'object' ||
      Object.values(item).every((value) => value !== undefined),
  );
}

export type CompareItems = (
  itemA: string,
  itemB: string,
  options: { locale: string },
) => number;

export interface SortItemsOptions<T> {
  selectedItems: T[];
  itemToString: (item: T) => string;
  compareItems: CompareItems;
  locale: string;
}

/** Carbon React's default: by text, in the locale, numbers by value. */
export const defaultCompareItems: CompareItems = (itemA, itemB, { locale }) =>
  itemA.localeCompare(itemB, locale, { numeric: true });

/**
 * Carbon React's default order for a MultiSelect's items: the select-all
 * option first, then the given selected items, then the rest by
 * `compareItems`.
 */
export function defaultSortItems<T>(
  items: readonly T[],
  { selectedItems, itemToString, compareItems, locale }: SortItemsOptions<T>,
): T[] {
  return [...items].sort((itemA, itemB) => {
    if (isSelectAllItem(itemA)) return -1;
    if (isSelectAllItem(itemB)) return 1;
    const hasItemA = selectedItems.includes(itemA);
    const hasItemB = selectedItems.includes(itemB);
    if (hasItemA && !hasItemB) return -1;
    if (hasItemB && !hasItemA) return 1;
    return compareItems(itemToString(itemA), itemToString(itemB), { locale });
  });
}
