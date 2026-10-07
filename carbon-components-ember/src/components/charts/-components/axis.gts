import onUpdate from '../-helpers/on-update.ts';
import toBool from '../-helpers/to-bool.ts';
import type CarbonChart from '../../charts/-components/chart.gts';
import type { ScaleTypes } from '@carbon/charts';
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
        (hash title=@title stacked=(toBool @stacked) scaleType=@scaleType)
      )
      @axis
      @title
      @stacked
    }}
  {{/if}}
</template>;

export default ChartAxis;
