import ChartPart from '../chart-part.ts';
import type CarbonChart from '../../../charts/-components/chart.gts';

/** @documenter yuidoc */
export interface ColorPairingSignature {
  Args: {
    /**
     * define palette with {numberOfVariants} color variants
     * @argument numberOfVariants
     * @type Number
     */
    numberOfVariants?: number;
    /**
     * the option number of the color paring
     * @argument option
     * @type Number
     */
    option: number;
    chart: CarbonChart;
  };
}

/**
 The ColorPairing

 ```handlebars
 ```
 @class ColorPairing
 @public
 **/
export default class ColorPairing extends ChartPart<ColorPairingSignature> {
  get pairing() {
    return {
      option: this.args.option,
      numberOfVariants: this.args.numberOfVariants,
    };
  }

  <template></template>
}
