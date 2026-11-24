/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// A MediaQueryList whose changes the test fires itself.
export class FakeMediaQueryList extends EventTarget {
  matches = false;
  media = '';

  change(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(Object.assign(new Event('change'), { matches }));
  }
}

/**
 * Has `window.matchMedia` return a `FakeMediaQueryList` in each of the
 * module's tests. Returns a function giving the test's list.
 */
export function setupMatchMedia(hooks: NestedHooks): () => FakeMediaQueryList {
  let list = new FakeMediaQueryList();
  // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
  const { matchMedia } = window;

  hooks.beforeEach(function () {
    list = new FakeMediaQueryList();
    window.matchMedia = (query: string) => {
      list.media = query;
      return list as unknown as MediaQueryList;
    };
  });

  hooks.afterEach(function () {
    window.matchMedia = matchMedia;
  });

  return () => list;
}
