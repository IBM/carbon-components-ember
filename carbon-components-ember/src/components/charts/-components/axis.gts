import { default as onUpdate } from '../-helpers/on-update.ts';
import { default as toBool } from '../-helpers/to-bool.ts';
import { default as newObj } from '../../../helpers/new-obj.ts';
import CarbonChart from '../../charts/-components/chart.gts';
import { ScaleTypes } from '@carbon/charts';
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

export type Args = {
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
  scaleType?: ScaleTypes[keyof ScaleTypes];

  chart: CarbonChart;

  axis: 'left' | 'bottom';
};

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
const ChartAxis: TOC<Args> = <template>
  {{#if @chart.setAxis}}
    {{onUpdate
      (fn
        @chart.setAxis
        @axis
        (newObj title=@title stacked=(toBool @stacked) scaleType=@scaleType)
      )
      @axis
      @title
      @stacked
    }}
  {{/if}}
</template>;

export default ChartAxis;
