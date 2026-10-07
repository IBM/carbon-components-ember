import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render, settled, waitUntil } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import LineChart from '#src/components/charts/line.gts';
import type { ChartData } from '#src/components/charts/-components/chart.gts';

const KEYS = ['Qty', 'More', 'Sold'];
const FIRST = [10, 20, 30];
const SECOND = [30, 20, 10];

const lines = () => findAll('path.line');
const chartText = () =>
  document.querySelector('[data-test-chart]')?.textContent ?? '';

module('Integration | Component | Charts', function (hooks) {
  setupRenderingTest(hooks);

  test('removing a TabularData removes its dataset', async function (assert) {
    const showSecond = tracked(true);

    await render(
      <template>
        <LineChart
          data-test-chart
          style="height: 300px; width: 500px"
          as |chart|
        >
          <chart.Axis @axis="left" @title="y" />
          <chart.Axis @axis="bottom" @title="x" @scaleType="labels" />
          <chart.TabularData @group="First" @keys={{KEYS}} @values={{FIRST}} />
          {{#if showSecond.value}}
            <chart.TabularData
              @group="Second"
              @keys={{KEYS}}
              @values={{SECOND}}
            />
          {{/if}}
        </LineChart>
      </template>,
    );

    await waitUntil(() => lines().length === 2, { timeout: 5000 });
    assert.strictEqual(lines().length, 2);

    showSecond.value = false;
    await settled();

    await waitUntil(() => lines().length === 1, { timeout: 5000 });
    assert.strictEqual(lines().length, 1, 'the removed group is gone');
  });

  test('changing @group replaces the dataset instead of adding one', async function (assert) {
    const group = tracked('Original');

    await render(
      <template>
        <LineChart
          data-test-chart
          style="height: 300px; width: 500px"
          as |chart|
        >
          <chart.Axis @axis="left" @title="y" />
          <chart.Axis @axis="bottom" @title="x" @scaleType="labels" />
          <chart.TabularData
            @group={{group.value}}
            @keys={{KEYS}}
            @values={{FIRST}}
          />
        </LineChart>
      </template>,
    );

    await waitUntil(() => chartText().includes('Original'), { timeout: 5000 });

    group.value = 'Renamed';
    await settled();

    await waitUntil(() => chartText().includes('Renamed'), { timeout: 5000 });
    assert.notOk(chartText().includes('Original'), 'the old group is gone');
    assert.strictEqual(lines().length, 1);
  });

  test('option changes reach an existing chart', async function (assert) {
    const title = tracked('First title');

    await render(
      <template>
        <LineChart
          data-test-chart
          @title={{title.value}}
          style="height: 300px; width: 500px"
          as |chart|
        >
          <chart.Axis @axis="left" @title="y" />
          <chart.Axis @axis="bottom" @title="x" @scaleType="labels" />
          <chart.TabularData @group="First" @keys={{KEYS}} @values={{FIRST}} />
        </LineChart>
      </template>,
    );

    await waitUntil(() => chartText().includes('First title'), {
      timeout: 5000,
    });

    title.value = 'Second title';
    await settled();

    await waitUntil(() => chartText().includes('Second title'), {
      timeout: 5000,
    });
    assert.notOk(chartText().includes('First title'));
  });

  test('@data points are copied, not tagged in place', async function (assert) {
    const data: ChartData[] = KEYS.map((key, i) => ({
      group: '',
      key,
      value: FIRST[i]!,
    }));

    await render(
      <template>
        <LineChart
          data-test-chart
          style="height: 300px; width: 500px"
          as |chart|
        >
          <chart.Axis @axis="left" @title="y" />
          <chart.Axis @axis="bottom" @title="x" @scaleType="labels" />
          <chart.TabularData @group="Tagged" @data={{data}} />
        </LineChart>
      </template>,
    );

    await waitUntil(() => lines().length === 1, { timeout: 5000 });
    assert.deepEqual(
      data.map((point) => point.group),
      ['', '', ''],
      "the caller's objects keep their own group",
    );
  });
});
