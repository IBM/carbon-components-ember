import Component from '@glimmer/component';
import { action } from '@ember/object';
import { defaultArgs } from 'carbon-components-ember/decorators';
import CarbonChart from 'carbon-components-ember/components/charts/-components/chart/index';

type Args = {
  backgroundColors?: string[];
  label: string;
  data: number[];
  chart: CarbonChart
}

/** @documenter yuidoc */
/**
 The CarbonChartDataSet

 ```handlebars
 ```
 @class CarbonChartDataSet
 @public
 **/
class CarbonChartDataSet extends Component<Args> {
  @defaultArgs
  args: Args = {
    /**
     * The Dataset label
     * @argument label
     * @type String
     */
    label: '',
    /**
     * @argument data
     * @type number[]
     */
    data: [],
    chart: null,
    backgroundColors: null,
  } as any;
  private oldLabel: string;
  defaultColor: string[];

  @action
  didUpdateArgs() {
    if (this.oldLabel && this.oldLabel !== this.args.label) {
      this.args.chart?.removeDataset(this.oldLabel);
      this.oldLabel = this.args.label;
    }
    this.args.chart?.updateDataset(this.args.label, this.args.backgroundColors || this.defaultColor, this.args.data);
  }

  willDestroy() {
    super.willDestroy();
    this.args.chart && this.args.chart.removeDataset(this.oldLabel);
  }
}

export default CarbonChartDataSet;
