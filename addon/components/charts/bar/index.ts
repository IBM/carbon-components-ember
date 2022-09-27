import { SimpleBarChart } from '@carbon/charts';
import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators/index';
import { CarbonChartSignature } from 'carbon-components-ember/components/charts/-components/chart/index';

/** @documenter yuidoc */

type Args = {
  labels: string[];
  resizable?: boolean;
  legendClickable?: boolean;
}

export interface CarbonBarChartSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: CarbonChartSignature['Blocks']['default']
  }
}

/**
 The CarbonBarChart

 @class CarbonBarChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonBarChart extends Component<CarbonBarChartSignature> {
  ChartClass = SimpleBarChart;

  @defaultArgs
  args: Args = {
    /**
     * Chart labels
     @argument labels
     @type String[]
     */
    labels: [],

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
    legendClickable: true
  };
}

export default CarbonBarChart;
