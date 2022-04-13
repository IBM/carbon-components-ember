import Component from '@glimmer/component';
import { action } from '@ember/object';
import { defaultArgs } from 'carbon-components-ember/decorators';

/** @documenter yuidoc */
/**
 The CarbonChartDataSet

 ```handlebars
 ```
 @class CarbonChartDataSet
 @public
 **/
class CarbonChartDataSet extends Component {
  chart = null;

  @defaultArgs
  args = {
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

    /**
     * @internal
     */
    chart: null
  };

  @action
  didUpdateArgs() {
    if (this.oldDabel && this.oldDabel !== this.args.label) {
      this.args.chart.removeDataset(this.oldLabel);
      this.oldLabel = this.args.label;
    }
    this.args.chart.updateDataset(this.args.label, this.args.backgroundColors || this.defaultColor, this.args.data);
  }

  willDestroy() {
    super.willDestroy();
    this.args.chart && this.args.chart.removeDataset(this.oldLabel);
  }
}

export default CarbonChartDataSet;
