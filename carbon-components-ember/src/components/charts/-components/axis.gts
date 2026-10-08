import toBool from '../-helpers/to-bool.ts';
import ChartPart from './chart-part.ts';
import type CarbonChart from '../../charts/-components/chart.gts';
import type { ScaleTypes } from '@carbon/charts';

/** @documenter yuidoc */
export interface ChartAxisSignature {
  Args: {
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
    stacked?: boolean | string;
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
    scaleType?: `${ScaleTypes}`;

    chart: CarbonChart;

    axis: 'left' | 'bottom';
  };
}

/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
export default class ChartAxis extends ChartPart<ChartAxisSignature> {
  get options() {
    return {
      title: this.args.title,
      stacked: toBool(this.args.stacked),
      scaleType: this.args.scaleType as ScaleTypes | undefined,
    };
  }

  <template></template>
}
