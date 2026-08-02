import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, find, waitUntil } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import IconIndicator from 'carbon-components-ember/components/icon-indicator';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | IconIndicator', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display icon indicator', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <IconIndicator @kind='succeeded' @label='Succeeded' />
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitUntil(() => find('.cds--icon-indicator svg'));
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

  test('dark theme: should display icon indicator', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <IconIndicator @kind='succeeded' @label='Succeeded' />
        <style>{{styleValue.current}}</style>
        <style>{{darkStyleValue.current}}</style>
      </template>,
    );

    await waitUntil(() => find('.cds--icon-indicator svg'));
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
      <template><IconIndicator @kind='failed' @label='Failed' /></template>,
    );
    await waitUntil(() => find('.cds--icon-indicator svg'));

    assert.dom('.cds--icon-indicator').hasText('Failed');
    assert.dom('.cds--icon-indicator--failed').exists();
  });

  const kinds = [
    'failed',
    'caution-major',
    'caution-minor',
    'undefined',
    'succeeded',
    'normal',
    'in-progress',
    'incomplete',
    'not-started',
    'pending',
    'unknown',
    'informative',
  ] as const;

  for (const kind of kinds) {
    test(`should render the ${kind} icon`, async function (assert) {
      await render(
        <template><IconIndicator @kind={{kind}} @label={{kind}} /></template>,
      );
      await waitUntil(() => find(`.cds--icon-indicator--${kind}`));

      assert.dom(`.cds--icon-indicator--${kind}`).exists();
    });
  }

  test('should add the 20 size class', async function (assert) {
    await render(
      <template>
        <IconIndicator @kind='failed' @label='Failed' @size={{20}} />
      </template>,
    );

    assert.dom('.cds--icon-indicator--20').exists();
  });

  test('should render nothing for an unrecognized kind', async function (assert) {
    await render(
      // @ts-expect-error intentionally invalid kind
      <template><IconIndicator @kind='bogus' @label='Failed' /></template>,
    );

    assert.dom('.cds--icon-indicator').doesNotExist();
  });

  test('should hide the label visually and expose it as a tooltip in compact mode', async function (assert) {
    await render(
      <template>
        <IconIndicator @kind='failed' @label='Failed' @compact={{true}} />
      </template>,
    );
    await waitUntil(() => find('.cds--icon-indicator__button svg'));

    assert.dom('.cds--icon-indicator__button').exists();
    assert
      .dom('.cds--icon-indicator__button .cds--visually-hidden')
      .hasText('Failed');
    assert.ok(
      find('.cds--icon-indicator__button')?.getAttribute('aria-describedby'),
      'the button gets an aria-describedby pointing at the tooltip',
    );
  });

  test('should use iconDescription instead of label for the accessible name in compact mode', async function (assert) {
    await render(
      <template>
        <IconIndicator
          @kind='failed'
          @label='Failed'
          @iconDescription='Something failed'
          @compact={{true}}
        />
      </template>,
    );
    await waitUntil(() => find('.cds--icon-indicator__button svg'));

    assert
      .dom('.cds--icon-indicator__button .cds--visually-hidden')
      .hasText('Something failed');
  });

  test('should support align and autoAlign in compact mode', async function (assert) {
    await render(
      <template>
        <IconIndicator
          @kind='failed'
          @label='Failed'
          @compact={{true}}
          @align='top'
          @autoAlign={{true}}
        />
      </template>,
    );
    await waitUntil(() => find('.cds--icon-indicator__button svg'));

    assert.dom('.cds--icon-indicator__button').exists();
    assert.ok(
      find('.cds--icon-indicator__button')?.getAttribute('aria-describedby'),
      'the button gets an aria-describedby pointing at the tooltip',
    );
  });
});
