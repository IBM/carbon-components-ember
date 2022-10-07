import { LineChart } from '@carbon/charts';
import Component from '@glimmer/component';
import { CarbonChartSignature } from 'carbon-components-ember/components/charts/-components/chart/index';

type Args = {
  resizable?: boolean;
  legendClickable?: boolean;
}

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
class CarbonLineChart extends Component<CarbonLineChartSignature> {
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
    legendClickable: true
  };
}

export default CarbonLineChart;
