import ChartPart from '../chart-part.ts';
import { defaultArgs } from '../../../../utils/decorators.ts';
import type CarbonChart from '../../../../components/charts/-components/chart.gts';

/** @documenter yuidoc */
export interface ColorScaleSignature {
  Args: {
    name: string;
    color: string;
    chart: CarbonChart | null;
  };
}

/**
 The ColorScale

 ```handlebars
 ```
 @class ColorScale
 @public
 **/
export default class ColorScale extends ChartPart<ColorScaleSignature> {
  @defaultArgs
  args: ColorScaleSignature['Args'] = {
    /**
     * The Axis Title
     * @argument title
     * @type String
     */
    name: '',
    /**
     * @argument color
     * @type String
     */
    color: '',

    chart: null,
  };

  <template></template>
}
