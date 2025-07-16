import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender } from '@ember/test-helpers';
import Accordion from 'carbon-components-ember/components/accordion';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Accordion', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display accordion', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Accordion as |A|>
          <A.Item @title='Section 1'>
            <p>Lorem ipsum</p>
          </A.Item>
        </Accordion>
        <style>
          {{styleValue.current}}
        </style>
      </template>
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display accordion', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Accordion as |A|>
          <A.Item @title='Section 1'>
            <p>Lorem ipsum</p>
          </A.Item>
        </Accordion>
        <style>{{styleValue.current}}</style>
        <style>{{darkStyleValue.current}}</style>
      </template>
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should open and close accordion item on click', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Accordion as |Item|>
          <Item @title='Section 1'>
            <p>Lorem ipsum</p>
          </Item>
        </Accordion>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();
    const closedStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    await click('.cds--accordion__heading');
    assert.dom('.cds--accordion__item--active').exists('item is active');
    await waitForAnimationFrame();
    const openStyles = getAllElementComputedStyles(this.element.firstElementChild!);

    const stylesDiff = getStylesDiff(closedStyles, openStyles);
    assert.snapshot(stylesDiff, 'should have correct styles when opened');

    await click('.cds--accordion__heading');
    await waitForAnimationFrame();
    const closedAgainStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );
    assert.dom('.cds--accordion__item--active').doesNotExist('item is not active');

    const stylesDiff2 = getStylesDiff(openStyles, closedAgainStyles);
    assert.snapshot(stylesDiff2, 'should have correct styles when closed again');
  });

  test('should not open disabled accordion item', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Accordion @disabled={{true}} as |Item|>
          <Item @title='Section 1'>
            <p>Lorem ipsum</p>
          </Item>
        </Accordion>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();
    const disabledStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    assert.dom('.cds--accordion__item--disabled').exists('item is disabled');

    try {
      await click('.cds--accordion__heading');
    } catch (e) {
      assert.ok(
        e.message.includes('Can not `click` disabled'),
        'error message is correct when clicking disabled item'
      );
    }

    await waitForAnimationFrame();
    const stylesAfterClick = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    const stylesDiff = getStylesDiff(disabledStyles, stylesAfterClick);
    assert.deepEqual(stylesDiff, [], 'styles should not change after click');
  });
});
