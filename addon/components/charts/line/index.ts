import { LineChart } from '@carbon/charts';
import Component from '@glimmer/component';

type Args = {
  labels: string[];
  resizable: boolean;
  legendClickable: boolean;
}

export interface CarbonLineChartSignature {
  Args: Args;
  Blocks: {
    default: [LineChart]
  }
}

/**
 The CarbonLineChart

 @class CarbonLineChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonLineChart extends Component<CarbonLineChartSignature> {
  ChartClass = LineChart;
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

export default CarbonLineChart;
