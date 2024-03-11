import { default as onUpdate } from '../../-helpers/on-update';
import { default as toBool } from '../../-helpers/to-bool';
import { default as newObj } from 'carbon-components-ember/helpers/new-obj';
import Component from '@glimmer/component';
import CarbonChart from '../../../charts/-components/chart';
import { ScaleTypes } from '@carbon/charts';

type Args = {
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
  stacked?: boolean;
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
class ChartAxis extends Component<Args> {
  <template>
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
  </template>
}

export default ChartAxis;
