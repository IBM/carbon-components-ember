import Component from '@glimmer/component';
import {defaultArgs} from 'carbon-components-ember/decorators/index';

type Args = {
  title: string;
  stacked: boolean;
  primary: boolean;
  secondary: boolean;
  scaleType?: string;
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
  }
}

export default ChartAxis;
