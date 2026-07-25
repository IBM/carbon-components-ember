import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import OrderedList from 'carbon-components-ember/components/ordered-list';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | OrderedList', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display list', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <OrderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </OrderedList>
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

  test('dark theme: should display list', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <OrderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </OrderedList>
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

  test('renders as an ordered list', async function (assert) {
    await render(
      <template>
        <OrderedList>
          <li>Item 1</li>
        </OrderedList>
      </template>,
    );

    assert.dom('ol').hasClass('cds--list--ordered');
    assert.dom('ol').doesNotHaveClass('cds--list--ordered--native');
    assert.dom('ol').doesNotHaveClass('cds--list--nested');
    assert.dom('ol').doesNotHaveClass('cds--list--expressive');
  });

  test('@native adds the native class instead of the default one', async function (assert) {
    await render(
      <template>
        <OrderedList @native={{true}}>
          <li>Item 1</li>
        </OrderedList>
      </template>,
    );

    assert.dom('ol').hasClass('cds--list--ordered--native');
    assert.dom('ol').doesNotHaveClass('cds--list--ordered');
  });

  test('@nested adds the nested class', async function (assert) {
    await render(
      <template>
        <OrderedList @nested={{true}}>
          <li>Item 1</li>
        </OrderedList>
      </template>,
    );

    assert.dom('ol').hasClass('cds--list--nested');
  });

  test('@isExpressive adds the expressive class', async function (assert) {
    await render(
      <template>
        <OrderedList @isExpressive={{true}}>
          <li>Item 1</li>
        </OrderedList>
      </template>,
    );

    assert.dom('ol').hasClass('cds--list--expressive');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <OrderedList id='my-list' class='custom-class'>
          <li>Item 1</li>
        </OrderedList>
      </template>,
    );

    assert.dom('#my-list').exists();
    assert.dom('ol').hasClass('custom-class');
    assert.dom('ol').hasClass('cds--list--ordered');
  });
});
