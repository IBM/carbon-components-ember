import toBool from '../-helpers/to-bool.ts';
import ChartPart from './chart-part.ts';
import type CarbonChart from '../../charts/-components/chart.gts';
import type { ScaleTypes } from '@carbon/charts';

export interface ChartAxisSignature {
  Args: {
    /**
     * The Axis Title
     */
    title: string;

    stacked?: boolean | string;

    primary?: boolean;

    secondary?: boolean;

    scaleType?: `${ScaleTypes}`;

    chart: CarbonChart;

    axis: 'left' | 'bottom';
  };
}

export default class ChartAxis extends ChartPart<ChartAxisSignature> {
  get options() {
    return {
      title: this.args.title,
      stacked: toBool(this.args.stacked),
      scaleType: this.args.scaleType as ScaleTypes | undefined,
    };
  }

  // eslint-disable-next-line ember/template-require-splattributes -- configures its chart; renders nothing
  <template></template>
}
