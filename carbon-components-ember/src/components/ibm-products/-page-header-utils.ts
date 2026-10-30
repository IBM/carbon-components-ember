/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { modifier } from 'ember-modifier';
import type PageHeader from './page-header.gts';
import type { PageHeaderPart } from './page-header.gts';

/**
 * How far `element` sits from the top of the page, or of its scrollable
 * ancestor, which the sticky parts of a PageHeader offset themselves by.
 */
export function getHeaderOffset(element: HTMLElement): number {
  const container = scrollableAncestor(element);
  const top = element.getBoundingClientRect().top;

  if (container === document.scrollingElement) {
    return top >= 0 ? top : 0;
  }
  const containerTop = container
    ? (container as HTMLElement).getBoundingClientRect().top
    : 0;
  const offset = top !== 0 ? top - containerTop : 0;
  return offset >= 0 ? offset : 0;
}

function isScrollable(target: HTMLElement): boolean {
  const { overflow } = window.getComputedStyle(target);
  const tagName = target.tagName.toLowerCase();

  // Modals set overflow: hidden on the body.
  if (tagName === 'body' || tagName === 'html') {
    return /(auto|scroll)/.test(overflow);
  }
  // Elsewhere hidden may be intentional.
  return /(auto|scroll|hidden)/.test(overflow);
}

function scrollableAncestorInner(target: HTMLElement): Element | null {
  const parent = target.parentNode;
  if (parent && parent !== document) {
    return isScrollable(parent as HTMLElement)
      ? (parent as Element)
      : scrollableAncestorInner(parent as HTMLElement);
  }
  return document.scrollingElement;
}

/** The first scrollable element above `target`, the document's by default. */
export function scrollableAncestor(target: HTMLElement): Element | null {
  if (typeof window === 'undefined') return null;
  if (window.getComputedStyle(target).position === 'fixed') {
    return document.scrollingElement;
  }
  return scrollableAncestorInner(target);
}

/** What a PageHeader's parts tell it about, as Carbon for IBM Products' context. */
export interface PageHeaderObserverState {
  fullyCollapsed: boolean;
  titleClipped: boolean;
  contentActionsClipped: boolean;
}

/** Registers the element as the header's `part`. */
export const registerPart = modifier(
  (element: HTMLElement, [pageHeader, part]: [PageHeader, PageHeaderPart]) =>
    pageHeader.register(part, element),
);

/** Sets one of the header's flags while the element is there. */
export const setFlag = modifier(
  (
    _element: HTMLElement,
    [pageHeader, flag, value]: [
      PageHeader,
      'disableStickyTabBar' | 'hasPageActions',
      boolean,
    ],
  ) => pageHeader.setFlag(flag, value),
);
