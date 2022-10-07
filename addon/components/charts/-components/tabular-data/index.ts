import Component from '@glimmer/component';
import { action } from '@ember/object';
import { defaultArgs } from 'carbon-components-ember/decorators';
import CarbonChart, { ChartData } from 'carbon-components-ember/components/charts/-components/chart/index';

type Args = {
  backgroundColors?: string[];
  group: string;
  chart?: CarbonChart;
} & OneOf<[{
  values: number[];
  dates?: Date[];
  keys?: string[];
}, {
  data: ChartData[];
}]>

/** @documenter yuidoc */
/**
 The CarbonChartDataSet

 ```handlebars
 ```
 @class CarbonChartDataSet
 @public
 **/
class CarbonChartTabularData extends Component<Args> {
  @defaultArgs
  args: Args = {
    /**
     * The Dataset label
     * @argument label
     * @type String
     */
    group: '',
    /**
     * @argument data
     * @type number[]
     */
    values: [],
    keys: [],
    dates: [],
    chart: null as any,
    data: [],
    backgroundColors: undefined,
  } as any;
  private oldGroup: string;
  defaultColor: string[];

  @action
  didUpdateArgs() {
    if (this.oldGroup && this.oldGroup !== this.args.group) {
      this.args.chart?.removeDataset(this.oldGroup);
      this.oldGroup = this.args.group;
    }
    let data: ChartData[] = [];
    if (this.args.data?.length) {
      data = this.args.data.slice().map(x => Object.assign(x, { group: this.args.group }));
    } else if (this.args.values) {
      this.args.values.forEach((v, i) => {
        data.push({
          date: this.args.dates?.[i] || undefined,
          key: this.args.keys?.[i] || undefined,
          value: this.args.values!![i],
          group: this.args.group
        })
      })
    }
    this.args.chart?.updateDataset(
      this.args.group,
      this.args.backgroundColors || this.defaultColor,
      data
    );
  }

  willDestroy() {
    super.willDestroy();
    this.args.chart && this.args.chart.removeDataset(this.oldGroup);
  }
}

export default CarbonChartTabularData;
