import ChartPart from '../chart-part.ts';
import { defaultArgs } from '../../../../utils/decorators.ts';
import type CarbonChart from '../../../../components/charts/-components/chart.gts';

export interface ColorScaleSignature {
  Args: {
    name: string;
    color: string;
    chart: CarbonChart | null;
  };
}

export default class ColorScale extends ChartPart<ColorScaleSignature> {
  @defaultArgs
  args: ColorScaleSignature['Args'] = {
    /**
     * The Axis Title
     */
    name: '',

    color: '',

    chart: null,
  };

  // eslint-disable-next-line ember/template-require-splattributes -- configures its chart; renders nothing
  <template></template>
}
