import ChartPart from '../chart-part.ts';
import type CarbonChart from '../../../charts/-components/chart.gts';

export interface ColorPairingSignature {
  Args: {
    /**
     * define palette with {numberOfVariants} color variants
     */
    numberOfVariants?: number;
    /**
     * the option number of the color paring
     */
    option: number;
    chart: CarbonChart;
  };
}

export default class ColorPairing extends ChartPart<ColorPairingSignature> {
  get pairing() {
    return {
      option: this.args.option,
      numberOfVariants: this.args.numberOfVariants,
    };
  }

  // eslint-disable-next-line ember/template-require-splattributes -- configures its chart; renders nothing
  <template></template>
}
