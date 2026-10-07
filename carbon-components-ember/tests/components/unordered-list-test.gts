import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import UnorderedList from '#src/components/unordered-list.gts';
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

module('Integration | Component | UnorderedList', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display list', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template>
        <UnorderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </UnorderedList>
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

  test('dark theme: should display list', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    const darkStyleValue = tracked('');
    await render(
      <template>
        <UnorderedList>
          <li>Item 1</li>
          <li>Item 2</li>
        </UnorderedList>
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

  test('renders as an unordered list', async function (assert) {
    await render(
      <template>
        <UnorderedList>
          <li>Item 1</li>
        </UnorderedList>
      </template>,
    );

    assert.dom('ul').hasClass('cds--list--unordered');
    assert.dom('ul').doesNotHaveClass('cds--list--nested');
    assert.dom('ul').doesNotHaveClass('cds--list--expressive');
  });

  test('yields ListItem as contextual component', async function (assert) {
    await render(
      <template>
        <UnorderedList as |Item|>
          <Item>Item 1</Item>
          <Item>Item 2</Item>
        </UnorderedList>
      </template>,
    );

    assert.dom('ul > li').exists({ count: 2 });
    assert.dom('li:nth-of-type(1)').hasClass('cds--list__item');
    assert.dom('li:nth-of-type(1)').hasText('Item 1');
    assert.dom('li:nth-of-type(2)').hasClass('cds--list__item');
    assert.dom('li:nth-of-type(2)').hasText('Item 2');
  });

  test('@nested adds the nested class', async function (assert) {
    await render(
      <template>
        <UnorderedList @nested={{true}}>
          <li>Item 1</li>
        </UnorderedList>
      </template>,
    );

    assert.dom('ul').hasClass('cds--list--nested');
  });

  test('@isExpressive adds the expressive class', async function (assert) {
    await render(
      <template>
        <UnorderedList @isExpressive={{true}}>
          <li>Item 1</li>
        </UnorderedList>
      </template>,
    );

    assert.dom('ul').hasClass('cds--list--expressive');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <UnorderedList id="my-list" class="custom-class">
          <li>Item 1</li>
        </UnorderedList>
      </template>,
    );

    assert.dom('#my-list').exists();
    assert.dom('ul').hasClass('custom-class');
    assert.dom('ul').hasClass('cds--list--unordered');
  });
});
