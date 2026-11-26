/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { flip, hide, size } from '@floating-ui/dom';
import { modifier } from 'ember-modifier';
import { clippingBoundary, float } from '../../../utils/floating.ts';

/**
 * With `@autoAlign`, positions the open menu below or above its field (the
 * ListBox it's in), as wide as the field, as Carbon React does with
 * Floating UI. With `fitHeight`, as in Dropdown and the multi-selects, the
 * menu is no taller than the room on its side.
 */
export const positionMenu = modifier(
  (
    menu: HTMLElement,
    _positional: [],
    {
      placement,
      fitHeight = false,
    }: { placement: 'top' | 'bottom'; fitHeight?: boolean },
  ) => {
    const field = menu.parentElement;
    if (!field) return;
    let active = true;
    // Derived on each update: a Modal opening in the same render isn't in
    // the top layer yet when this runs.
    const boundary = () => ({ boundary: clippingBoundary(field) });
    // Carbon's `cds--list-box--up` sets the menu's bottom, which would
    // stretch it down to there once it floats.
    menu.style.setProperty('inset-block-end', 'auto');
    const stop = float(field, menu, {
      placement,
      middleware: [
        flip(),
        fitHeight &&
          size(() => ({
            ...boundary(),
            apply: ({ availableHeight }) => {
              if (active) menu.style.maxHeight = `${availableHeight}px`;
            },
          })),
        hide(boundary),
      ],
      onUpdate: () => {
        menu.style.width = `${field.clientWidth}px`;
      },
    });
    return () => {
      active = false;
      stop();
      menu.style.removeProperty('width');
      menu.style.removeProperty('max-height');
      menu.style.removeProperty('inset-block-end');
    };
  },
);

/** Keeps the highlighted item in view, as Carbon React does. */
export const scrollToHighlighted = modifier(
  (menu: HTMLElement, [index]: [index: number]) => {
    menu.children[index]?.scrollIntoView({ block: 'nearest' });
  },
);
