import '@carbon/charts/styles.css';

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { runTask } from 'ember-lifeline';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import LineChart from './line.gts';

import type { ChartData } from './-components/chart.gts';
import type Owner from '@ember/owner';

// Mirrors the line stories of `@carbon/charts`' own storybook ("Line
// (discrete)", "Line (time series)") with comparable demo data, plus the
// docs-app's animated sine wave (`Sinus`).
//
// Parity gaps: the wrapper only exposes the axis `title`, `scaleType` and
// `stacked` options (no `mapsTo`, `domain`, ticks, curve, points, ...), and
// only `resizable` and `legendClickable` of the chart options.

const KEYS = ['Qty', 'More', 'Sold', 'Restocking', 'Misc'];
const DATASETS = [
  { group: 'Dataset 1', values: [34200, 23500, 53100, 42300, 12300] },
  { group: 'Dataset 2', values: [34200, 53200, 42300, 21400, 0] },
  { group: 'Dataset 3', values: [41200, 18400, 34210, 1400, 42100] },
  { group: 'Dataset 4', values: [22000, 1200, 9000, 24000, 3000] },
];
const DATES = [
  new Date(2019, 0, 1),
  new Date(2019, 0, 5),
  new Date(2019, 0, 8),
  new Date(2019, 0, 13),
  new Date(2019, 0, 17),
];

const STYLE = htmlSafe('height: 400px; width: 600px; display: inline-block');

/**
 * The docs-app's sine wave: shifts the wave every second, to show that the
 * chart follows changes to its `TabularData`.
 */
interface SinusSignature {
  Args: { title?: string; resizable?: boolean; legendClickable?: boolean };
}

class Sinus extends Component<SinusSignature> {
  @tracked start = 0;

  constructor(owner: Owner, args: SinusSignature['Args']) {
    super(owner, args);
    this.tick();
  }

  // `runTask` is cancelled when the story is torn down.
  tick() {
    runTask(
      this,
      () => {
        this.start = (this.start + 1) % 200;
        this.tick();
      },
      1000,
    );
  }

  get data(): ChartData[] {
    const values: ChartData[] = [];
    const s = (this.start * 2 * Math.PI) / 100;
    let c = 0;
    for (let i = s; i < s + 2 * Math.PI; i += Math.PI / 50) {
      c++;
      values.push({ group: 'sinus', date: c, value: Math.sin(i) });
    }
    return values;
  }

  <template>
    <LineChart
      @title={{@title}}
      @resizable={{@resizable}}
      @legendClickable={{@legendClickable}}
      style={{STYLE}}
      as |chart|
    >
      <chart.Axis @axis="left" @title="y" />
      <chart.Axis @axis="bottom" @title="x" @scaleType="time" />
      <chart.TabularData @group="sinus" @data={{this.data}} />
    </LineChart>
  </template>
}

const meta = preview.meta({
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    a11y: {
      config: {
        // @carbon/charts' own toolbar nests focusable elements in its
        // role="button" controls (carbon-design-system/carbon-charts#2130);
        // the wrapper renders no interactive controls of its own.
        rules: [{ id: 'nested-interactive', enabled: false }],
      },
    },
    docs: {
      description: {
        component:
          'A line chart, rendered by `@carbon/charts`: one line per `TabularData` group. It yields `Axis` (one each for `left` and `bottom`, both required), `TabularData` (from `@values` plus `@keys` or `@dates`, or from `@data`), `ColorScale` (a color per group) and `ColorPairing` (a Carbon color pairing). Load `@carbon/charts/styles.css` alongside the Carbon styles.',
      },
    },
  },
  args: {
    title: 'Sales over time',
    resizable: true,
    legendClickable: true,
  },
  render: (args) => {
    const values = [65000, 29123, 35213, 51213, 16932];
    const keys = ['Quantity', 'Leads', 'Sold', 'Restocking', 'Misc'];

    return <template>
      <LineChart
        @title={{args.title}}
        @resizable={{args.resizable}}
        @legendClickable={{args.legendClickable}}
        style={{STYLE}}
        as |chart|
      >
        <chart.Axis @axis="left" @title="2018 Annual Sales" @primary={{true}} />
        <chart.Axis
          @axis="bottom"
          @title="Figures"
          @secondary={{true}}
          @scaleType="labels"
        />
        <chart.TabularData @group="Name" @keys={{keys}} @values={{values}} />
      </LineChart>
    </template>;
  },
});

export const Default = meta.story();

export const Discrete = meta.story({
  render: (args) => <template>
    <LineChart
      @title={{args.title}}
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style={{STYLE}}
      as |chart|
    >
      <chart.Axis @axis="left" @title="Conversion rate" />
      <chart.Axis
        @axis="bottom"
        @title="2019 Annual Sales"
        @scaleType="labels"
      />
      {{#each DATASETS as |dataset|}}
        <chart.TabularData
          @group={{dataset.group}}
          @keys={{KEYS}}
          @values={{dataset.values}}
        />
      {{/each}}
    </LineChart>
  </template>,
});

Discrete.test(
  'toggles a dataset from the legend',
  async ({ canvas, canvasElement, userEvent }) => {
    const lines = () => canvasElement.querySelectorAll('path.line');
    await waitFor(() => expect(lines()).toHaveLength(4));

    await userEvent.click(canvas.getByText('Dataset 1'));
    await waitFor(() => expect(lines().length).not.toBe(4));
  },
);

export const TimeSeries = meta.story({
  render: (args) => <template>
    <LineChart
      @title={{args.title}}
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style={{STYLE}}
      as |chart|
    >
      <chart.Axis @axis="left" @title="Conversion rate" />
      <chart.Axis @axis="bottom" @title="Date" @scaleType="time" />
      {{#each DATASETS as |dataset|}}
        <chart.TabularData
          @group={{dataset.group}}
          @dates={{DATES}}
          @values={{dataset.values}}
        />
      {{/each}}
    </LineChart>
  </template>,
});

export const ColorPairing = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`ColorPairing` picks one of Carbon’s color pairings: `@numberOfVariants` is the number of colors in the palette and `@option` which pairing of that size to use.',
      },
    },
  },
  render: (args) => <template>
    <LineChart
      @title={{args.title}}
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style={{STYLE}}
      as |chart|
    >
      <chart.ColorPairing @numberOfVariants={{4}} @option={{2}} />
      <chart.Axis @axis="left" @title="Conversion rate" />
      <chart.Axis
        @axis="bottom"
        @title="2019 Annual Sales"
        @scaleType="labels"
      />
      {{#each DATASETS as |dataset|}}
        <chart.TabularData
          @group={{dataset.group}}
          @keys={{KEYS}}
          @values={{dataset.values}}
        />
      {{/each}}
    </LineChart>
  </template>,
});

export const CustomColors = meta.story({
  parameters: {
    docs: {
      description: {
        story: '`ColorScale` assigns a color to a data group (by its name).',
      },
    },
  },
  render: (args) => <template>
    <LineChart
      @title={{args.title}}
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
      style={{STYLE}}
      as |chart|
    >
      <chart.ColorScale @name="Dataset 1" @color="#da1e28" />
      <chart.ColorScale @name="Dataset 2" @color="#0f62fe" />
      <chart.ColorScale @name="Dataset 3" @color="#198038" />
      <chart.ColorScale @name="Dataset 4" @color="#8a3ffc" />
      <chart.Axis @axis="left" @title="Conversion rate" />
      <chart.Axis
        @axis="bottom"
        @title="2019 Annual Sales"
        @scaleType="labels"
      />
      {{#each DATASETS as |dataset|}}
        <chart.TabularData
          @group={{dataset.group}}
          @keys={{KEYS}}
          @values={{dataset.values}}
        />
      {{/each}}
    </LineChart>
  </template>,
});

export const SineWave = meta.story({
  name: 'Sinus',
  parameters: {
    docs: {
      description: {
        story:
          'The chart follows changes to its data: this sine wave shifts every second.',
      },
    },
  },
  render: (args) => <template>
    <Sinus
      @title={{args.title}}
      @resizable={{args.resizable}}
      @legendClickable={{args.legendClickable}}
    />
  </template>,
});

SineWave.test('redraws when its data changes', async ({ canvasElement }) => {
  const line = () => canvasElement.querySelector('path.line');
  await waitFor(() => expect(line()?.getAttribute('d')).toBeTruthy(), {
    timeout: 5000,
  });
  const first = line()!.getAttribute('d');
  await waitFor(() => expect(line()!.getAttribute('d')).not.toBe(first), {
    timeout: 5000,
  });
});
