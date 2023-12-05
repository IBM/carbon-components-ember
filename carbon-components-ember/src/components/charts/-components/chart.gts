import { default as TabularData } from '../../charts/-components/tabular-data.gts';
import { default as Axis } from '../../charts/-components/axis.gts';
import { default as ColorPairing } from '../../charts/-components/color/pairing.gts';
import { default as ColorScale } from '../../charts/-components/color/scale.gts';
import { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
import { default as didUpdate } from '@ember/render-modifiers/modifiers/did-update';
import { default as willDestroy } from '@ember/render-modifiers/modifiers/will-destroy';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { throttleTask } from 'ember-lifeline';
import { defaultArgs } from '../../../utils/decorators.ts';
import { Chart, type ScaleTypes } from '@carbon/charts';
import { type AxisChartOptions, type BaseChartOptions } from '@carbon/charts';
import CarbonChartTabularData from '../../charts/-components/tabular-data.gts';
import { type WithBoundArgs } from '@glint/template';
import ChartAxis from '../../charts/-components/axis.gts';
import { hash } from '@ember/helper';

/** @documenter yuidoc */

export type ChartData = {
  group: string;
  date?: Date | number;
  key?: string;
  value: number;
};

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
      },
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
    color: {} as {
      scale: Record<string, string>;
    },
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
  private childChart?: HTMLDivElement;

  setData() {
    this.options.legend = {};
    this.options.legend.clickable = this.args.legendClickable!;
    this.options.resizable = this.args.resizable!;
    if (!this.data.length) return;
    if (!(this.options as AxisChartOptions)?.axes?.left) return;
    if (!(this.options as AxisChartOptions)?.axes?.bottom) return;
    const data = this.data.slice();

    if (!this.chart && this.args.ChartClass && this.chartDiv) {
      const d = document.createElement('div');
      this.chartDiv.appendChild(d);
      this.childChart = d;
      this.chart = new this.args.ChartClass(d, {
        options: this.options,
        data: data,
      });
      this.chart.model.setOptions(this.options);
    }
    if (this.childChart && this.chart) {
      this.childChart.style.height = this.chartDiv!.style.height;
      this.chart?.model?.setData(data);
    }
  }

  @action
  loadChart(chartDiv: HTMLDivElement) {
    this.chartDiv = chartDiv;
    this.setData();
  }

  update() {
    this.setData();
  }

  @action
  updateChart() {
    throttleTask(this, this.update, 50, false);
  }

  @action
  destroyChart() {
    this.chart && this.chart.destroy();
    this.chart = undefined;
  }

  @action
  setAxis(
    axis: 'left' | 'bottom',
    options?: {
      title: string;
      stacked?: boolean;
      scaleType?: ScaleTypes[keyof ScaleTypes];
    },
  ) {
    (this.options as AxisChartOptions).axes = Object.assign(
      (this.options as AxisChartOptions).axes!,
      {},
      {
        [axis]: options,
      },
    );
    this.updateChart();
  }

  @action
  setColorPairing(values: any) {
    this.options.color!.pairing = values;
  }

  @action
  setColorScale(datasetName: string, color: string) {
    this.options.color!.scale =
      this.options.color!.scale || ({} as Record<string, string>);
    (this.options.color!.scale as any)[datasetName] = color;
  }

  @action
  removeDataset(group: string) {
    this.data
      .slice()
      .reverse()
      .forEach((v, i, array) => {
        if (v.group === group) {
          this.data.splice(array.length - i - 1, 1);
        }
      });
    this.setData();
  }

  @action
  updateDataset(group?: string, fillColors?: string[], data?: ChartData[]) {
    if (!group || !data) return;
    this.data
      .slice()
      .reverse()
      .forEach((v, i, array) => {
        if (v.group === group) {
          this.data.splice(array.length - i - 1, 1);
        }
      });
    data.forEach((v) => {
      this.data.push(v);
    });

    this.updateChart();
  }

  <template>
    <div
      ...attributes
      {{didInsert this.loadChart}}
      {{didUpdate this.updateChart @legendClickable @resizable}}
      {{willDestroy this.destroyChart}}
    >
    </div>

    {{yield
      (hash
        TabularData=(component TabularData chart=this)
        Axis=(component Axis chart=this)
        ColorPairing=(component ColorPairing chart=this)
        ColorScale=(component ColorScale chart=this)
      )
    }}
  </template>
}

export default CarbonChart;
