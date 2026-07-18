import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import TextDirection from 'carbon-components-ember/components/text-direction';

module('Integration | Component | TextDirection', (hooks) => {
  setupRenderingTest(hooks);

  test('renders as a div by default with dir="auto"', async function (assert) {
    await render(
      <template>
        <TextDirection>
          <p>Hello world</p>
        </TextDirection>
      </template>,
    );

    assert.dom('div').hasAttribute('dir', 'auto');
    assert.dom('div > p').hasText('Hello world');
  });

  test('@dir sets the text direction for its content', async function (assert) {
    await render(
      <template>
        <TextDirection @dir='rtl'>
          <p>مرحبا بالعالم</p>
        </TextDirection>
      </template>,
    );

    assert.dom('div').hasAttribute('dir', 'rtl');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <TextDirection @as='span' @dir='ltr'>
          Hello world
        </TextDirection>
      </template>,
    );

    assert.dom('div').doesNotExist();
    assert.dom('span').hasAttribute('dir', 'ltr');
  });
});
