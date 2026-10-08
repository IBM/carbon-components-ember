import Chart from './-components/chart.gts';
import { LineChart as CarbonChartsLineChart } from '@carbon/charts';
import Component from '@glimmer/component';
import type { ChartSignature } from './-components/chart.gts';

export interface LineChartSignature {
  Args: {
    /**
     * The chart's title, rendered by @carbon/charts as the chart's heading
     * (its `title` option).
     */
    title?: string;
    resizable?: boolean;
    legendClickable?: boolean;
  };
  Element: ChartSignature['Element'];
  Blocks: {
    default: ChartSignature['Blocks']['default'];
  };
}

/**
 The LineChart

 @class LineChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
export default class LineChart extends Component<LineChartSignature> {
  ChartClass = CarbonChartsLineChart;
  args: LineChartSignature['Args'] = {
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
