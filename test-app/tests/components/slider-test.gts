import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  rerender,
  fillIn,
  blur,
  triggerKeyEvent,
} from '@ember/test-helpers';
import Slider from 'carbon-components-ember/components/slider';
import SliderSkeleton from 'carbon-components-ember/components/slider-skeleton';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Slider', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display slider', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Slider @labelText='Slider label' @min={{0}} @max={{100}} @value={{50}} />
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

  test('dark theme: should display slider', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Slider @labelText='Slider label' @min={{0}} @max={{100}} @value={{50}} />
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

  test('renders label, range labels and current value', async function (assert) {
    await render(
      <template>
        <Slider @labelText='Slider label' @min={{0}} @max={{100}} @value={{50}} />
      </template>,
    );

    assert.dom('.cds--label').hasText('Slider label');
    assert.dom('.cds--slider__range-label').exists({ count: 2 });
    assert.dom('input.cds--slider-text-input').hasValue('50');
    assert.dom('[role="slider"]').hasAttribute('aria-valuenow', '50');
  });

  test('@disabled disables the slider', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom('.cds--slider-container').hasClass('cds--slider-container--disabled');
    assert.dom('input.cds--slider-text-input').isDisabled();
  });

  test('@readOnly marks the slider container as readonly', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @readOnly={{true}}
        />
      </template>,
    );

    assert.dom('.cds--slider-container').hasClass('cds--slider-container--readonly');
  });

  test('renders a second thumb when @valueUpper is provided', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{10}}
          @valueUpper={{90}}
        />
      </template>,
    );

    assert.dom('.cds--slider-container').hasClass('cds--slider-container--two-handles');
    assert.dom('[role="slider"]').exists({ count: 2 });
  });

  test('typing a valid value in the input calls @onChange with the parsed value', async function (assert) {
    const value = cell(50);
    const onChange = (data: { value: number }) => {
      value.current = data.value;
    };

    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{value.current}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await fillIn('input.cds--slider-text-input', '75');

    assert.strictEqual(value.current, 75);
  });

  test('blurring the input clamps out-of-range values', async function (assert) {
    const value = cell(50);
    const onChange = (data: { value: number }) => {
      value.current = data.value;
    };

    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{value.current}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await fillIn('input.cds--slider-text-input', '500');
    await blur('input.cds--slider-text-input');

    assert.strictEqual(value.current, 100);
    assert.dom('input.cds--slider-text-input').hasValue('100');
  });

  test('@invalid shows the invalid text', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @invalid={{true}}
          @invalidText='Invalid message goes here'
        />
      </template>,
    );

    assert
      .dom('.cds--slider__validation-msg--invalid')
      .hasText('Invalid message goes here');
  });

  test('@warn shows the warning text', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @warn={{true}}
          @warnText='Warning message goes here'
        />
      </template>,
    );

    assert.dom('.cds--slider__validation-msg').hasText('Warning message goes here');
  });

  test('@hideTextInput hides the number input', async function (assert) {
    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @hideTextInput={{true}}
        />
      </template>,
    );

    assert.dom('input.cds--slider-text-input').hasAttribute('type', 'hidden');
  });

  test('@formatLabel formats the min/max range labels', async function (assert) {
    const formatLabel = (val: number) => `custom-${val}`;

    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @value={{50}}
          @formatLabel={{formatLabel}}
        />
      </template>,
    );

    assert.dom('.cds--slider__range-label').exists({ count: 2 });
    assert.dom('.cds--slider__range-label').hasText('custom-0');
  });

  test('keyboard ArrowUp increases the value by @step', async function (assert) {
    const value = cell(50);
    const onChange = (data: { value: number }) => {
      value.current = data.value;
    };

    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @step={{5}}
          @value={{value.current}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await triggerKeyEvent('[role="slider"]', 'keydown', 'ArrowUp');

    assert.strictEqual(value.current, 55);
  });

  test('keyboard ArrowDown decreases the value by @step', async function (assert) {
    const value = cell(50);
    const onChange = (data: { value: number }) => {
      value.current = data.value;
    };

    await render(
      <template>
        <Slider
          @labelText='Slider label'
          @min={{0}}
          @max={{100}}
          @step={{5}}
          @value={{value.current}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await triggerKeyEvent('[role="slider"]', 'keydown', 'ArrowDown');

    assert.strictEqual(value.current, 45);
  });
});

module('Integration | Component | SliderSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a skeleton slider', async function (assert) {
    await render(<template><SliderSkeleton /></template>);

    assert.dom('.cds--slider-container.cds--skeleton').exists();
    assert.dom('.cds--slider__thumb').exists({ count: 1 });
  });

  test('@twoHandles renders a second thumb', async function (assert) {
    await render(<template><SliderSkeleton @twoHandles={{true}} /></template>);

    assert.dom('.cds--slider__thumb').exists({ count: 2 });
  });

  test('@hideLabel hides the label', async function (assert) {
    await render(<template><SliderSkeleton @hideLabel={{true}} /></template>);

    assert.dom('.cds--label').doesNotExist();
  });
});
