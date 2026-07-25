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
});
