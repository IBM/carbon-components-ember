import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import Stack from 'carbon-components-ember/components/stack';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Stack', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display stack', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Stack @gap={{6}}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Stack>
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display stack', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Stack @gap={{6}}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Stack>
        <style>{{styleValue.current}}</style>
        <style>{{darkStyleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('renders a vertical stack by default', async function (assert) {
    await render(
      <template>
        <Stack>
          <div>Item 1</div>
        </Stack>
      </template>,
    );

    assert.dom('div').hasClass('cds--stack-vertical');
    assert.dom('div').doesNotHaveClass('cds--stack-horizontal');
  });

  test('@orientation="horizontal" renders a horizontal stack', async function (assert) {
    await render(
      <template>
        <Stack @orientation='horizontal'>
          <div>Item 1</div>
        </Stack>
      </template>,
    );

    assert.dom('div').hasClass('cds--stack-horizontal');
    assert.dom('div').doesNotHaveClass('cds--stack-vertical');
  });

  test('@gap as a number sets the spacing scale class', async function (assert) {
    await render(
      <template>
        <Stack @gap={{6}}>
          <div>Item 1</div>
        </Stack>
      </template>,
    );

    assert.dom('div').hasClass('cds--stack-scale-6');
  });

  test('@gap as a string sets a custom gap style', async function (assert) {
    await render(
      <template>
        <Stack @gap='2rem'>
          <div>Item 1</div>
        </Stack>
      </template>,
    );

    assert
      .dom('div')
      .hasAttribute('style', '--cds-stack-gap: 2rem;');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Stack @as='ul'>
          <li>Item 1</li>
        </Stack>
      </template>,
    );

    assert.dom('div').doesNotExist();
    assert.dom('ul').exists();
    assert.dom('ul').hasClass('cds--stack-vertical');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Stack id='my-stack' class='custom-class'>
          <div>Item 1</div>
        </Stack>
      </template>,
    );

    assert.dom('#my-stack').exists();
    assert.dom('div').hasClass('custom-class');
    assert.dom('div').hasClass('cds--stack-vertical');
  });
});
