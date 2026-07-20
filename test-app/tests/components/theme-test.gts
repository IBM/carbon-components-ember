import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Theme from 'carbon-components-ember/components/theme';

module('Integration | Component | Theme', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the white theme by default', async function (assert) {
    await render(
      <template>
        <Theme>
          <span>Content</span>
        </Theme>
      </template>,
    );

    assert.dom('div').hasClass('cds--white');
    assert.dom('div').hasClass('cds--layer-one');
  });

  test('@theme applies the matching zone class', async function (assert) {
    await render(
      <template>
        <Theme @theme='g100'>
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
        <Theme @theme='g90' as |ctx|>
          <span data-test-theme>{{ctx.theme}}</span>
          <span data-test-dark>{{if ctx.isDark 'dark' 'light'}}</span>
        </Theme>
      </template>,
    );

    assert.dom('[data-test-theme]').hasText('g90');
    assert.dom('[data-test-dark]').hasText('dark');
  });

  test('isDark is false for light themes', async function (assert) {
    await render(
      <template>
        <Theme @theme='g10' as |ctx|>
          <span data-test-dark>{{if ctx.isDark 'dark' 'light'}}</span>
        </Theme>
      </template>,
    );

    assert.dom('[data-test-dark]').hasText('light');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Theme @as='section' @theme='g10'>
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
        <Theme id='my-theme' class='custom-class'>
          <span>Content</span>
        </Theme>
      </template>,
    );

    assert.dom('#my-theme').exists();
    assert.dom('div').hasClass('custom-class');
    assert.dom('div').hasClass('cds--white');
  });
});
