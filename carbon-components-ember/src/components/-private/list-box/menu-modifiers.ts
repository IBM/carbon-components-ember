/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { flip, hide } from '@floating-ui/dom';
import { modifier } from 'ember-modifier';
import { float } from '../../../utils/floating.ts';

/**
 * With `@autoAlign`, positions the open menu below or above its field (the
 * ListBox it's in), as wide as the field, as Carbon React does with
 * Floating UI.
 */
export const positionMenu = modifier(
  (
    menu: HTMLElement,
    _positional: [],
    { placement }: { placement: 'top' | 'bottom' },
  ) => {
    const field = menu.parentElement;
    if (!field) return;
    const stop = float(field, menu, {
      placement,
      middleware: [flip(), hide()],
      onUpdate: () => {
        menu.style.width = `${field.clientWidth}px`;
      },
    });
    return () => {
      stop();
      menu.style.removeProperty('width');
    };
  },
);

/** Keeps the highlighted item in view, as Carbon React does. */
export const scrollToHighlighted = modifier(
  (menu: HTMLElement, [index]: [index: number]) => {
    menu.children[index]?.scrollIntoView({ block: 'nearest' });
  },
);
