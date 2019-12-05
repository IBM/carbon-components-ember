import { SimpleBarChart } from '@carbon/charts';
import Component from '@ember/component';

/** @documenter yuidoc */

/**
 The CarbonBarChart

 @class CarbonBarChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonBarChart extends Component {
  tagName = '';

  ChartClass = SimpleBarChart;
  args = {
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
