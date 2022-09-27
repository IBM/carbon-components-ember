import Component from '@glimmer/component';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';
import { defaultArgs } from '../../../../decorators';
import { Chart } from '@carbon/charts/chart';
import { AxisChartOptions, BaseChartOptions } from '@carbon/charts/interfaces/charts';
import { ChartData } from '@carbon/charts/interfaces/model';
import { AxisOptions } from '@carbon/charts/interfaces/axis-scales';

/** @documenter yuidoc */



type Args = {
  labels: string[];
  resizable?: boolean;
  legendClickable?: boolean;
  ChartClass?: typeof Chart;
};

export interface CarbonChartSignature {
  Args: Args;
}

/**
 The CarbonChart

 Base Chart Class

 @class CarbonChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonChart extends Component<CarbonChartSignature> {
  data: ChartData = {
    labels: [],
    datasets: []
  };
  options: BaseChartOptions|AxisChartOptions = {
    axes: {},
    color: {},
    legend: {
      clickable: true
    },
    resizable: true,
    timeScale: {
    }
  };
  chartDiv?: HTMLDivElement = undefined;

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
      legendClickable: true,

      /**
     * Chart class
     @argument ChartClass
     @type Chart
     */
      ChartClass: undefined
    };

  private chart?: Chart;
  private childChart: HTMLDivElement;


  async setData() {
    const labels = this.args.labels;
    this.data.labels = labels;
    this.options.legend = {};
    this.options.legend.clickable = this.args.legendClickable!!;
    this.options.resizable = this.args.resizable!!;
    if (!this.data.datasets.length) return;
    if ((!this.options as AxisChartOptions).axes!!.left) return;
    if ((!this.options as AxisChartOptions).axes!!.bottom) return;
    const data = Object.assign({}, this.data);
    data.labels = data.labels.slice();
    data.datasets = data.datasets.slice();

    if (!this.chart && this.args.ChartClass) {
      const d = document.createElement('div');
      this.chartDiv!!.appendChild(d);
      this.childChart = d;
      this.chart = new this.args.ChartClass(d, {
        options: this.options as any,
        data: data as any
      });
      this.chart.model.setOptions(this.options);
    }
    this.childChart.style.height = this.chartDiv!!.style.height;
    this.chart!!.model.setData(data);
  }

  @action
  loadChart(chartDiv) {
    this.chartDiv = chartDiv;
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
    this.chart = undefined;
  }

  @action
  setAxis(axis: 'left'|'bottom', options: AxisOptions) {
    (this.options as AxisChartOptions).axes = Object.assign((this.options as AxisChartOptions).axes!!, {}, {
      [axis]: options
    });
    this.updateChart();
  }

  @action
  setColorPairing(values) {
    this.options.color!!.pairing = values;
  }

  @action
  setColorScale(datasetName, color) {
    this.options.color!!.scale = this.options.color!!.scale || {};
    this.options.color!!.scale[datasetName] = color;
  }

  @action
  removeDataset(label) {
    const dataset = this.data.datasets.find(d => d.label === label)!!;
    this.data.datasets.removeObject(dataset);
    this.destroyChart();
    this.updateChart();
  }

  @action
  updateDataset(label: string, fillColors: string[], data) {
    if (!label || !data) return;
    let dataset = this.data.datasets.find(d => d.label === label);
    if (!dataset) {
      dataset = { label, data, fillColors };
      this.data.datasets.push(dataset);
    }
    Object.assign(dataset, { label, fillColors, data });
    this.updateChart();
  }
}

export default CarbonChart;
