import Component from '@glimmer/component';
import CarbonChart from '../../../charts/-components/chart';
import { ScaleTypes } from '@carbon/charts/interfaces/enums';
import { AxisOptions } from '@carbon/charts/interfaces/axis-scales';

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
  scaleType: ScaleTypes;

  chart: CarbonChart

  axis: AxisOptions
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
