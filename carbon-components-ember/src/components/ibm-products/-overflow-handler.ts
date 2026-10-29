/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { observeResize } from '../../utils/resize-observer.ts';

// Carbon for IBM Products' copy of @carbon/utilities' overflow handler, which
// adds the items' margins to their sizes. Items in `container` that fit stay;
// the rest get `data-hidden`, and `onChange` hears which. A child with
// `data-offset` (the overflow trigger) shows only while something is hidden;
// one with `data-fixed` always counts and is never hidden.

function getSize(element: HTMLElement, dimension: 'width' | 'height'): number {
  const originalDisplay = element.style.display;
  if (!element.offsetParent && getComputedStyle(element).display === 'none') {
    element.style.display = 'inline-block';
  }
  let size = element.getBoundingClientRect()[dimension];
  element.style.display = originalDisplay;
  const styles = getComputedStyle(element);
  size +=
    dimension === 'width'
      ? parseInt(styles.marginLeft) + parseInt(styles.marginRight)
      : parseInt(styles.marginTop) + parseInt(styles.marginBottom);
  return size;
}

export interface OverflowHandlerOptions {
  container: HTMLElement;
  /** Shows at most this many items. */
  maxVisibleItems?: number;
  onChange: (visibleItems: HTMLElement[], hiddenItems: HTMLElement[]) => void;
  /** Defaults to `width`. */
  dimension?: 'width' | 'height';
}

/** Starts managing `container`'s overflow; returns the teardown. */
export function createOverflowHandler({
  container,
  maxVisibleItems,
  onChange,
  dimension = 'width',
}: OverflowHandlerOptions): () => void {
  const children = Array.from(container.children) as HTMLElement[];
  const offset = children.find((item) => item.hasAttribute('data-offset'));
  const fixedItems = children.filter((item) => item.hasAttribute('data-fixed'));
  const items = children.filter(
    (item) => item !== offset && !fixedItems.includes(item),
  );
  const sizes = items.map((item) => getSize(item, dimension));
  const fixedSizes = fixedItems.map((item) => getSize(item, dimension));
  const offsetSize = offset ? getSize(offset, dimension) : 0;
  let previousHidden: HTMLElement[] = [];

  function update() {
    const containerSize =
      dimension === 'width' ? container.clientWidth : container.clientHeight;
    const totalSize = sizes.reduce((sum, size) => sum + size, 0);
    const totalFixedSize = fixedSizes.reduce((sum, size) => sum + size, 0);
    let visible: HTMLElement[] = [];
    const hidden: HTMLElement[] = [];

    if (totalSize + totalFixedSize <= containerSize) {
      visible = maxVisibleItems ? items.slice(0, maxVisibleItems) : [...items];
      if (maxVisibleItems) hidden.push(...items.slice(maxVisibleItems));
    } else {
      const available = containerSize - offsetSize;
      let accumulated = 0;
      items.forEach((item, index) => {
        const size = sizes[index] ?? 0;
        if (
          accumulated + size + totalFixedSize <= available &&
          (!maxVisibleItems || visible.length < maxVisibleItems)
        ) {
          visible.push(item);
          accumulated += size;
        } else {
          hidden.push(item);
        }
      });
    }

    if (
      previousHidden.length === hidden.length &&
      previousHidden.every((item, index) => item === hidden[index])
    ) {
      return;
    }
    previousHidden = hidden;
    visible.forEach((item) => item.removeAttribute('data-hidden'));
    hidden.forEach((item) => item.setAttribute('data-hidden', ''));
    offset?.toggleAttribute('data-hidden', hidden.length === 0);
    onChange(visible, hidden);
  }

  // Measures when it starts observing, then whenever the container resizes.
  return observeResize(container, update);
}
