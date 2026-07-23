import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, waitUntil } from '@ember/test-helpers';
import { array } from '@ember/helper';
import TreeView from 'carbon-components-ember/components/tree-view';
import { Folder } from 'carbon-components-ember/icons';
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
    assert.dom('.cds--tree-node__children').hasClass('cds--tree-node--hidden');

    await click('.cds--tree-parent-node__toggle');

    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--tree-node__children').doesNotHaveClass('cds--tree-node--hidden');
  });

  test('collapsing a node actually hides its children under real Carbon styles', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='parent' @label='Parent' as |Child|>
            <Child @id='child' @label='Child' />
          </Node>
        </TreeView>
        <style>{{styleValue.current}}</style>
      </template>,
    );
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();

    assert.dom('.cds--tree-node__children').isNotVisible();

    await click('.cds--tree-parent-node__toggle');
    await waitForAnimationFrame();

    assert.dom('.cds--tree-node__children').isVisible();
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

  test('the toggle caret points right when collapsed and down when expanded', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='parent' @label='Parent' as |Child|>
            <Child @id='child' @label='Child' />
          </Node>
        </TreeView>
      </template>,
    );

    // Uses the real caret--down path (points down unrotated); combined
    // with @carbon/styles' rotate(-90deg)/rotate(0) rules this renders as
    // right-pointing when collapsed and down-pointing when expanded.
    assert
      .dom('.cds--tree-parent-node__toggle-icon path')
      .hasAttribute('d', 'M24 12 16 22 8 12z');
    assert
      .dom('.cds--tree-parent-node__toggle-icon')
      .doesNotHaveClass('cds--tree-parent-node__toggle-icon--expanded');

    await click('.cds--tree-parent-node__toggle');

    assert
      .dom('.cds--tree-parent-node__toggle-icon')
      .hasClass('cds--tree-parent-node__toggle-icon--expanded');
  });

  test('a selected row highlights the full row width under real Carbon styles, not just the label text', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <TreeView @label='Tree View' @selected={{(array 'node-1' 'nested-child')}} as |Node|>
          <Node @id='node-1' @label='A' />
          <Node @id='parent' @label='Parent' @isExpanded={{true}} as |Child|>
            <Child @id='nested-child' @label='B' />
          </Node>
        </TreeView>
        <style>{{styleValue.current}}</style>
      </template>,
    );
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();

    const topLevelRow = document.querySelector('#node-1') as HTMLElement;
    const topLevelLabel = topLevelRow.querySelector(
      '.cds--tree-node__label',
    ) as HTMLElement;
    const rowRect = topLevelRow.getBoundingClientRect();
    const labelRect = topLevelLabel.getBoundingClientRect();

    assert
      .strictEqual(labelRect.left, rowRect.left, 'label background starts flush with the row\'s left edge');
    assert
      .strictEqual(labelRect.right, rowRect.right, 'label background extends to the row\'s right edge');

    const nestedRow = document.querySelector('#nested-child') as HTMLElement;
    const nestedLabel = nestedRow.querySelector(
      '.cds--tree-node__label',
    ) as HTMLElement;
    const nestedRowRect = nestedRow.getBoundingClientRect();
    const nestedLabelRect = nestedLabel.getBoundingClientRect();

    assert.strictEqual(
      nestedLabelRect.left,
      labelRect.left,
      'nested label background is also flush with the tree\'s absolute left edge, matching top-level rows',
    );
    assert.true(
      nestedRowRect.left > rowRect.left,
      'the nested row itself (and its text) is indented further than the top-level row',
    );
  });

  test('@icon renders the given icon before the label and adds the with-icon modifier class', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' @icon={{Folder}} />
        </TreeView>
      </template>,
    );

    assert.dom('#node-1').hasClass('cds--tree-node--with-icon');
    // The icon's SVG is loaded via a dynamic import, so wait for it to resolve.
    await waitUntil(() => document.querySelector('#node-1 .cds--tree-node__icon'));
    assert.dom('#node-1 .cds--tree-node__icon').exists();
  });

  test('a node with no @icon does not render an icon or the with-icon modifier class', async function (assert) {
    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node @id='node-1' @label='Node 1' />
        </TreeView>
      </template>,
    );

    assert.dom('#node-1').doesNotHaveClass('cds--tree-node--with-icon');
    assert.dom('#node-1 .cds--tree-node__icon').doesNotExist();
  });

  test('without @onToggle, @isExpanded only sets the initial state and the node can still be freely toggled', async function (assert) {
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

    await click('.cds--tree-parent-node__toggle');
    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'false');

    await click('.cds--tree-parent-node__toggle');
    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'true');
  });

  test('@onToggle makes expansion controlled: the node follows @isExpanded and reports toggles instead of managing its own state', async function (assert) {
    const expanded = cell(false);
    let reportedExpanded: boolean | undefined;
    const onToggle = (value: boolean) => {
      reportedExpanded = value;
    };

    await render(
      <template>
        <TreeView @label='Tree View' as |Node|>
          <Node
            @id='parent'
            @label='Parent'
            @isExpanded={{expanded.current}}
            @onToggle={{onToggle}}
            as |Child|
          >
            <Child @id='child' @label='Child' />
          </Node>
        </TreeView>
      </template>,
    );

    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'false');

    await click('.cds--tree-parent-node__toggle');

    // Clicking reports the intended next state, but does not itself change
    // the rendered state — the consumer must feed it back via @isExpanded.
    assert.strictEqual(reportedExpanded, true);
    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'false');

    expanded.current = true;
    await rerender();

    assert.dom('.cds--tree-parent-node').hasAttribute('aria-expanded', 'true');
  });
});
