import Chart from '@carbon/charts/chart';
import Component from '@ember/component';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';
import { componentArgs, argsCompat } from '../../../../decorators';
/** @documenter yuidoc */

/**
 The CarbonChart

 Base Chart Class

 @class CarbonChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonChart extends Component {
  tagName = '';
  data = {
    labels: [],
    datasets: []
  };
  options = {
    axes: {},
    legendClickable: true,
    containerResizable: true,
    timeScale: {
      addSpaceOnEdges: false
    }
  };
  chartDiv = null;

  @componentArgs
  componentArgs = {
    labels: [],
    resizable: true,
    legendClickable: true
  };

  @argsCompat
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
    legendClickable: true,

    /**
     * Chart class
     @argument ChartClass
     @type Chart
     */
    ChartClass: null
  };


  async setData() {
    const labels = this.componentArgs.labels;
    this.data.labels = Array.isArray(labels) ? labels : labels.split(',');
    this.options.legendClickable = this.componentArgs.legendClickable;
    this.options.containerResizable = this.componentArgs.resizable;
    if (!this.data.datasets.length) return;
    if (!this.options.axes.left) return;
    if (!this.options.axes.bottom) return;
    const data = Object.assign({}, this.data);
    data.labels = data.labels.slice();
    data.datasets = data.datasets.slice();

    if (!this.chart && this.args.ChartClass) {
      const d = document.createElement('div');
      this.chartDiv.appendChild(d);
      this.childChart = d;
      this.chart = new this.args.ChartClass(d, {
        options: this.options,
        data: data
      });
      this.chart.model.setOptions(this.options);
    }
    this.childChart.style.height = this.chartDiv.style.height;
    this.chart.model.setData(data);
  }

  @action
  loadChart() {
    this.setData();
  }

  update() {
    this.setData();
  }

  @action
  updateChart() {
    throttle(this, this.update, 50, false);
  }

  @action
  destroyChart() {
    this.chart && this.chart.destroy();
    this.chart = null;
  }

  @action
  setAxis(axis, options) {
    this.options.axes = Object.assign(this.options.axes, {}, {
      [axis]: options
    });
    this.updateChart();
  }

  @action
  removeDataset(label) {
    const dataset = this.data.datasets.find(d => d.label === label);
    this.data.datasets.removeObject(dataset);
    this.destroyChart();
    this.updateChart();
  }

  @action
  updateDataset(label, backgroundColors, data) {
    if (!label || !data) return;
    let dataset = this.data.datasets.find(d => d.label === label);
    if (!dataset) {
      dataset = { };
      this.data.datasets.push(dataset);
    }
    Object.assign(dataset, { label, backgroundColors, data });
    this.updateChart();
  }
}

export default CarbonChart;
