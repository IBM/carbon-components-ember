import { BarChart, defaultColors } from '@carbon/charts';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

class ChartScale extends Component {
  tagName = '';
  chart = null;
}

export default ChartScale;
