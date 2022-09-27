import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators/index';

type Args = {
  numberOfVariants?: number;
  option: number;
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
     * define palette with {numberOfVariants} color variants
     * @argument numberOfVariants
     * @type Number
     */
    numberOfVariants: undefined,
    /**
     * the option number of the color paring
     * @argument option
     * @type Number
     */
    option: 1,
  }
}

export default ChartAxis;
