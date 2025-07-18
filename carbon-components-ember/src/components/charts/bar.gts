import { default as Chart } from './-components/chart.gts';
import { SimpleBarChart } from '@carbon/charts';
import Component from '@glimmer/component';
import { defaultArgs } from '../../utils/decorators.ts';
import { type CarbonChartSignature } from './-components/chart.gts';

/** @documenter yuidoc */

export type Args = {
  resizable?: boolean;
  legendClickable?: boolean;
};

export interface CarbonBarChartSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: CarbonChartSignature['Blocks']['default'];
  };
}

/**
 The CarbonBarChart

 @class CarbonBarChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
export default class CarbonBarChart extends Component<CarbonBarChartSignature> {
  ChartClass = SimpleBarChart;

  @defaultArgs
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
      {{! template-lint-disable  no-capital-arguments }}
      @ChartClass={{this.ChartClass}}
      @resizable={{@resizable}}
      @legendClickable={{@legendClickable}}
      ...attributes
      as |chart|
    >
      {{yield chart}}
    </Chart>
  </template>
}
