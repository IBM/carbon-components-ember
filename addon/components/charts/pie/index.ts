import { PieChart } from '@carbon/charts';
import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators';
import { CarbonChartSignature } from 'carbon-components-ember/components/charts/-components/chart/index';

type Args = {
  labels: string[];
  resizable?: boolean;
  legendClickable?: boolean;
}

export interface CarbonPieChartSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: CarbonChartSignature['Blocks']['default']
  }
}

/**
 The CarbonPieChart

 @class CarbonPieChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonPieChart extends Component<CarbonPieChartSignature> {
  ChartClass = PieChart;

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

export default CarbonPieChart;
