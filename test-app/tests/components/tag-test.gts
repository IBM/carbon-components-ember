import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, waitUntil, find } from '@ember/test-helpers';
import Tag from 'carbon-components-ember/components/tag';
import { Add } from 'carbon-components-ember/icons';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | Tag', (hooks) => {
  setupRenderingTest(hooks);

  test('should render with the given type', async function (assert) {
    await render(<template><Tag @type='red'>Tag content</Tag></template>);

    assert.dom('.cds--tag').exists();
    assert.dom('.cds--tag').hasClass('cds--tag--red');
    assert.dom('.cds--tag__label').hasText('Tag content');
  });

  test('should render the high-contrast and outline types', async function (assert) {
    await render(
      <template><Tag @type='high-contrast'>Tag content</Tag></template>,
    );
    assert.dom('.cds--tag').hasClass('cds--tag--high-contrast');

    await render(<template><Tag @type='outline'>Tag content</Tag></template>);
    assert.dom('.cds--tag').hasClass('cds--tag--outline');
  });

  test('should generate a default id', async function (assert) {
    await render(<template><Tag @type='red'>Tag content</Tag></template>);

    assert.dom('.cds--tag').hasAttribute('id', /^tag-/);
  });

  test('should use the provided id', async function (assert) {
    await render(
      <template><Tag @type='red' @id='my-tag'>Tag content</Tag></template>,
    );

    assert.dom('.cds--tag').hasAttribute('id', 'my-tag');
  });

  test('should apply the disabled class', async function (assert) {
    await render(
      <template><Tag @type='red' @disabled={{true}}>Tag content</Tag></template>,
    );

    assert.dom('.cds--tag').hasClass('cds--tag--disabled');
  });

  test('should apply the size classes', async function (assert) {
    await render(
      <template><Tag @type='red' @size='lg'>Tag content</Tag></template>,
    );

    assert.dom('.cds--tag').hasClass('cds--tag--lg');
    assert.dom('.cds--tag').hasClass('cds--layout--size-lg');
  });

  test('should render a renderIcon component', async function (assert) {
    await render(
      <template><Tag @type='red' @renderIcon={{Add}}>Tag content</Tag></template>,
    );
    await waitUntil(() => find('.cds--tag__custom-icon svg'));

    assert.dom('.cds--tag__custom-icon svg').exists();
    assert.dom('.cds--tag__custom-icon svg').hasAttribute('width', '16');
    assert.dom('.cds--tag__custom-icon svg').hasAttribute('height', '16');
  });

  test('positions the custom icon inside its wrapper under real Carbon styles', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Tag @type='red' @renderIcon={{Add}}>Tag content</Tag>
        <style>{{styleValue.current}}</style>
      </template>,
    );
    await waitUntil(() => find('.cds--tag__custom-icon svg'));
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();

    const wrapper = find('.cds--tag__custom-icon') as HTMLElement;
    const svg = wrapper.querySelector('svg') as SVGElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    assert.strictEqual(
      getComputedStyle(svg).marginRight,
      '0px',
      'the icon has no default margin pushing it out of its 16px box',
    );
    assert.true(
      svgRect.width <= wrapperRect.width && svgRect.height <= wrapperRect.height,
      'the icon fits inside its wrapper instead of overflowing it',
    );
  });

  test('should not render the icon wrapper for the sm size', async function (assert) {
    await render(
      <template>
        <Tag @type='red' @size='sm' @renderIcon={{Add}}>Tag content</Tag>
      </template>,
    );

    assert.dom('.cds--tag__custom-icon').doesNotExist();
  });

  test('should render a decorator component', async function (assert) {
    await render(
      <template><Tag @type='red' @decorator={{Add}}>Tag content</Tag></template>,
    );
    await waitUntil(() => find('.cds--tag__decorator svg'));

    assert.dom('.cds--tag__decorator svg').exists();
  });

  test('should render a deprecated slug component without the decorator wrapper', async function (assert) {
    await render(
      <template><Tag @type='red' @slug={{Add}}>Tag content</Tag></template>,
    );
    await waitUntil(() => find('.cds--tag svg'));

    assert.dom('.cds--tag__decorator').doesNotExist();
    assert.dom('.cds--tag > svg').exists();
  });
});
