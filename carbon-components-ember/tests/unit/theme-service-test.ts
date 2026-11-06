import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { destroy } from '@ember/destroyable';
import { settled } from '@ember/test-helpers';
import { THEME_STORAGE_KEY, themeScript } from '#src/utils/theme.ts';
import { setupMatchMedia } from '../helpers/index.ts';
import readme from '../../README.md?raw';

import type ThemeService from '#src/services/theme.ts';

const THEME_CLASSES = ['cds--white', 'cds--g10', 'cds--g90', 'cds--g100'];

const pageThemes = () =>
  THEME_CLASSES.filter((name) =>
    document.documentElement.classList.contains(name),
  );

const save = (value: object) =>
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(value));

const savedValue = () =>
  JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? 'null') as unknown;

module('Unit | Service | theme', function (hooks) {
  setupTest(hooks);
  const media = setupMatchMedia(hooks);

  const lookup = (owner: { lookup(name: string): unknown }) =>
    owner.lookup('service:carbon.theme') as ThemeService;

  // Before the owner goes, so a service putting the page's classes back
  // doesn't leave them for the next test.
  hooks.afterEach(async function () {
    destroy(lookup(this.owner));
    await settled();
    document.documentElement.classList.remove(...THEME_CLASSES);
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  test('starts as white, and leaves the page alone until a theme is set', function (assert) {
    const service = lookup(this.owner);

    assert.strictEqual(service.theme, 'white');
    assert.false(service.isDark);
    assert.strictEqual(service.preference, undefined);
    assert.deepEqual(pageThemes(), []);
    assert.strictEqual(savedValue(), null);
  });

  test("starts with the page's own theme class", function (assert) {
    document.documentElement.classList.add('cds--g90');
    const service = lookup(this.owner);

    assert.strictEqual(service.theme, 'g90');
    assert.true(service.isDark);
  });

  test('setting the theme moves its class on the page, unsaved', function (assert) {
    const service = lookup(this.owner);

    service.theme = 'g100';
    assert.deepEqual(pageThemes(), ['cds--g100']);
    assert.true(service.isDark);

    service.theme = 'g10';
    assert.deepEqual(pageThemes(), ['cds--g10']);
    assert.false(service.isDark);
    assert.strictEqual(savedValue(), null);
  });

  test('prefersDarkScheme follows the system colour scheme', function (assert) {
    const service = lookup(this.owner);
    assert.strictEqual(media().media, '(prefers-color-scheme: dark)');
    assert.false(service.prefersDarkScheme);

    media().change(true);
    assert.true(service.prefersDarkScheme);
  });

  test("configure follows the system's colour scheme by default, and saves it", function (assert) {
    const service = lookup(this.owner);

    service.configure();
    assert.strictEqual(service.preference, 'system');
    assert.deepEqual(pageThemes(), ['cds--white']);
    assert.deepEqual(savedValue(), {
      light: 'white',
      dark: 'g100',
      preference: 'system',
      chosen: false,
    });

    media().change(true);
    assert.strictEqual(service.theme, 'g100');
    assert.deepEqual(pageThemes(), ['cds--g100']);
  });

  test("configure takes the app's themes and preference", function (assert) {
    const service = lookup(this.owner);

    service.configure({ light: 'g10', dark: 'g90', preference: 'dark' });
    assert.strictEqual(service.theme, 'g90');
    assert.deepEqual(pageThemes(), ['cds--g90']);
  });

  test("the user's preference is saved, and configure restores it", function (assert) {
    const service = lookup(this.owner);
    service.configure();

    service.preference = 'dark';
    assert.deepEqual(pageThemes(), ['cds--g100']);
    assert.deepEqual(savedValue(), {
      light: 'white',
      dark: 'g100',
      preference: 'dark',
      chosen: true,
    });

    // As on the next visit, with the app's preference changed meanwhile.
    service.configure({ preference: 'light' });
    assert.strictEqual(service.preference, 'dark', "the user's pick wins");
  });

  test("configure uses the app's preference when the user picked none", function (assert) {
    save({ light: 'white', dark: 'g100', preference: 'system', chosen: false });
    const service = lookup(this.owner);

    service.configure({ preference: 'light' });
    assert.strictEqual(service.preference, 'light');
  });

  test('configure ignores a saved value it can’t read', function (assert) {
    localStorage.setItem(THEME_STORAGE_KEY, '{nope');
    const service = lookup(this.owner);

    service.configure({ preference: 'dark' });
    assert.strictEqual(service.preference, 'dark');
  });

  test('a theme set over the preference keeps its themes for the next one', function (assert) {
    const service = lookup(this.owner);
    service.configure({ light: 'g10', dark: 'g90', preference: 'system' });

    service.theme = 'white';
    media().change(true);
    assert.deepEqual(
      pageThemes(),
      ['cds--white'],
      'the system no longer moves it',
    );
    assert.strictEqual(service.preference, 'system');

    service.preference = 'dark';
    assert.strictEqual(service.theme, 'g90');
    assert.deepEqual(pageThemes(), ['cds--g90']);
  });

  test("puts the page's own theme back when it goes", async function (assert) {
    document.documentElement.classList.add('cds--g10');
    const service = lookup(this.owner);

    service.theme = 'g100';
    assert.deepEqual(pageThemes(), ['cds--g100']);

    destroy(service);
    await settled();
    assert.deepEqual(pageThemes(), ['cds--g10']);

    media().change(true);
    assert.deepEqual(pageThemes(), ['cds--g10'], 'no longer listening');
  });

  test('with several apps on the page, the latest owns the class', async function (assert) {
    // As on a Storybook docs page, an app per story.
    const create = () => this.owner.factoryFor('service:carbon.theme').create();
    const first = create();
    const second = create();
    const third = create();

    first.theme = 'g10';
    second.theme = 'g90';
    third.theme = 'g100';
    assert.deepEqual(pageThemes(), ['cds--g100']);

    destroy(third);
    await settled();
    assert.deepEqual(
      pageThemes(),
      ['cds--g90'],
      'the one before takes it back',
    );

    destroy(first);
    await settled();
    assert.deepEqual(pageThemes(), ['cds--g90'], 'an earlier one leaves it');

    destroy(second);
    await settled();
    assert.deepEqual(pageThemes(), [], "the last puts the page's back");
  });
});

module('Unit | Utility | theme script', function (hooks) {
  const media = setupMatchMedia(hooks);

  hooks.afterEach(function () {
    document.documentElement.classList.remove(...THEME_CLASSES);
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- runs the script as a page would
  const run = () => (new Function(themeScript) as () => void)();

  test('applies the saved preference', function (assert) {
    document.documentElement.classList.add('cds--white');
    save({ light: 'g10', dark: 'g90', preference: 'dark', chosen: true });

    run();
    assert.deepEqual(pageThemes(), ['cds--g90']);
  });

  test("follows the system's colour scheme by default", function (assert) {
    media().matches = true;

    run();
    assert.deepEqual(pageThemes(), ['cds--g100']);
  });

  test('does nothing with a saved theme it doesn’t know', function (assert) {
    document.documentElement.classList.add('cds--g10');
    save({ light: 'nope', dark: 'g100', preference: 'light' });

    run();
    assert.deepEqual(pageThemes(), ['cds--g10']);
  });

  test('takes an unknown preference as light', function (assert) {
    media().matches = true;
    save({ light: 'g10', dark: 'g90', preference: 'nope' });

    run();
    assert.deepEqual(pageThemes(), ['cds--g10']);
  });

  test('does nothing with a saved value it can’t read', function (assert) {
    document.documentElement.classList.add('cds--g10');
    localStorage.setItem(THEME_STORAGE_KEY, '{nope');

    run();
    assert.deepEqual(pageThemes(), ['cds--g10']);
  });

  test('the README shows it as it is', function (assert) {
    assert.true(readme.includes(`<script>\n${themeScript}\n</script>`));
  });
});
