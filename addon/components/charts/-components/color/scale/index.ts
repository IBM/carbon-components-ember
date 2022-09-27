import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators/index';
import CarbonChart from 'carbon-components-ember/components/charts/-components/chart';

type Args = {
  title: string;
  stacked: boolean;
  primary: boolean;
  secondary: boolean;
  scaleType?: string;
  chart: CarbonChart
}

/** @documenter yuidoc */
/**
 The ColorScale

 ```handlebars
 ```
 @class ColorScale
 @public
 **/
class ColorScale extends Component<Args> {

  @defaultArgs
  args: Args = {
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
    scaleType: undefined
  } as any
}

export default ColorScale;
