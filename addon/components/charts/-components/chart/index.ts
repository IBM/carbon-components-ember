import Component from '@glimmer/component';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';
import { defaultArgs } from '../../../../decorators';
import { Chart } from '@carbon/charts';
import { AxisChartOptions, BaseChartOptions } from '@carbon/charts';
import CarbonChartTabularData from 'carbon-components-ember/components/charts/-components/tabular-data';
import { WithBoundArgs } from '@glint/template';
import ColorPairing from 'carbon-components-ember/components/charts/-components/color/pairing';
import ColorScale from 'carbon-components-ember/components/charts/-components/color/scale';
import ChartAxis from 'carbon-components-ember/components/charts/-components/axis';


/** @documenter yuidoc */

export type ChartData = {
  group: string;
  date?: Date|number;
  key?: string;
  value: number;
}

type Args = {
  resizable?: boolean;
  legendClickable?: boolean;
  ChartClass?: typeof Chart;
};

export interface CarbonChartSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        TabularData: WithBoundArgs<typeof CarbonChartTabularData, 'chart'>;
        Axis: WithBoundArgs<typeof ChartAxis, 'chart'>;
        ColorPairing: WithBoundArgs<typeof ColorPairing, 'chart'>;
        ColorScale: WithBoundArgs<typeof ColorScale, 'chart'>;
      }
    ];
  };
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
  data: ChartData[] = [];
  options: BaseChartOptions | AxisChartOptions = {
    axes: {},
    color: {},
    legend: {
      clickable: true,
    },
    resizable: true,
    timeScale: {},
  };
  chartDiv?: HTMLDivElement = undefined;

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

    /**
     * Chart class
     @argument ChartClass
     @type Chart
     */
    ChartClass: undefined,
  };

  private chart?: Chart;
  private childChart: HTMLDivElement;

  setData() {
    this.options.legend = {};
    this.options.legend.clickable = this.args.legendClickable!!;
    this.options.resizable = this.args.resizable!!;
    if (!this.data.length) return;
    if (!(this.options as AxisChartOptions)?.axes?.left) return;
    if (!(this.options as AxisChartOptions)?.axes?.bottom) return;
    const data = this.data.slice();

    if (!this.chart && this.args.ChartClass && this.chartDiv) {
      const d = document.createElement('div');
      this.chartDiv.appendChild(d);
      this.childChart = d;
      this.chart = new this.args.ChartClass(d, {
        options: this.options as any,
        data: data,
      });
      this.chart.model.setOptions(this.options);
    }
    if (this.childChart && this.chart) {
      this.childChart.style.height = this.chartDiv!!.style.height;
      this.chart?.model?.setData(data);
    }
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
  setAxis(
    axis: 'left' | 'bottom',
    options: { title: string; stacked: boolean; scaleType: string }
  ) {
    (this.options as AxisChartOptions).axes = Object.assign(
      (this.options as AxisChartOptions).axes!!,
      {},
      {
        [axis]: options,
      }
    );
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
  removeDataset(group: string) {
    this.data.slice().reverse().forEach((v, i, array) => {
        if (v.group === group) {
          this.data.removeAt(array.length - i - 1);
        }
      });
    this.setData();
  }

  @action
  updateDataset(group: string, fillColors: string[], data: ChartData[]) {
    if (!group || !data) return;
    this.data.slice().reverse().forEach((v, i, array) => {
        if (v.group === group) {
          this.data.removeAt(array.length - i - 1);
        }
      });
    data.forEach((v, i) => {
      this.data.push(v);
    });

    this.updateChart();
  }
}

export default CarbonChart;
