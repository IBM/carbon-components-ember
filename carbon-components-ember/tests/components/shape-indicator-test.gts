import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, find } from '@ember/test-helpers';
import ShapeIndicator from '#src/components/shape-indicator.gts';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
  disableCarbonStyles,
  enableCarbonStyles,
} from '../helpers';

module('Integration | Component | ShapeIndicator', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display shape indicator', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template><ShapeIndicator @kind="stable" @label="Stable" /></template>,
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

  test('dark theme: should display shape indicator', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    const darkStyleValue = tracked('');
    await render(
      <template>
        <ShapeIndicator @kind="stable" @label="Stable" />
        <style>
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

  test('should display the label and the kind class', async function (assert) {
    await render(
      <template><ShapeIndicator @kind="failed" @label="Failed" /></template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds--shape-indicator').hasText('Failed');
    assert.dom('.cds--shape-indicator--failed').exists();
  });

  test('should add the 14 text size class', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind="failed" @label="Failed" @textSize={{14}} />
      </template>,
    );

    assert.dom('.cds--shape-indicator--14').exists();
  });

  test('should render nothing for an unrecognized kind', async function (assert) {
    await render(
      <template>
        {{! @glint-expect-error: intentionally invalid kind }}
        <ShapeIndicator @kind="unknown" @label="Failed" />
      </template>,
    );

    assert.dom('.cds--shape-indicator').doesNotExist();
  });

  test('should hide the label visually and expose it as an accessible tooltip in compact mode', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind="failed" @label="Failed" @compact={{true}} />
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
  test('compact trigger is a definition-term button with aria-expanded', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind="failed" @label="Failed" @compact={{true}} />
      </template>,
    );
    await waitForAnimationFrame();

    assert
      .dom('button.cds--definition-term.cds--shape-indicator__button')
      .hasAttribute('aria-expanded', 'false');
  });

  test('compact tooltip aligns right by default', async function (assert) {
    await render(
      <template>
        <ShapeIndicator @kind="failed" @label="Failed" @compact={{true}} />
      </template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds--popover-container').hasClass('cds--popover--right');
  });

  test('@align reaches the popover container', async function (assert) {
    await render(
      <template>
        <ShapeIndicator
          @kind="failed"
          @label="Failed"
          @compact={{true}}
          @align="bottom"
        />
      </template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds--popover-container').hasClass('cds--popover--bottom');
    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--right');
  });
});
