import Component from '@glimmer/component';
import { Chart } from '@carbon/charts/chart';

type Args = {
  /**
   * The Axis Title
   * @argument title
   * @type String
   */
  title: string,
  /**
   * @argument stacked
   * @type boolean
   */
  stacked: boolean,
  /**
   * @argument primary
   * @type boolean
   */
  primary: boolean,
  /**
   * @argument secondary
   * @type boolean
   */
  secondary: boolean,
  /**
   * @argument scaleType
   * @type String
   */
  scaleType: string;

  chart: typeof Chart
}

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
class ChartAxis extends Component<Args> {
}

export default ChartAxis;
