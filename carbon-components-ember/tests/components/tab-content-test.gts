import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import TabContent from '#src/components/tab-content.gts';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | TabContent', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display tab content', async function (this: RenderingTestContext, assert) {
    const styleValue = tracked('');
    await render(
      <template>
        <TabContent @selected={{true}}>
          <p>Lorem ipsum</p>
        </TabContent>
        <style>
          {{styleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.value = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display tab content', async function (this: RenderingTestContext, assert) {
    const styleValue = tracked('');
    const darkStyleValue = tracked('');
    await render(
      <template>
        <TabContent @selected={{true}}>
          <p>Lorem ipsum</p>
        </TabContent>
        <style>
          {{styleValue.value}}
        </style>
        <style>
          {{darkStyleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.value = carbonStyle.default;
    darkStyleValue.value = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should render content and be visible when selected', async function (assert) {
    await render(
      <template>
        <TabContent @selected={{true}}>
          <p>Lorem ipsum</p>
        </TabContent>
      </template>,
    );

    assert.dom('.cds--tab-content').exists('renders tab content container');
    assert.dom('.cds--tab-content').hasAttribute('role', 'tabpanel');
    assert.dom('.cds--tab-content').doesNotHaveAttribute('hidden');
    assert.dom('.cds--tab-content').hasText('Lorem ipsum');
  });

  test('should be hidden when not selected', async function (assert) {
    await render(
      <template>
        <TabContent @selected={{false}}>
          <p>Lorem ipsum</p>
        </TabContent>
      </template>,
    );

    assert.dom('.cds--tab-content').hasAttribute('hidden');
  });
});
