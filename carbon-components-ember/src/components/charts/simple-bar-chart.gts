import Chart from './-components/chart.gts';
import { SimpleBarChart as CarbonChartsSimpleBarChart } from '@carbon/charts';
import Component from '@glimmer/component';
import type { ChartSignature } from './-components/chart.gts';

export interface SimpleBarChartSignature {
  Args: {
    /**
     * The chart's title, rendered by @carbon/charts as the chart's heading
     * (its `title` option).
     */
    title?: string;
    /** Whether the chart resizes with its container. Defaults to `true`. */
    resizable?: boolean;
    /**
     * Whether clicking a legend item shows or hides its data. Defaults to
     * `true`.
     */
    legendClickable?: boolean;
  };
  Element: ChartSignature['Element'];
  Blocks: {
    default: ChartSignature['Blocks']['default'];
  };
}

export default class SimpleBarChart extends Component<SimpleBarChartSignature> {
  ChartClass = CarbonChartsSimpleBarChart;

  <template>
    <Chart
      {{! eslint-disable-next-line ember/template-no-capital-arguments }}
      @ChartClass={{this.ChartClass}}
      @title={{@title}}
      @resizable={{@resizable}}
      @legendClickable={{@legendClickable}}
      ...attributes
      as |chart|
    >
      {{yield chart}}
    </Chart>
  </template>
}
