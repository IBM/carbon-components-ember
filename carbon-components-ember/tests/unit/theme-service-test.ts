import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { destroy } from '@ember/destroyable';
import { settled } from '@ember/test-helpers';

import type ThemeService from '#src/services/theme.ts';

// A MediaQueryList whose changes the test fires itself.
class FakeMediaQueryList extends EventTarget {
  matches = false;
  media = '';

  change(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(Object.assign(new Event('change'), { matches }));
  }
}

const THEME_CLASSES = ['cds--white', 'cds--g10', 'cds--g90', 'cds--g100'];

const pageThemes = () =>
  THEME_CLASSES.filter((name) =>
    document.documentElement.classList.contains(name),
  );

module('Unit | Service | theme', function (hooks) {
  setupTest(hooks);

  let scheme: FakeMediaQueryList;
  // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
  const { matchMedia } = window;

  hooks.beforeEach(function () {
    scheme = new FakeMediaQueryList();
    window.matchMedia = (query: string) => {
      scheme.media = query;
      return scheme as unknown as MediaQueryList;
    };
  });

  const lookup = (owner: { lookup(name: string): unknown }) =>
    owner.lookup('service:carbon.theme') as ThemeService;

  // Before the owner goes, so a service putting the page's classes back
  // doesn't leave them for the next test.
  hooks.afterEach(async function () {
    destroy(lookup(this.owner));
    await settled();
    window.matchMedia = matchMedia;
    document.documentElement.classList.remove(...THEME_CLASSES);
  });

  test('starts as white, and leaves the page alone until a theme is set', function (assert) {
    const service = lookup(this.owner);

    assert.strictEqual(service.theme, 'white');
    assert.false(service.isDark);
    assert.deepEqual(pageThemes(), []);
  });

  test("starts with the page's own theme class", function (assert) {
    document.documentElement.classList.add('cds--g90');
    const service = lookup(this.owner);

    assert.strictEqual(service.theme, 'g90');
    assert.true(service.isDark);
  });

  test('setting the theme moves its class on the page', function (assert) {
    const service = lookup(this.owner);

    service.theme = 'g100';
    assert.deepEqual(pageThemes(), ['cds--g100']);
    assert.true(service.isDark);

    service.theme = 'g10';
    assert.deepEqual(pageThemes(), ['cds--g10']);
    assert.false(service.isDark);
  });

  test('prefersDarkScheme follows the system colour scheme', function (assert) {
    const service = lookup(this.owner);
    assert.strictEqual(scheme.media, '(prefers-color-scheme: dark)');
    assert.false(service.prefersDarkScheme);

    scheme.change(true);
    assert.true(service.prefersDarkScheme);
  });

  test('followSystemScheme switches with the system until a theme is set', function (assert) {
    const service = lookup(this.owner);

    service.followSystemScheme({ light: 'white', dark: 'g100' });
    assert.strictEqual(service.theme, 'white');
    assert.deepEqual(pageThemes(), ['cds--white']);

    scheme.change(true);
    assert.strictEqual(service.theme, 'g100');
    assert.deepEqual(pageThemes(), ['cds--g100']);

    service.theme = 'g10';
    scheme.change(false);
    assert.strictEqual(service.theme, 'g10');
    assert.deepEqual(pageThemes(), ['cds--g10']);
  });

  test("puts the page's own theme back when it goes", async function (assert) {
    document.documentElement.classList.add('cds--g10');
    const service = lookup(this.owner);

    service.theme = 'g100';
    assert.deepEqual(pageThemes(), ['cds--g100']);

    destroy(service);
    await settled();
    assert.deepEqual(pageThemes(), ['cds--g10']);

    scheme.change(true);
    assert.deepEqual(pageThemes(), ['cds--g10'], 'no longer listening');
  });
});
