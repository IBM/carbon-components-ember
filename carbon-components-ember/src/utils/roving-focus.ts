/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';

export interface RovingFocusOptions {
  /** Which arrow keys move between items. Defaults to `'vertical'`. */
  orientation?: 'horizontal' | 'vertical';
  /** Wrap from the last item to the first, and back. Defaults to `false`. */
  loop?: boolean;
}

/**
 * The index a key moves focus to, from `current` among `count` items, or
 * `undefined` when the key doesn't navigate. `rtl` swaps the horizontal
 * arrows.
 */
export function nextIndex(
  key: string,
  current: number,
  count: number,
  {
    orientation = 'vertical',
    loop = false,
    rtl = false,
  }: RovingFocusOptions & {
    rtl?: boolean;
  } = {},
): number | undefined {
  if (count === 0) return undefined;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;

  let step: number;
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') step = 1;
    else if (key === 'ArrowUp') step = -1;
    else return undefined;
  } else {
    if (key === 'ArrowRight') step = rtl ? -1 : 1;
    else if (key === 'ArrowLeft') step = rtl ? 1 : -1;
    else return undefined;
  }

  if (current < 0) return step > 0 ? 0 : count - 1;
  const next = current + step;
  if (loop) return (next + count) % count;
  return Math.min(Math.max(next, 0), count - 1);
}

/**
 * The index of the next item whose text starts with what was typed, as a
 * native select finds it. `typed` is everything typed in quick succession,
 * searched from after `anchor`; a run of one repeated character instead
 * cycles through the items starting with it, from after `current`. Returns
 * -1 when nothing matches.
 */
export function typeaheadIndex(
  texts: string[],
  typed: string,
  { current, anchor }: { current: number; anchor: number },
): number {
  const query = typed.toLowerCase();
  const repeated =
    query.length > 1 && [...query].every((char) => char === query[0]);
  const search = repeated ? query.slice(0, 1) : query;
  const startAfter = repeated ? current : anchor;
  for (let offset = 1; offset <= texts.length; offset++) {
    const index = (startAfter + offset + texts.length) % texts.length;
    if (texts[index]?.toLowerCase().startsWith(search)) return index;
  }
  return -1;
}

function byDocumentPosition(a: Node, b: Node) {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

interface ItemState {
  disabled: boolean;
  hidden: boolean;
}

/**
 * A single tab stop across a set of items, moved with the arrow keys, Home
 * and End. Items register through the `item` modifier and are ordered by
 * their position in the DOM, so an item rendered later in the middle stays
 * in the middle. Disabled and hidden items are skipped; the focused item
 * becomes the tab stop.
 *
 * ```gjs
 * <ul role="tree" {{this.rovingFocus.container}}>
 *   <li role="treeitem" {{this.rovingFocus.item disabled=@disabled}}>…</li>
 * </ul>
 * ```
 */
export class RovingFocus {
  #options: RovingFocusOptions;
  #items = new Map<HTMLElement, ItemState>();
  #tabStop?: HTMLElement;
  #syncScheduled = false;

  constructor(options: RovingFocusOptions = {}) {
    this.#options = options;
  }

  /** The items focus can move to, in DOM order. */
  get items(): HTMLElement[] {
    return [...this.#items]
      .filter(([, { disabled, hidden }]) => !disabled && !hidden)
      .map(([element]) => element)
      .sort(byDocumentPosition);
  }

  /**
   * Focuses `element` and makes it the tab stop, if focus can move to it:
   * not a disabled, hidden or unregistered element.
   */
  focus(element: HTMLElement) {
    if (!this.items.includes(element)) return;
    this.#setTabStop(element);
    element.focus();
  }

  container = modifier((element: HTMLElement) => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.metaKey) return;
      const items = this.items;
      const target = event.target as HTMLElement;
      const current = items.indexOf(target);
      // From the container itself (a menu with tabindex="-1"), the first
      // arrow press goes to the first or last item.
      if (current < 0 && target !== element) return;
      const index = nextIndex(event.key, current, items.length, {
        ...this.#options,
        rtl: getComputedStyle(element).direction === 'rtl',
      });
      const next = index === undefined ? undefined : items[index];
      if (!next) return;
      event.preventDefault();
      this.focus(next);
    };
    const handleFocusin = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (this.items.includes(target)) this.#setTabStop(target);
    };
    element.addEventListener('keydown', handleKeydown);
    element.addEventListener('focusin', handleFocusin);
    return () => {
      element.removeEventListener('keydown', handleKeydown);
      element.removeEventListener('focusin', handleFocusin);
    };
  });

  item = modifier(
    (
      element: HTMLElement,
      _positional: [],
      { disabled = false, hidden = false }: Partial<ItemState>,
    ) => {
      this.#items.set(element, { disabled, hidden });
      if (disabled) {
        element.removeAttribute('tabindex');
      } else if (element !== this.#tabStop) {
        element.tabIndex = -1;
      }
      this.#scheduleSync();
      return () => {
        this.#items.delete(element);
        this.#scheduleSync();
      };
    },
  );

  #setTabStop(element: HTMLElement) {
    if (this.#tabStop === element) return;
    this.#demote(this.#tabStop);
    this.#tabStop = element;
    element.tabIndex = 0;
  }

  // A disabled item has no tabindex at all.
  #demote(element: HTMLElement | undefined) {
    const state = element && this.#items.get(element);
    if (element && state && !state.disabled) element.tabIndex = -1;
  }

  // Once per render: registering many items shouldn't sort them each time.
  #scheduleSync() {
    if (this.#syncScheduled) return;
    this.#syncScheduled = true;
    queueMicrotask(() => {
      this.#syncScheduled = false;
      const items = this.items;
      const tabStop =
        this.#tabStop && items.includes(this.#tabStop)
          ? this.#tabStop
          : items[0];
      if (tabStop) {
        this.#setTabStop(tabStop);
      } else {
        this.#demote(this.#tabStop);
        this.#tabStop = undefined;
      }
    });
  }
}
