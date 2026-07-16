import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, find } from '@ember/test-helpers';
import ShapeIndicator from 'carbon-components-ember/components/shape-indicator';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | ShapeIndicator', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display shape indicator', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <ShapeIndicator @kind='stable' @label='Stable' />
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

  test('dark theme: should display shape indicator', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <ShapeIndicator @kind='stable' @label='Stable' />
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

  test('should display the label and the kind class', async function (assert) {
    await render(
      <template><ShapeIndicator @kind='failed' @label='Failed' /></template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds--shape-indicator').hasText('Failed');
    assert.dom('.cds--shape-indicator--failed').exists();
  });

  test('should add the 14 text size class', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind='failed' @label='Failed' @textSize={{14}} />
      </template>,
    );

    assert.dom('.cds--shape-indicator--14').exists();
  });

  test('should render nothing for an unrecognized kind', async function (assert) {
    await render(
      // @ts-expect-error intentionally invalid kind
      <template><ShapeIndicator @kind='unknown' @label='Failed' /></template>,
    );

    assert.dom('.cds--shape-indicator').doesNotExist();
  });

  test('should hide the label visually and expose it as an accessible tooltip in compact mode', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind='failed' @label='Failed' @compact={{true}} />
      </template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds--shape-indicator__button').exists();
    assert
      .dom('.cds--shape-indicator__button .cds--visually-hidden')
      .hasText('Failed');
    assert.ok(
      find('.cds--shape-indicator__button')?.getAttribute('aria-describedby'),
      'the button gets an aria-describedby pointing at the tooltip',
    );
  });
});
