import { defaultColors } from '@carbon/charts';
import Component from '@ember/component';

class CarbonChartDataSet extends Component {
  tagName = '';
  chart = null;
  defaultColor = [defaultColors[0]];
}

export default CarbonChartDataSet;
