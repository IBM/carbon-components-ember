import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import LayoutDirection from 'carbon-components-ember/components/layout-direction';

module('Integration | Component | LayoutDirection', (hooks) => {
  setupRenderingTest(hooks);

  test('renders as a div by default', async function (assert) {
    await render(
      <template>
        <LayoutDirection @dir='ltr'>
          <p>Hello world</p>
        </LayoutDirection>
      </template>,
    );

    assert.dom('div').hasAttribute('dir', 'ltr');
    assert.dom('div > p').hasText('Hello world');
  });

  test('@dir sets the layout direction', async function (assert) {
    await render(
      <template>
        <LayoutDirection @dir='rtl'>
          <p>مرحبا بالعالم</p>
        </LayoutDirection>
      </template>,
    );

    assert.dom('div').hasAttribute('dir', 'rtl');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <LayoutDirection @as='span' @dir='ltr'>
          Hello world
        </LayoutDirection>
      </template>,
    );

    assert.dom('div').doesNotExist();
    assert.dom('span').hasAttribute('dir', 'ltr');
  });

  test('supports nesting to override direction for part of the page', async function (assert) {
    await render(
      <template>
        <LayoutDirection id='outer' @dir='ltr'>
          <p>Outer</p>
          <LayoutDirection id='inner' @dir='rtl'>
            <p>Inner</p>
          </LayoutDirection>
        </LayoutDirection>
      </template>,
    );

    assert.dom('#outer').hasAttribute('dir', 'ltr');
    assert.dom('#inner').hasAttribute('dir', 'rtl');
  });

  test('yields dir and isRTL', async function (assert) {
    await render(
      <template>
        <LayoutDirection @dir='rtl' as |ctx|>
          <span data-test-dir>{{ctx.dir}}</span>
          <span data-test-rtl>{{if ctx.isRTL 'rtl' 'ltr'}}</span>
        </LayoutDirection>
      </template>,
    );

    assert.dom('[data-test-dir]').hasText('rtl');
    assert.dom('[data-test-rtl]').hasText('rtl');
  });

  test('isRTL is false for ltr', async function (assert) {
    await render(
      <template>
        <LayoutDirection @dir='ltr' as |ctx|>
          <span data-test-rtl>{{if ctx.isRTL 'rtl' 'ltr'}}</span>
        </LayoutDirection>
      </template>,
    );

    assert.dom('[data-test-rtl]').hasText('ltr');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <LayoutDirection id='my-layout-direction' class='custom-class' @dir='ltr'>
          Hello world
        </LayoutDirection>
      </template>,
    );
    assert.dom('#my-layout-direction').exists();
    assert.dom('div').hasClass('custom-class');
  });
});
