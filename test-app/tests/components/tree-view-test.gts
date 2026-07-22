import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender } from '@ember/test-helpers';
import TreeView from 'carbon-components-ember/components/tree-view';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | TreeView', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display tree view', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' />
          <Node @id='node-2' @label='Node 2' @isExpanded={{true}} as |Child|>
            <Child @id='node-2-1' @label='Node 2.1' />
          </Node>
        </TreeView>
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

  test('dark theme: should display tree view', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' />
          <Node @id='node-2' @label='Node 2' @isExpanded={{true}} as |Child|>
            <Child @id='node-2-1' @label='Node 2.1' />
          </Node>
        </TreeView>
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

  test('renders a label and tree with the correct roles', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' />
        </TreeView>
      </template>,
    );

    assert.dom('.cds--label').hasText('Tree View');
    assert.dom('[role="tree"]').exists();
    assert.dom('[role="tree"]').hasClass('cds--tree--sm');
    assert.dom('[role="treeitem"]').exists({ count: 1 });
    assert.dom('[role="treeitem"]').hasClass('cds--tree-leaf-node');
  });

  test('@hideLabel visually hides the label but keeps it accessible', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' @hideLabel={{true}} as |Node|>
          <Node @id='node-1' @label='Node 1' />
        </TreeView>
      </template>,
    );

    assert.dom('.cds--label').doesNotExist();
    assert.dom('[role="tree"]').hasAttribute('aria-label', 'Tree View');
  });

  test('a node with children renders as a parent node and can be expanded/collapsed', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='parent' @label='Parent' as |Child|>
            <Child @id='child' @label='Child' />
          </Node>
        </TreeView>
      </template>,
    );

    assert.dom('.cds--tree-parent-node').exists({ count: 1 });
    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'false');
    assert.dom('.cds--tree-node__children').hasClass('cds--tree-node__children--hidden');

    await click('.cds--tree-parent-node__toggle');

    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'true');
    assert
      .dom('.cds--tree-node__children')
      .doesNotHaveClass('cds--tree-node__children--hidden');
  });

  test('@isExpanded sets the initial expansion state', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='parent' @label='Parent' @isExpanded={{true}} as |Child|>
            <Child @id='child' @label='Child' />
          </Node>
        </TreeView>
      </template>,
    );

    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'true');
  });

  test('clicking a node selects it', async function (assert) {
    let selected: string[] = [];
    const onSelect = (ids: string[]) => {
      selected = ids;
    };
    await render(
      <template>
        <TreeView @label='Tree View' @onSelect={{onSelect}} as |Node|>
          <Node @id='node-1' @label='Node 1' />
          <Node @id='node-2' @label='Node 2' />
        </TreeView>
      </template>,
    );

    await click('#node-1');
    assert.dom('#node-1').hasAttribute('aria-selected', 'true');
    assert.dom('#node-2').hasAttribute('aria-selected', 'false');
    assert.deepEqual(selected, ['node-1']);

    await click('#node-2');
    assert.dom('#node-1').hasAttribute('aria-selected', 'false');
    assert.dom('#node-2').hasAttribute('aria-selected', 'true');
    assert.deepEqual(selected, ['node-2']);
  });

  test('disabled nodes cannot be selected', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' @disabled={{true}} />
        </TreeView>
      </template>,
    );

    assert.dom('#node-1').hasClass('cds--tree-node--disabled');
    assert.dom('#node-1').doesNotHaveAttribute('aria-selected');

    await click('#node-1');
    assert.dom('#node-1').doesNotHaveClass('cds--tree-node--selected');
  });

  test('@multiselect allows selecting multiple nodes with the meta key', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' @multiselect={{true}} as |Node|>
          <Node @id='node-1' @label='Node 1' />
          <Node @id='node-2' @label='Node 2' />
        </TreeView>
      </template>,
    );

    await click('#node-1');
    await click('#node-2', { metaKey: true });

    assert.dom('#node-1').hasAttribute('aria-selected', 'true');
    assert.dom('#node-2').hasAttribute('aria-selected', 'true');
  });
});
