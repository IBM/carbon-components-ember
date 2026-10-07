import TabularData from '../../charts/-components/tabular-data.gts';
import Axis from '../../charts/-components/axis.gts';
import ColorPairing from '../../charts/-components/color/pairing.gts';
import ColorScale from '../../charts/-components/color/scale.gts';
import { modifier } from 'ember-modifier';
import Component from '@glimmer/component';
import { defaultArgs } from '../../../utils/decorators.ts';
import type { Chart, ScaleTypes } from '@carbon/charts';
import type { AxisChartOptions, BaseChartOptions } from '@carbon/charts';
import type CarbonChartTabularData from '../../charts/-components/tabular-data.gts';
import type { WithBoundArgs } from '@glint/template';
import type ChartAxis from '../../charts/-components/axis.gts';
import { throttle } from '@ember/runloop';

/** @documenter yuidoc */

export type ChartData = {
  group: string;
  date?: Date | number;
  key?: string;
  value: number;
};

export type Args = {
  /**
   * The chart's title, rendered by @carbon/charts as the chart's heading
   * (its `title` option).
   */
  title?: string;
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
export default class CarbonChart extends Component<CarbonChartSignature> {
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
  private childChart?: HTMLDivElement;

  setData() {
    this.options.legend = {};
    this.options.legend.clickable = this.args.legendClickable!;
    this.options.resizable = this.args.resizable!;
    this.options.title = this.args.title;
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

  loadChart = (chartDiv: HTMLDivElement) => {
    this.chartDiv = chartDiv;
    this.setData();
  };

  update = () => {
    this.setData();
  };

  updateChart = () => {
    // eslint-disable-next-line ember/no-runloop
    throttle(this, this.update, 50, false);
  };

  destroyChart = () => {
    this.chart?.destroy();
    this.chart = undefined;
  };

  loadChartModifier = modifier((element: HTMLDivElement) => {
    this.loadChart(element);
    return () => this.destroyChart();
  });

  hasUpdatedOnce = false;

  updateChartModifier = modifier(
    (
      _element: HTMLDivElement,
      [legendClickable, resizable]: [boolean | undefined, boolean | undefined],
    ) => {
      void legendClickable;
      void resizable;
      if (!this.hasUpdatedOnce) {
        this.hasUpdatedOnce = true;
        return;
      }
      this.updateChart();
    },
  );

  setAxis = (
    axis: 'left' | 'bottom',
    options?: {
      title: string;
      stacked?: boolean;
      scaleType?: ScaleTypes[keyof ScaleTypes];
    },
  ) => {
    (this.options as AxisChartOptions).axes = Object.assign(
      (this.options as AxisChartOptions).axes!,
      {},
      {
        [axis]: options,
      },
    );
    this.updateChart();
  };

  setColorPairing = (values: any) => {
    this.options.color!.pairing = values;
  };

  setColorScale = (datasetName: string, color: string) => {
    this.options.color!.scale = this.options.color!.scale || {};
    (this.options.color!.scale as any)[datasetName] = color;
  };

  removeDataset = (group: string) => {
    this.data
      .slice()
      .reverse()
      .forEach((v, i, array) => {
        if (v.group === group) {
          this.data.splice(array.length - i - 1, 1);
        }
      });
    this.setData();
  };

  updateDataset = (
    group?: string,
    fillColors?: string[],
    data?: ChartData[],
  ) => {
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
  };

  <template>
    <div
      ...attributes
      {{this.loadChartModifier}}
      {{this.updateChartModifier @legendClickable @resizable}}
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
