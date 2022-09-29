import Component from '@glimmer/component';
import CarbonChart from '../../../charts/-components/chart';
import { ScaleTypes } from '@carbon/charts/interfaces/enums';

type Args = {
  /**
   * The Axis Title
   * @argument title
   * @type String
   */
  title: string;
  /**
   * @argument stacked
   * @type boolean
   */
  stacked?: boolean;
  /**
   * @argument primary
   * @type boolean
   */
  primary?: boolean;
  /**
   * @argument secondary
   * @type boolean
   */
  secondary?: boolean;
  /**
   * @argument scaleType
   * @type String
   */
  scaleType?: ScaleTypes[keyof ScaleTypes];

  chart: CarbonChart;

  axis: 'left' | 'bottom';
};

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
class ChartAxis extends Component<Args> {}

export default ChartAxis;
