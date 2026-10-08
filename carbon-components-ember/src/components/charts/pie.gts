import Chart from './-components/chart.gts';
import { PieChart as CarbonChartsPieChart } from '@carbon/charts';
import Component from '@glimmer/component';
import { defaultArgs } from '../../utils/decorators.ts';
import type { ChartSignature } from '../../components/charts/-components/chart.gts';

export interface PieChartSignature {
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
 The PieChart

 @class PieChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
export default class PieChart extends Component<PieChartSignature> {
  ChartClass = CarbonChartsPieChart;

  @defaultArgs
  args: PieChartSignature['Args'] = {
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
