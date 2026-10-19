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

export interface RovingFocusClassOptions extends RovingFocusOptions {
  /**
   * Make the focused item the tab stop. Defaults to `true`; with `false`,
   * the items' `tabindex` is left to the caller (Tabs keeps it on the
   * selected tab).
   */
  followFocus?: boolean;
  /** Called when a key in the container moves focus to `element`. */
  onNavigate?: (element: HTMLElement) => void;
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

/** Sorts nodes into document order. */
export function byDocumentPosition(a: Node, b: Node) {
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
 * becomes the tab stop, unless `followFocus` is off.
 *
 * ```gjs
 * <ul role="tree" {{this.rovingFocus.container}}>
 *   <li role="treeitem" {{this.rovingFocus.item disabled=@disabled}}>…</li>
 * </ul>
 * ```
 */
export class RovingFocus {
  #options: RovingFocusClassOptions;
  #items = new Map<HTMLElement, ItemState>();
  #tabStop?: HTMLElement;
  #syncScheduled = false;

  constructor(options: RovingFocusClassOptions = {}) {
    this.#options = options;
  }

  get #followsFocus() {
    return this.#options.followFocus ?? true;
  }

  /** The items focus can move to, in DOM order. */
  get items(): HTMLElement[] {
    return [...this.#items]
      .filter(([, { disabled, hidden }]) => !disabled && !hidden)
      .map(([element]) => element)
      .sort(byDocumentPosition);
  }

  /**
   * Focuses `element` and makes it the tab stop (unless `followFocus` is
   * off), if focus can move to it: not a disabled, hidden or unregistered
   * element.
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
        orientation: this.#options.orientation,
        loop: this.#options.loop,
        rtl: getComputedStyle(element).direction === 'rtl',
      });
      const next = index === undefined ? undefined : items[index];
      if (!next) return;
      event.preventDefault();
      this.focus(next);
      this.#options.onNavigate?.(next);
    };
    const handleFocusin = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (this.#followsFocus && this.items.includes(target)) {
        this.#setTabStop(target);
      }
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
      if (!this.#followsFocus) {
        return () => this.#items.delete(element);
      }
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
    if (!this.#followsFocus || this.#tabStop === element) return;
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
