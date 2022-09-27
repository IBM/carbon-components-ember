import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators/index';
import CarbonChart from 'carbon-components-ember/components/charts/-components/chart';

type Args = {
  numberOfVariants?: number;
  option: number;
  chart: CarbonChart;
}

/** @documenter yuidoc */
/**
 The ColorPairing

 ```handlebars
 ```
 @class ColorPairing
 @public
 **/
class ColorPairing extends Component<Args> {

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
  } as any
}

export default ColorPairing;
