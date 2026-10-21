import ChartPart from '../chart-part.ts';
import type CarbonChart from '../../../../components/charts/-components/chart.gts';

export interface ColorScaleSignature {
  Args: {
    name: string;
    color: string;
    chart: CarbonChart | null;
  };
}

export default class ColorScale extends ChartPart<ColorScaleSignature> {
  // eslint-disable-next-line ember/template-require-splattributes -- configures its chart; renders nothing
  <template></template>
}
