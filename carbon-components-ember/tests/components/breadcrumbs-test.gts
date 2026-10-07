import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender } from '@ember/test-helpers';
import Breadcrumbs from '#src/components/breadcrumbs.gts';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Breadcrumbs', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = tracked('');
    await render(
      <template>
        <Breadcrumbs @crumbs={{array "a" "b" "c"}} @current="b" />
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

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = tracked('');
    const darkStyleValue = tracked('');
    await render(
      <template>
        <Breadcrumbs @crumbs={{array "a" "b" "c"}} @current="b" />
        <style>
          {{carbonStyle.default}}
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

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should allow click without handler', async function (assert) {
    assert.expect(0);
    await render(
      <template><Breadcrumbs @crumbs={{array "a" "b" "c"}} /></template>,
    );

    await click('.cds--breadcrumb-item');
  });

  test('selecting a crumb does not follow its href="#"', async function (assert) {
    const selected: string[] = [];
    const onSelect = (crumb: string) => selected.push(crumb);
    await render(
      <template>
        <Breadcrumbs @crumbs={{array "a" "b"}} @onSelect={{onSelect}} />
      </template>,
    );

    const link = document.querySelector<HTMLAnchorElement>(
      '.cds--breadcrumb-item a',
    )!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    assert.true(event.defaultPrevented, 'navigation to "#" is cancelled');
    assert.deepEqual(selected, ['a']);
  });

  test('should change selected item style', async function (this: RenderingTestContext, assert) {
    const selected = tracked('');
    await render(
      <template>
        <Breadcrumbs
          @crumbs={{array "a" "b" "c"}}
          @current={{selected.value}}
        />
        <style>
          {{carbonStyle.default}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    selected.value = 'a';
    await rerender();
    await waitForAnimationFrame();
    const aSelectedStyle = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    selected.value = 'b';
    await rerender();
    await waitForAnimationFrame();
    const bSelectedStyle = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiffA = getStylesDiff(styles, aSelectedStyle);
    const stylesDiffB = getStylesDiff(aSelectedStyle, bSelectedStyle);

    assert.snapshot(stylesDiffA, 'does have correct initial styles');
    assert.snapshot(
      stylesDiffB,
      'does correctly change styles after selection',
    );
  });
});
