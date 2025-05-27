import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender } from '@ember/test-helpers';
import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs';
import { array } from '@ember/helper';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { getAllElementComputedStyles, getStylesDiff, waitForAnimationFrame } from '../helpers';


module('Integration | Component | Breadcrumbs', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current="b" />
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(this.element.firstElementChild!);

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
    <template>
      <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current="b" />
      <style>{{carbonStyle.default}}</style>
      <style>{{darkStyleValue.current}}</style>
    </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(this.element.firstElementChild!);

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should allow click without handler', async function (assert) {
    assert.expect(0);
    await render(
      <template><Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} /></template>,
    );

    await click('.cds--breadcrumb-item');
  });

  test('should change selected item style', async function (this: RenderingTestContext, assert) {
    const selected = cell('');
    await render(
    <template>
      <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current={{selected.current}} />
      <style>{{carbonStyle.default}}</style>
    </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    selected.current = 'a';
    await rerender();
    await waitForAnimationFrame();
    const aSelectedStyle = getAllElementComputedStyles(this.element.firstElementChild!);

    selected.current = 'b';
    await rerender();
    await waitForAnimationFrame();
    const bSelectedStyle = getAllElementComputedStyles(this.element.firstElementChild!);

    const stylesDiffA = getStylesDiff(styles, aSelectedStyle);
    const stylesDiffB = getStylesDiff(aSelectedStyle, bSelectedStyle);

    assert.snapshot(stylesDiffA, 'does have correct initial styles');
    assert.snapshot(stylesDiffB, 'does correctly change styles after selection');
  });
});
