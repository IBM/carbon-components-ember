/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { concat } from '@ember/helper';
import { modifier as eModifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_DELAY = 100;

const NAVIGATION_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
];

type Size = { width: number; height: number };

function sizeOf(element: Element | null): Size {
  const rect = element?.getBoundingClientRect();
  return { width: rect?.width ?? 0, height: rect?.height ?? 0 };
}

export interface ResizerSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Whether the resizer handle is oriented horizontally (resize up/down)
     * or vertically (resize left/right).
     */
    orientation: 'horizontal' | 'vertical';
    /**
     * Called on every resize movement with the delta (px) from the
     * drag/key start position. When provided the component becomes fully
     * controlled — sibling sizes are NOT updated automatically.
     */
    onResize?: (event: MouseEvent | KeyboardEvent, delta: number) => void;
    /**
     * Called once when a resize interaction ends (mouse-up, or a debounced
     * moment after the last key-driven resize). Receives the resizer's
     * element.
     */
    onResizeEnd?: (
      event: MouseEvent | KeyboardEvent,
      element: HTMLDivElement,
    ) => void;
    /**
     * Called on double-click. When provided, the default reset-to-initial-
     * sizes behavior is suppressed.
     */
    onDoubleClick?: (event: MouseEvent) => void;
    /** Thickness of the handle in px. Defaults to 4. */
    thickness?: number;
  };
  Blocks: {
    /** Optional content rendered inside the handle (e.g. custom drag icons). */
    default: [];
  };
}

const attachResizer = eModifier<{
  Element: HTMLDivElement;
  Args: {
    Named: {
      orientation: 'horizontal' | 'vertical';
      thickness: number;
      onResize?: (event: MouseEvent | KeyboardEvent, delta: number) => void;
      onResizeEnd?: (
        event: MouseEvent | KeyboardEvent,
        element: HTMLDivElement,
      ) => void;
      onDoubleClick?: (event: MouseEvent) => void;
      onDebouncedResizeEnd: (
        event: MouseEvent | KeyboardEvent,
        element: HTMLDivElement,
      ) => void;
    };
  };
}>(
  (
    element,
    _positional,
    {
      orientation,
      thickness,
      onResize,
      onResizeEnd,
      onDoubleClick,
      onDebouncedResizeEnd,
    },
  ) => {
    element.style[orientation === 'horizontal' ? 'blockSize' : 'inlineSize'] =
      `${thickness / 16}rem`;

    const prevSibling = () => element.previousElementSibling as HTMLElement | null;
    const nextSibling = () => element.nextElementSibling as HTMLElement | null;

    const initialSizes = {
      prev: sizeOf(prevSibling()),
      next: sizeOf(nextSibling()),
    };
    let dragSizes = initialSizes;
    let startPos = { x: 0, y: 0 };

    const updateSizes = (event: MouseEvent | KeyboardEvent, delta: number) => {
      if (onResize) {
        onResize(event, delta);
        return;
      }
      const prop = orientation === 'horizontal' ? 'height' : 'width';
      const prev = prevSibling();
      const next = nextSibling();
      if (prev) prev.style[prop] = `${dragSizes.prev[prop] + delta}px`;
      if (next) next.style[prop] = `${dragSizes.next[prop] - delta}px`;
    };

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta =
        orientation === 'horizontal'
          ? event.clientY - startPos.y
          : event.clientX - startPos.x;
      updateSizes(event, delta);
    };

    const handleMouseUp = (event: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      onResizeEnd?.(event, element);
      const prev = prevSibling();
      const next = nextSibling();
      if (prev) prev.style.transition = '';
      if (next) next.style.transition = '';
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const prev = prevSibling();
      const next = nextSibling();
      if (prev) prev.style.transition = 'none';
      if (next) next.style.transition = 'none';
      startPos = { x: event.clientX, y: event.clientY };
      dragSizes = { prev: sizeOf(prev), next: sizeOf(next) };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      if (onDoubleClick) {
        onDoubleClick(event);
        return;
      }
      const prop = orientation === 'horizontal' ? 'height' : 'width';
      const prev = prevSibling();
      const next = nextSibling();
      if (prev) prev.style[prop] = `${initialSizes.prev[prop]}px`;
      if (next) next.style[prop] = `${initialSizes.next[prop]}px`;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!NAVIGATION_KEYS.includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();

      dragSizes = { prev: sizeOf(prevSibling()), next: sizeOf(nextSibling()) };

      const step = event.shiftKey ? 25 : 5;
      const isHorizontal = orientation === 'horizontal';
      let delta = 0;

      switch (event.key) {
        case 'ArrowUp':
          if (isHorizontal) delta = -step;
          break;
        case 'ArrowDown':
          if (isHorizontal) delta = step;
          break;
        case 'ArrowLeft':
          if (!isHorizontal) delta = -step;
          break;
        case 'ArrowRight':
          if (!isHorizontal) delta = step;
          break;
        case 'Home':
          delta = isHorizontal ? -dragSizes.prev.height : -dragSizes.prev.width;
          break;
        case 'End':
          delta = isHorizontal ? dragSizes.next.height : dragSizes.next.width;
          break;
      }

      updateSizes(event, delta);
      onDebouncedResizeEnd(event, element);
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('dblclick', handleDoubleClick);
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('dblclick', handleDoubleClick);
      element.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  },
);

/**
 * A draggable/keyboard-resizable handle placed between two sibling elements.
 * By default it resizes its previous and next DOM siblings directly; pass
 * `@onResize` to take full control of the resize behavior instead (e.g. to
 * drive a CSS grid's `grid-template-columns`).
 *
 * ```gjs
 * <template>
 *   <div class='panel'>...</div>
 *   <Resizer @orientation='horizontal' />
 *   <div class='panel'>...</div>
 * </template>
 * ```
 */
export default class Resizer extends Component<ResizerSignature> {
  get thickness() {
    return this.args.thickness ?? 4;
  }

  debounceResizeEnd = task(
    { restartable: true },
    async (event: MouseEvent | KeyboardEvent, element: HTMLDivElement) => {
      await timeout(DEBOUNCE_DELAY);
      this.args.onResizeEnd?.(event, element);
    },
  );

  onDebouncedResizeEnd = (
    event: MouseEvent | KeyboardEvent,
    element: HTMLDivElement,
  ) => {
    this.debounceResizeEnd.perform(event, element);
  };

  <template>
    <div
      role='separator'
      tabindex='0'
      aria-orientation={{@orientation}}
      aria-live='assertive'
      class={{concat 'cds--resizer cds--resizer--' @orientation}}
      {{attachResizer
        orientation=@orientation
        thickness=this.thickness
        onResize=@onResize
        onResizeEnd=@onResizeEnd
        onDoubleClick=@onDoubleClick
        onDebouncedResizeEnd=this.onDebouncedResizeEnd
      }}
      ...attributes
    >
      <span class='cds--visually-hidden'>
        Use arrow keys to resize, hold Shift for larger steps. Double-click to
        reset.
      </span>
      {{yield}}
    </div>
  </template>
}
