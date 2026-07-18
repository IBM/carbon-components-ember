import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Text from 'carbon-components-ember/components/text';

module('Integration | Component | Text', (hooks) => {
  setupRenderingTest(hooks);

  test('renders as a span by default with dir="auto"', async function (assert) {
    await render(
      <template>
        <Text>Hello world</Text>
      </template>,
    );

    assert.dom('span').exists();
    assert.dom('span').hasAttribute('dir', 'auto');
    assert.dom('span').hasText('Hello world');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Text @as='p'>Hello world</Text>
      </template>,
    );

    assert.dom('span').doesNotExist();
    assert.dom('p').exists();
    assert.dom('p').hasText('Hello world');
  });

  test('@dir sets the text direction', async function (assert) {
    await render(
      <template>
        <Text @dir='rtl'>مرحبا بالعالم</Text>
      </template>,
    );

    assert.dom('span').hasAttribute('dir', 'rtl');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Text id='my-text' class='custom-class'>Hello world</Text>
      </template>,
    );

    assert.dom('#my-text').exists();
    assert.dom('span').hasClass('custom-class');
  });
});
