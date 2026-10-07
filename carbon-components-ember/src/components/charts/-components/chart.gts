import TabularData from '../../charts/-components/tabular-data.gts';
import Axis from '../../charts/-components/axis.gts';
import ColorPairing from '../../charts/-components/color/pairing.gts';
import ColorScale from '../../charts/-components/color/scale.gts';
import { modifier } from 'ember-modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../../../utils/decorators.ts';
import type { AxisChartOptions, Chart } from '@carbon/charts';
import type CarbonChartTabularData from '../../charts/-components/tabular-data.gts';
import type { WithBoundArgs } from '@glint/template';
import type ChartAxis from '../../charts/-components/axis.gts';
import type { AnyChartPart } from './chart-part.ts';

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

  /**
   * The yielded `Axis`, `TabularData`, `ColorScale` and `ColorPairing`
   * components register themselves here. The chart's options and data are
   * derived from their args, so nothing is written while rendering.
   */
  @tracked parts: AnyChartPart[] = [];

  register = (part: AnyChartPart) => {
    this.parts = [...this.parts, part];
  };

  unregister = (part: AnyChartPart) => {
    this.parts = this.parts.filter((p) => p !== part);
  };

  get options(): AxisChartOptions {
    const axes: AxisChartOptions['axes'] = {};
    const scale: Record<string, string> = {};
    let pairing: ColorPairing['pairing'] | undefined;
    for (const part of this.parts) {
      if (part instanceof Axis) axes[part.args.axis] = part.options;
      if (part instanceof ColorScale) scale[part.args.name] = part.args.color;
      if (part instanceof ColorPairing) pairing = part.pairing;
    }
    const hasScale = this.parts.some((part) => part instanceof ColorScale);
    return {
      axes,
      color: {
        ...(hasScale ? { scale } : {}),
        ...(pairing ? { pairing } : {}),
      },
      legend: { clickable: this.args.legendClickable! },
      resizable: this.args.resizable!,
      timeScale: {},
      title: this.args.title,
    };
  }

  get data(): ChartData[] {
    return this.parts.flatMap((part) =>
      part instanceof TabularData ? part.data : [],
    );
  }

  private chart?: Chart;
  private chartContainer?: HTMLDivElement;
  private appliedOptions?: AxisChartOptions;
  private appliedData?: ChartData[];

  // Owns the @carbon/charts instance's lifetime; `syncChart` creates it.
  mountChart = modifier(() => () => {
    this.chart?.destroy();
    this.chart = undefined;
    this.chartContainer?.remove();
    this.chartContainer = undefined;
  });

  // Applies the derived options and data. It's only re-invoked when they
  // change, but compares them anyway, since a modifier can re-run on an
  // unrelated re-render (see AGENTS.md's AudioPlayer notes).
  syncChart = modifier(
    (
      element: HTMLDivElement,
      [options, data]: [AxisChartOptions, ChartData[]],
    ) => {
      const optionsChanged = options !== this.appliedOptions;
      const dataChanged = data !== this.appliedData;
      this.appliedOptions = options;
      this.appliedData = data;

      if (!this.chart) {
        // Wait for the data and both axes before creating the chart.
        if (!data.length || !options.axes?.left || !options.axes?.bottom) {
          return;
        }
        if (!this.args.ChartClass) return;
        this.chartContainer = document.createElement('div');
        this.chartContainer.style.height = element.style.height;
        element.appendChild(this.chartContainer);
        this.chart = new this.args.ChartClass(this.chartContainer, {
          options,
          data: data.slice(),
        });
        this.chart.model.setOptions(options);
        return;
      }

      if (this.chartContainer) {
        this.chartContainer.style.height = element.style.height;
      }
      if (optionsChanged) this.chart.model.setOptions(options);
      if (dataChanged) this.chart.model.setData(data.slice());
    },
  );

  <template>
    <div
      ...attributes
      {{this.mountChart}}
      {{this.syncChart this.options this.data}}
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
