import { module, test } from 'qunit';
import { destroy } from '@ember/destroyable';
import { settled } from '@ember/test-helpers';
import { mediaQuery, minWidth } from '#src/utils/media-query.ts';

// A MediaQueryList whose changes the test fires itself.
class FakeMediaQueryList extends EventTarget {
  matches = false;
  media = '';

  change(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(Object.assign(new Event('change'), { matches }));
  }
}

module('Unit | Utility | media-query', function (hooks) {
  let list: FakeMediaQueryList;
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

  test("minWidth takes the width from @carbon/layout's breakpoints", function (assert) {
    assert.strictEqual(minWidth('md'), '(min-width: 42rem)');
    assert.strictEqual(minWidth('lg'), '(min-width: 66rem)');
  });

  test('matches follows the media query until its owner is destroyed', async function (assert) {
    const owner = {};
    const lg = mediaQuery(owner, minWidth('lg'));
    assert.strictEqual(list.media, '(min-width: 66rem)');
    assert.false(lg.matches);

    list.change(true);
    assert.true(lg.matches);

    destroy(owner);
    await settled();
    list.change(false);
    assert.true(lg.matches, 'no longer listening');
  });
});
