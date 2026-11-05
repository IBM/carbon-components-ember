/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';
import { waitForPromise } from '@ember/test-waiters';
import { observeResize } from '../utils/resize-observer.ts';

export interface TableAlignment {
  /** Whether a body cell's text wraps. */
  body: boolean;
  /** Whether a header label's text wraps. */
  header: boolean;
}

// As Carbon React's check: whether the text, measured on one line, is wider
// than the element.
function isWrapping(element: Element, context: CanvasRenderingContext2D) {
  if (element.children.length > 0) return false;
  const styles = window.getComputedStyle(element);
  context.font = styles.font || `${styles.fontSize} ${styles.fontFamily}`;
  const text = element.textContent ?? '';
  let width = context.measureText(text).width;
  const spacing = parseFloat(styles.letterSpacing);
  if (!isNaN(spacing)) width += spacing * text.length;
  const left = parseFloat(styles.paddingLeft);
  if (!isNaN(left)) width += left;
  const right = parseFloat(styles.paddingRight);
  if (!isNaN(right)) width += right;
  return width > element.getBoundingClientRect().width;
}

function measure(table: HTMLElement): TableAlignment | undefined {
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return undefined;
  return {
    body: Array.from(table.querySelectorAll('td')).some((cell) =>
      isWrapping(cell, context),
    ),
    header: Array.from(table.querySelectorAll('th')).some((header) => {
      const label = header.querySelector('.cds--table-header-label');
      return label !== null && isWrapping(label, context);
    }),
  };
}

/**
 * For Carbon React's `Table` `experimentalAutoAlign`: tells `onChange`
 * whether a body cell or a header label wraps its text, when it renders,
 * whenever the table resizes, once the fonts have loaded and when `size`
 * changes. Turned off, it reports nothing wraps. Intended for smaller tables.
 */
export default modifier(
  (
    table: HTMLElement,
    [enabled, size, onChange]: [
      boolean | undefined,
      string | undefined,
      (alignment: TableAlignment) => void,
    ],
  ) => {
    void size;
    if (!enabled) {
      onChange({ body: false, header: false });
      return;
    }

    let active = true;
    const update = () => {
      const alignment = active && measure(table);
      if (alignment) onChange(alignment);
    };

    update();
    const stop = observeResize(table, update);
    if (document.fonts?.status && document.fonts.status !== 'loaded') {
      void waitForPromise(document.fonts.ready).then(update);
    }

    return () => {
      active = false;
      stop();
    };
  },
);
