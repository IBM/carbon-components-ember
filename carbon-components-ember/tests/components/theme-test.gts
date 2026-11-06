import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Theme from '#src/components/theme.gts';

import type ThemeService from '#src/services/theme.ts';

module('Integration | Component | Theme', (hooks) => {
  setupRenderingTest(hooks);

  test("without @theme it keeps the theme around it, and yields the app's", async function (assert) {
    const globalTheme = this.owner.lookup(
      'service:carbon.theme',
    ) as ThemeService;
    globalTheme.theme = 'g90';

    await render(
      <template>
        <Theme as |ctx|>
          <span data-test-theme>{{ctx.theme}}</span>
          <span data-test-dark>{{if ctx.isDark "dark" "light"}}</span>
        </Theme>
      </template>,
    );

    assert.dom('div').hasClass('cds--layer-one');
    assert.dom('div').doesNotHaveClass('cds--white');
    assert.dom('div').doesNotHaveClass('cds--g90');
    assert.dom('[data-test-theme]').hasText('g90');
    assert.dom('[data-test-dark]').hasText('dark');
  });

  test('@theme applies the matching zone class', async function (assert) {
    await render(
      <template>
        <Theme @theme="g100">
          <span>Content</span>
        </Theme>
      </template>,
    );

    assert.dom('div').hasClass('cds--g100');
    assert.dom('div').doesNotHaveClass('cds--white');
    assert.dom('div').hasClass('cds--layer-one');
  });

  test('yields theme and isDark', async function (assert) {
    await render(
      <template>
        <Theme @theme="g90" as |ctx|>
          <span data-test-theme>{{ctx.theme}}</span>
          <span data-test-dark>{{if ctx.isDark "dark" "light"}}</span>
        </Theme>
      </template>,
    );

    assert.dom('[data-test-theme]').hasText('g90');
    assert.dom('[data-test-dark]').hasText('dark');
  });

  test('isDark is false for light themes', async function (assert) {
    await render(
      <template>
        <Theme @theme="g10" as |ctx|>
          <span data-test-dark>{{if ctx.isDark "dark" "light"}}</span>
        </Theme>
      </template>,
    );

    assert.dom('[data-test-dark]').hasText('light');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Theme @as="section" @theme="g10">
          <span>Content</span>
        </Theme>
      </template>,
    );

    assert.dom('div').doesNotExist();
    assert.dom('section').hasClass('cds--g10');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Theme id="my-theme" class="custom-class">
          <span>Content</span>
        </Theme>
      </template>,
    );

    assert.dom('#my-theme').exists();
    assert.dom('div').hasClass('custom-class');
    assert.dom('div').hasClass('cds--layer-one');
  });
});
