/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { breakpoints } from '@carbon/layout';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import type { BreakpointName } from '@carbon/layout';

/**
 * The media query for viewports at least as wide as one of Carbon's
 * breakpoints, from `@carbon/layout`: `minWidth('lg')` is
 * `(min-width: 66rem)`.
 */
export function minWidth(breakpoint: BreakpointName): string {
  return `(min-width: ${breakpoints[breakpoint].width})`;
}

/**
 * Whether `query` matches, as Carbon React's `useMatchMedia`. `matches`
 * follows the media query until `destroyable` is torn down, so a getter or
 * template reading it updates with it. Without a window (server-side
 * rendering) it's `defaultState`.
 *
 * ```ts
 * #lg = mediaQuery(this, minWidth('lg'));
 * get isLg() { return this.#lg.matches; }
 * ```
 */
export function mediaQuery(
  destroyable: object,
  query: string,
  defaultState = false,
): { readonly matches: boolean } {
  if (typeof window === 'undefined') return { matches: defaultState };
  const list = window.matchMedia(query);
  const matches = tracked(list.matches);
  const update = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };
  list.addEventListener('change', update);
  registerDestructor(destroyable, () =>
    list.removeEventListener('change', update),
  );
  return {
    get matches() {
      return matches.value;
    },
  };
}
