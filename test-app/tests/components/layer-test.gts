import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Layer from 'carbon-components-ember/components/layer';

module('Integration | Component | Layer', (hooks) => {
  setupRenderingTest(hooks);

  test('renders as layer-two by default (one level of implicit nesting)', async function (assert) {
    await render(
      <template>
        <Layer>
          <span>Content</span>
        </Layer>
      </template>,
    );

    assert.dom('div').hasClass('cds--layer-two');
  });

  test('@level overrides the rendered level', async function (assert) {
    await render(
      <template>
        <Layer @level={{0}}>
          <span>Content</span>
        </Layer>
      </template>,
    );

    assert.dom('div').hasClass('cds--layer-one');
  });

  test('yields a Layer bound to the next level for correct nesting', async function (assert) {
    await render(
      <template>
        <Layer data-test-outer as |L|>
          <L data-test-inner>
            <span>Content</span>
          </L>
        </Layer>
      </template>,
    );

    assert.dom('[data-test-outer]').hasClass('cds--layer-two');
    assert.dom('[data-test-inner]').hasClass('cds--layer-three');
  });

  test('nesting past three levels clamps at layer-three', async function (assert) {
    await render(
      <template>
        <Layer as |L1|>
          <L1 as |L2|>
            <L2 data-test-deep as |L3|>
              <L3 data-test-deepest>
                <span>Content</span>
              </L3>
            </L2>
          </L1>
        </Layer>
      </template>,
    );

    assert.dom('[data-test-deep]').hasClass('cds--layer-three');
    assert.dom('[data-test-deepest]').hasClass('cds--layer-three');
  });

  test('@withBackground applies the background modifier class', async function (assert) {
    await render(
      <template>
        <Layer @withBackground={{true}}>
          <span>Content</span>
        </Layer>
      </template>,
    );

    assert.dom('div').hasClass('cds--layer__with-background');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Layer @as='section'>
          <span>Content</span>
        </Layer>
      </template>,
    );

    assert.dom('div').doesNotExist();
    assert.dom('section').hasClass('cds--layer-two');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Layer id='my-layer' class='custom-class'>
          <span>Content</span>
        </Layer>
      </template>,
    );

    assert.dom('#my-layer').exists();
    assert.dom('div').hasClass('custom-class');
    assert.dom('div').hasClass('cds--layer-two');
  });
});
