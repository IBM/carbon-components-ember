import ChartPart from '../chart-part.ts';
import { defaultArgs } from '../../../../utils/decorators.ts';
import type CarbonChart from '../../../../components/charts/-components/chart.gts';

export type Args = {
  name: string;
  color: string;
  chart: CarbonChart | null;
};

/** @documenter yuidoc */
/**
 The ColorScale

 ```handlebars
 ```
 @class ColorScale
 @public
 **/
export default class ColorScale extends ChartPart<{ Args: Args }> {
  @defaultArgs
  args: Args = {
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
