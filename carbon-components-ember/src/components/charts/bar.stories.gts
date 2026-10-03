import '@carbon/charts/styles.css';

import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import BarChart from './bar.gts';

// Mirrors the simple bar stories of `@carbon/charts`' own storybook
// ("Simple bar (discrete)" / "Simple bar (time series)") with the same
// demo data, as far as the Ember wrapper supports them.
//
// Parity gaps: the wrapper only exposes the axis `title`, `scaleType` and
// `stacked` options (no `mapsTo`, `domain`, ticks, ...), only `resizable` and
// `legendClickable` of the chart options, and only `SimpleBarChart` (no
// grouped/stacked/floating/horizontal bar charts).

const KEYS = ['Qty', 'More', 'Sold', 'Restocking', 'Misc'];
const VALUES = [65000, 29123, 35213, 51213, 16932];
const DATES = [
  new Date(2019, 0, 1),
  new Date(2019, 0, 5),
  new Date(2019, 0, 8),
  new Date(2019, 0, 13),
  new Date(2019, 0, 17),
];

const meta = preview.meta({
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    // Bugs (axe): the wrapper exposes no chart `title` option, so
    // @carbon/charts always renders an empty `<p role="heading">`
    // (empty-heading); @carbon/charts' own toolbar nests focusable elements
    // in its `role="button"` controls (nested-interactive).
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          'A simple bar chart, rendered by `@carbon/charts`. It yields `Axis` (one each for `left` and `bottom`, both required), `TabularData` (one per data group, from `@values` plus `@keys` or `@dates`, or from `@data`), `ColorScale` (a color per group) and `ColorPairing` (a Carbon color pairing). Load `@carbon/charts/styles.css` alongside the Carbon styles.',
      },
    },
  },
  args: {
    resizable: true,
    legendClickable: true,
  },
  render: (args) => <template>
    <BarChart
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style="height: 400px; width: 600px; display: inline-block"
      as |chart|
    >
      <chart.Axis @axis="left" @title="2018 Annual Sales" @primary={{true}} />
      <chart.Axis
        @axis="bottom"
        @title="Figures"
        @secondary={{true}}
        @scaleType="labels"
      />
      <chart.TabularData @group="Name" @keys={{KEYS}} @values={{VALUES}} />
    </BarChart>
  </template>,
});

export const Discrete = meta.story();

Discrete.test('draws a bar per key', async ({ canvasElement }) => {
  await waitFor(
    () => expect(canvasElement.querySelectorAll('path.bar')).toHaveLength(5),
    { timeout: 5000 },
  );
  await expect(canvasElement).toHaveTextContent('2018 Annual Sales');
});

export const TimeSeries = meta.story({
  render: (args) => <template>
    <BarChart
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style="height: 400px; width: 600px; display: inline-block"
      as |chart|
    >
      <chart.Axis @axis="left" @title="Sales" />
      <chart.Axis @axis="bottom" @title="Date" @scaleType="time" />
      <chart.TabularData @group="Qty" @dates={{DATES}} @values={{VALUES}} />
    </BarChart>
  </template>,
});

export const CustomColors = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`ColorScale` assigns a color to a data group (by its `@group` name).',
      },
    },
  },
  render: (args) => <template>
    <BarChart
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style="height: 400px; width: 600px; display: inline-block"
      as |chart|
    >
      <chart.ColorScale @name="Name" @color="#6929c4" />
      <chart.Axis @axis="left" @title="2018 Annual Sales" />
      <chart.Axis @axis="bottom" @title="Figures" @scaleType="labels" />
      <chart.TabularData @group="Name" @keys={{KEYS}} @values={{VALUES}} />
    </BarChart>
  </template>,
});
