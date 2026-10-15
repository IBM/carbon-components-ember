/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { autoUpdate, computePosition } from '@floating-ui/dom';
import { waitForPromise } from '@ember/test-waiters';

import type {
  ComputePositionConfig,
  ComputePositionReturn,
  ReferenceElement,
} from '@floating-ui/dom';

export interface FloatOptions extends Partial<ComputePositionConfig> {
  /**
   * Render the floating element in the top layer (`popover="manual"`), so no
   * ancestor's overflow or stacking context clips it.
   */
  topLayer?: boolean;
  /** Called after each position is applied. */
  onUpdate?: (result: ComputePositionReturn) => void;
}

const POSITION_PROPERTIES = ['position', 'left', 'top', 'visibility'];

/**
 * Positions `floating` next to `reference` with Floating UI, and keeps it
 * there while either of them moves or resizes. `hide` middleware data hides
 * it while the reference is out of view. Returns the teardown.
 */
export function float(
  reference: ReferenceElement,
  floating: HTMLElement,
  { topLayer = false, onUpdate, strategy = 'fixed', ...config }: FloatOptions,
): () => void {
  if (topLayer) {
    floating.popover = 'manual';
    floating.showPopover();
  }

  let active = true;
  const update = () => {
    void waitForPromise(
      computePosition(reference, floating, { strategy, ...config }),
    ).then((result) => {
      if (!active) return;
      floating.style.position = result.strategy;
      floating.style.left = `${result.x}px`;
      floating.style.top = `${result.y}px`;
      floating.style.visibility = result.middlewareData.hide?.referenceHidden
        ? 'hidden'
        : '';
      onUpdate?.(result);
    });
  };
  const stopUpdates = autoUpdate(reference, floating, update);

  return () => {
    active = false;
    stopUpdates();
    for (const property of POSITION_PROPERTIES) {
      floating.style.removeProperty(property);
    }
    if (topLayer) {
      if (floating.matches(':popover-open')) floating.hidePopover();
      floating.removeAttribute('popover');
    }
  };
}
