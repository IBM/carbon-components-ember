import { BarChart, defaultColors } from '@carbon/charts';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
class ChartAxis extends Component {
  tagName = '';
  chart = null;

  args = {
    /**
     * The Axis Title
     * @argument title
     * @type String
     */
    title: '',
    /**
     * @argument stacked
     * @type boolean
     */
    stacked: false,
    /**
     * @argument primary
     * @type boolean
     */
    primary: false,
    /**
     * @argument secondary
     * @type boolean
     */
    secondary: false,
    /**
     * @argument scaleType
     * @type String
     */
    scaleType: null
  }
}

export default ChartAxis;
