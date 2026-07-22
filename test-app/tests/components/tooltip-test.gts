import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  rerender,
  focus,
  blur,
  click,
  triggerEvent,
  triggerKeyEvent,
  waitUntil,
} from '@ember/test-helpers';
import Tooltip from 'carbon-components-ember/components/tooltip';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Tooltip', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display tooltip', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Tooltip @label='Close' @defaultOpen={{true}}>
          <button type='button'>Trigger</button>
        </Tooltip>
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

  test('dark theme: should display tooltip', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Tooltip @label='Close' @defaultOpen={{true}}>
          <button type='button'>Trigger</button>
        </Tooltip>
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

  test('renders trigger and tooltip content', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').exists();
    assert.dom('.cds--tooltip').hasClass('cds--popover-container');
    assert.dom('.cds--tooltip').hasClass('cds--popover--caret');
    assert.dom('.cds--tooltip').hasClass('cds--popover--high-contrast');
    assert.dom('.cds--tooltip').hasClass('cds--popover--top');
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
    assert.dom('.cds--tooltip-content').hasText('Close');
    assert.dom('.cds--tooltip-content').hasAttribute('role', 'tooltip');
    assert.dom('.cds--tooltip-content').hasAttribute('aria-hidden', 'true');
  });

  test('@defaultOpen renders the tooltip open', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' @defaultOpen={{true}}>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--open');
    assert.dom('.cds--tooltip-content').hasAttribute('aria-hidden', 'false');
  });

  test('@align sets the popover alignment class', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' @align='right'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--right');
  });

  test('@highContrast={{false}} and @dropShadow toggle classes', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' @highContrast={{false}} @dropShadow={{true}}>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--high-contrast');
    assert.dom('.cds--tooltip').hasClass('cds--popover--drop-shadow');
  });

  test('@label sets aria-labelledby on the trigger wrapper', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    const content = document.querySelector('.cds--tooltip-content')!;
    assert
      .dom('.cds--tooltip-trigger__wrapper')
      .hasAttribute('aria-labelledby', content.id);
  });

  test('@description sets aria-describedby on the trigger wrapper', async function (assert) {
    await render(
      <template>
        <Tooltip @description='Closes the dialog'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    const content = document.querySelector('.cds--tooltip-content')!;
    assert
      .dom('.cds--tooltip-trigger__wrapper')
      .hasAttribute('aria-describedby', content.id);
    assert.dom('.cds--tooltip-content').hasText('Closes the dialog');
  });

  test('opens on focus and closes on blur', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    await focus('button');
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    await blur('button');
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
  });

  test('opens on mouseenter and closes on mouseleave', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' @enterDelayMs={{0}} @leaveDelayMs={{0}}>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    await triggerEvent('.cds--tooltip', 'mouseenter');
    await waitUntil(() =>
      document
        .querySelector('.cds--tooltip')!
        .classList.contains('cds--popover--open'),
    );
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    await triggerEvent('.cds--tooltip', 'mouseleave');
    await waitUntil(
      () =>
        !document
          .querySelector('.cds--tooltip')!
          .classList.contains('cds--popover--open'),
    );
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
  });

  test('closes on Escape', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    await focus('button');
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    await triggerKeyEvent('button', 'keydown', 'Escape');
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
  });

  test('@closeOnActivation closes the tooltip on click', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' @closeOnActivation={{true}}>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    await focus('button');
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    await click('button');
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
  });

  test('renders custom content via the content block', async function (assert) {
    await render(
      <template>
        <Tooltip @defaultOpen={{true}}>
          <:default><button type='button'>Trigger</button></:default>
          <:content><span data-custom>Custom content</span></:content>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip-content [data-custom]').hasText('Custom content');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Tooltip @label='Close' id='my-tooltip' class='custom-class'>
          <button type='button'>Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('#my-tooltip').exists();
    assert.dom('.cds--tooltip').hasClass('custom-class');
  });
});
