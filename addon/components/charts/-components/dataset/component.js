import { defaultColors } from '@carbon/charts';
import Component from '@ember/component';
import { action } from '@ember/object';
import { argsCompat } from "carbon-components-ember/decorators";

/** @documenter yuidoc */
/**
 The CarbonChartDataSet

 ```handlebars
 ```
 @class CarbonChartDataSet
 @public
 **/
class CarbonChartDataSet extends Component {
  tagName = '';
  chart = null;
  defaultColor = [defaultColors[0]];

  @argsCompat
  args = {
    /**
     * The Dataset label
     * @argument label
     * @type String
     */
      label: '',
    /**
     * @argument backgroundColors
     * @type defaultColors[]
     */
      backgroundColors: [],
    /**
     * @argument data
     * @type number[]
     */
      data: []
  };

  @action
  didUpdateArgs() {
    if (this.oldDabel && this.oldDabel !== this.args.label) {
      this.chart.removeDataset(this.oldLabel);
      this.oldLabel = this.args.label;
    }
    this.chart.updateDataset(this.args.label, this.args.backgroundColors || this.defaultColor, this.args.data);
  }

  willDestroy() {
    super.willDestroy();
    this.chart && this.chart.removeDataset(this.oldLabel);
  }
}

export default CarbonChartDataSet;
