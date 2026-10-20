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
  settled,
  find,
} from '@ember/test-helpers';
import { modifier } from 'ember-modifier';
import { trackedObject } from '@ember/reactive/collections';
import Tooltip from '#src/components/tooltip.gts';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
  disableCarbonStyles,
  enableCarbonStyles,
  nonce,
} from '../helpers';

module('Integration | Component | Tooltip', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display tooltip', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template>
        <Tooltip @label="Close" @defaultOpen={{true}}>
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display tooltip', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    const darkStyleValue = tracked('');
    await render(
      <template>
        <Tooltip @label="Close" @defaultOpen={{true}}>
          <button type="button">Trigger</button>
        </Tooltip>
        <style nonce={{nonce}}>
          {{darkStyleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    darkStyleValue.value = carbonDarkStyle.default;
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
        <Tooltip @label="Close">
          <button type="button">Trigger</button>
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
        <Tooltip @label="Close" @defaultOpen={{true}}>
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--open');
    assert.dom('.cds--tooltip-content').hasAttribute('aria-hidden', 'false');
  });

  test('@align sets the popover alignment class', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close" @align="right">
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--right');
  });

  test('@highContrast={{false}} and @dropShadow toggle classes', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close" @highContrast={{false}} @dropShadow={{true}}>
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--high-contrast');
    assert.dom('.cds--tooltip').hasClass('cds--popover--drop-shadow');
  });

  test('@label names the trigger itself through aria-labelledby', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close">
          <button type="button" class="trigger"></button>
        </Tooltip>
      </template>,
    );

    const content = document.querySelector('.cds--tooltip-content')!;
    assert.dom('.trigger').hasAttribute('aria-labelledby', content.id);
    // The wrapper has no role, so ARIA naming attributes aren't allowed on it.
    assert
      .dom('.cds--tooltip-trigger__wrapper')
      .doesNotHaveAttribute('aria-labelledby')
      .doesNotHaveAttribute('aria-describedby');
  });

  test('@description describes the trigger through aria-describedby', async function (assert) {
    await render(
      <template>
        <Tooltip @description="Closes the dialog">
          <button type="button" class="trigger">Trigger</button>
        </Tooltip>
      </template>,
    );

    const content = document.querySelector('.cds--tooltip-content')!;
    assert.dom('.trigger').hasAttribute('aria-describedby', content.id);
    assert.dom('.trigger').doesNotHaveAttribute('aria-labelledby');
    assert.dom('.cds--tooltip-content').hasText('Closes the dialog');
  });

  test('the trigger keeps its own aria attribute once the tooltip is removed', async function (assert) {
    const state = trackedObject({ withTooltip: true });

    await render(
      <template>
        {{#if state.withTooltip}}
          <Tooltip @description="Tooltip">
            <button
              type="button"
              class="trigger"
              aria-describedby="own-description"
            >Trigger</button>
          </Tooltip>
        {{/if}}
        <span id="own-description">Own</span>
      </template>,
    );

    const content = document.querySelector('.cds--tooltip-content')!;
    const trigger = document.querySelector('.trigger')!;
    assert.strictEqual(trigger.getAttribute('aria-describedby'), content.id);

    state.withTooltip = false;
    await settled();
    assert.strictEqual(
      trigger.getAttribute('aria-describedby'),
      'own-description',
      'the original value is restored on teardown',
    );
  });

  test('opens on focus and closes on blur', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close">
          <button type="button">Trigger</button>
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
        <Tooltip @label="Close" @enterDelayMs={{0}} @leaveDelayMs={{0}}>
          <button type="button">Trigger</button>
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
        <Tooltip @label="Close">
          <button type="button">Trigger</button>
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
        <Tooltip @label="Close" @closeOnActivation={{true}}>
          <button type="button">Trigger</button>
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
          <:default><button type="button">Trigger</button></:default>
          <:content><span data-custom>Custom content</span></:content>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip-content [data-custom]').hasText('Custom content');
  });

  test('@autoAlign moves the tooltip to a side that fits within @autoAlignBoundary', async function (assert) {
    const boundary = tracked<HTMLElement | undefined>(undefined);
    const setBoundary = modifier((element: HTMLElement) => {
      boundary.value = element;
    });

    await render(
      <template>
        <style nonce={{nonce}}>
          .tooltip-flip-test__boundary {
            width: 16rem;
            height: 20rem;
          }
          .tooltip-flip-test__tooltip {
            display: block;
          }
          .tooltip-flip-test__trigger {
            display: block;
            width: 100%;
            height: 2rem;
          }
        </style>
        <div class="tooltip-flip-test__boundary" {{setBoundary}}>
          {{#if boundary.value}}
            <Tooltip
              class="tooltip-flip-test__tooltip"
              @label="Close"
              @align="top"
              @autoAlign={{true}}
              @autoAlignBoundary={{boundary.value}}
              @defaultOpen={{true}}
            >
              <button class="tooltip-flip-test__trigger" type="button">
                Trigger
              </button>
            </Tooltip>
          {{/if}}
        </div>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--auto-align');
    assert.dom('.cds--tooltip').hasClass('cds--popover--bottom');
    assert.true(
      (find('.cds--tooltip-content') as HTMLElement).matches(':popover-open'),
    );
  });

  test('without @autoAlign the alignment class does not change', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close" @align="top" @defaultOpen={{true}}>
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--top');
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--auto-align');
  });

  test('keeps its defaults when args are passed as undefined', async function (assert) {
    await render(
      <template>
        <Tooltip
          @label="Close"
          @align={{undefined}}
          @dropShadow={{undefined}}
          @highContrast={{undefined}}
        >
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert
      .dom('.cds--tooltip')
      .hasClass('cds--popover--top')
      .hasClass('cds--popover--high-contrast')
      .doesNotHaveClass('cds--popover--drop-shadow');
  });

  test('maps deprecated alignments to the new names', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close" @align="top-left">
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('.cds--tooltip').hasClass('cds--popover--top-start');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Tooltip @label="Close" id="my-tooltip" class="custom-class">
          <button type="button">Trigger</button>
        </Tooltip>
      </template>,
    );

    assert.dom('#my-tooltip').exists();
    assert.dom('.cds--tooltip').hasClass('custom-class');
  });
});
