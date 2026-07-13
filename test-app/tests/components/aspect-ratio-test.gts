import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AspectRatio from 'carbon-components-ember/components/aspect-ratio';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | AspectRatio', (hooks) => {
  setupRenderingTest(hooks);

  test('should render with default 1x1 ratio', async function (assert) {
    await render(
      <template>
        <AspectRatio>
          <div>Content</div>
        </AspectRatio>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--aspect-ratio').exists('should render aspect ratio container');
    assert.dom('.cds--aspect-ratio--1x1').exists('should have default 1x1 ratio class');
    assert.dom('.cds--aspect-ratio').containsText('Content', 'should render children');
  });

  test('should render with custom ratio', async function (assert) {
    await render(
      <template>
        <AspectRatio @ratio="16x9">
          <div>Content</div>
        </AspectRatio>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--aspect-ratio--16x9').exists('should have 16x9 ratio class');
  });

  test('should render with custom element type', async function (assert) {
    await render(
      <template>
        <AspectRatio @as="section" @ratio="4x3">
          <div>Content</div>
        </AspectRatio>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('section.cds--aspect-ratio').exists('should render as section element');
    assert.dom('section.cds--aspect-ratio--4x3').exists('should have 4x3 ratio class');
  });

  test('should support all ratio options', async function (assert) {
    const ratios = ['1x1', '2x3', '3x2', '3x4', '4x3', '1x2', '2x1', '9x16', '16x9'];

    for (const ratio of ratios) {
      await render(
        <template>
          <AspectRatio @ratio={{ratio}}>
            <div>Content</div>
          </AspectRatio>
          <style>{{carbonStyle.default}}</style>
        </template>
      );

      await waitForAnimationFrame();

      assert.dom(`.cds--aspect-ratio--${ratio}`).exists(`should support ${ratio} ratio`);
    }
  });

  test('should pass through HTML attributes', async function (assert) {
    await render(
      <template>
        <AspectRatio data-test-id="my-aspect-ratio" class="custom-class">
          <div>Content</div>
        </AspectRatio>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('[data-test-id="my-aspect-ratio"]').exists('should pass through data attributes');
    assert.dom('.custom-class').exists('should pass through custom classes');
  });
});
