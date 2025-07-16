import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, settled } from '@ember/test-helpers';
import Button from 'carbon-components-ember/components/button';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display button', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Button @type="primary">Button</Button>
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

  test('dark theme: should display button', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Button @type="primary">Button</Button>
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

  test('should change button type style', async function (this: RenderingTestContext, assert) {
    const type = cell('primary');
    await render(
      <template>
        <Button @type={{type.current}}>Button</Button>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();
    const primaryStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    type.current = 'secondary';
    await rerender();
    await waitForAnimationFrame();
    const secondaryStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    const stylesDiff = getStylesDiff(primaryStyles, secondaryStyles);

    assert.snapshot(
      stylesDiff,
      'should correctly change styles when type is changed'
    );
  });

  test('should show loading indicator for async click handler', async function (assert) {
    let promise;
    const onClick = function () {
      promise = new Promise((res) => setTimeout(res, 100));
      return promise;
    };

    await render(
      <template>
        <Button @onClick={{onClick}} @type="secondary">Button</Button>
      </template>
    );

    await click('button');

    assert.ok(promise, 'should trigger onClick');
    assert.dom('button').hasClass('cds--btn--secondary');
    assert.dom('.cds--loading').exists('should show loading indicator');

    await promise;
    await settled();

    assert
      .dom('.cds--loading')
      .doesNotExist('should not show loading indicator');
  });

  test('cannot click disabled and has correct styles', async function (this: RenderingTestContext, assert) {
    const onClick = () => {
      // Should not be called
    };

    const disabled = cell(false);

    await render(
      <template>
        <Button @onClick={{onClick}} @type="primary" @disabled={{disabled.current}}>
          Button
        </Button>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();
    const enabledStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    disabled.current = true;
    await rerender();
    await waitForAnimationFrame();
    const disabledStyles = getAllElementComputedStyles(
      this.element.firstElementChild!
    );

    const stylesDiff = getStylesDiff(enabledStyles, disabledStyles);
    assert.snapshot(stylesDiff, 'should have correct disabled styles');

    try {
      await click('button');
    } catch (e) {
      assert.ok(
        e.message.includes('Can not `click` disabled'),
        'error message is correct when clicking disabled button'
      );
    }

    assert
      .dom('button')
      .hasClass(
        'cds--btn--disabled',
        'class names should include cds--btn--disabled'
      );
  });
});