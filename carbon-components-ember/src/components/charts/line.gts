import Chart from './-components/chart.gts';
import { LineChart } from '@carbon/charts';
import Component from '@glimmer/component';
import type { CarbonChartSignature } from './-components/chart.gts';

export type Args = {
  /**
   * The chart's title, rendered by @carbon/charts as the chart's heading
   * (its `title` option).
   */
  title?: string;
  resizable?: boolean;
  legendClickable?: boolean;
};

export interface CarbonLineChartSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: CarbonChartSignature['Blocks']['default'];
  };
}

/**
 The CarbonLineChart

 @class CarbonLineChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
export default class CarbonLineChart extends Component<CarbonLineChartSignature> {
  ChartClass = LineChart;
  args: Args = {
    /**
     * Is resizable
     @argument resizable
     @type boolean
     */
    resizable: true,

    /**
     * Is legendClickable
     @argument legendClickable
     @type boolean
     */
    legendClickable: true,
  };

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
