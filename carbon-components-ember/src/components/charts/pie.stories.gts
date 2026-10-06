import '@carbon/charts/styles.css';

import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import PieChart from './pie.gts';

// Mirrors the pie story of `@carbon/charts`' own storybook, as far as the
// Ember wrapper supports it. Parity gaps: no donut chart, no pie `labels`/
// `alignment`/`sortFunction` options (only `resizable` and
// `legendClickable`), and the wrapper only draws once both a `left` and a
// `bottom` `Axis` are declared, even though a pie chart has no axes.

const meta = preview.meta({
  title: 'Charts/PieChart',
  component: PieChart,
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
          'A pie chart, rendered by `@carbon/charts`: one slice per `TabularData` group. Load `@carbon/charts/styles.css` alongside the Carbon styles.',
      },
    },
  },
  args: {
    title: 'Share by category',
    resizable: true,
    legendClickable: true,
  },
  render: (args) => {
    const quantity = [65000];
    const leads = [29123];
    const sold = [35213];
    const restocking = [51213];
    const misc = [16932];

    return <template>
      <PieChart
        @title={{args.title}}
        @resizable={{args.resizable}}
        @legendClickable={{args.legendClickable}}
        style="height: 400px; width: 600px; display: inline-block"
        as |chart|
      >
        <chart.Axis @axis="left" @title="2018 Annual Sales" />
        <chart.Axis @axis="bottom" @title="Figures" @scaleType="labels" />
        <chart.TabularData @group="Quantity" @values={{quantity}} />
        <chart.TabularData @group="Leads" @values={{leads}} />
        <chart.TabularData @group="Sold" @values={{sold}} />
        <chart.TabularData @group="Restocking" @values={{restocking}} />
        <chart.TabularData @group="Misc" @values={{misc}} />
      </PieChart>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'draws a slice and a legend item per group',
  async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll('path.slice')).toHaveLength(5),
      { timeout: 5000 },
    );
    for (const group of ['Quantity', 'Leads', 'Sold', 'Restocking', 'Misc']) {
      await expect(canvasElement).toHaveTextContent(group);
    }
  },
);
