import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import Layout, {
  LayoutConstraint,
} from 'carbon-components-ember/components/layout';

module('Integration | Component | Layout', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the base layout class', async function (assert) {
    await render(
      <template>
        <Layout>content</Layout>
      </template>,
    );

    assert.dom('.cds--layout').exists();
    assert.dom('.cds--layout').hasText('content');
  });

  test('@size adds the size modifier class', async function (assert) {
    await render(
      <template>
        <Layout @size='sm'>content</Layout>
      </template>,
    );

    assert.dom('.cds--layout--size-sm').exists();
  });

  test('@density adds the density modifier class', async function (assert) {
    await render(
      <template>
        <Layout @density='condensed'>content</Layout>
      </template>,
    );

    assert.dom('.cds--layout--density-condensed').exists();
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Layout @as='section'>content</Layout>
      </template>,
    );

    assert.dom('div.cds--layout').doesNotExist();
    assert.dom('section.cds--layout').exists();
  });

  test('LayoutConstraint renders size and density constraint classes', async function (assert) {
    await render(
      <template>
        <LayoutConstraint
          @size={{hash default='md' min='sm' max='lg'}}
          @density={{hash default='condensed'}}
        >
          content
        </LayoutConstraint>
      </template>,
    );

    assert.dom('.cds--layout-constraint--size__default-md').exists();
    assert.dom('.cds--layout-constraint--size__min-sm').exists();
    assert.dom('.cds--layout-constraint--size__max-lg').exists();
    assert.dom('.cds--layout-constraint--density__default-condensed').exists();
  });

  test('LayoutConstraint @as renders a custom element type', async function (assert) {
    await render(
      <template>
        <LayoutConstraint @as='section'>content</LayoutConstraint>
      </template>,
    );

    assert.dom('section').exists();
  });
});
