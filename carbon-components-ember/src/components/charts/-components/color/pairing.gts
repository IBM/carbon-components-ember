import onUpdate from '../../../charts/-helpers/on-update.ts';
import Component from '@glimmer/component';
import type CarbonChart from '../../../charts/-components/chart.gts';

export type Args = {
  /**
   * define palette with {numberOfVariants} color variants
   * @argument numberOfVariants
   * @type Number
   */
  numberOfVariants?: number;
  /**
   * the option number of the color paring
   * @argument option
   * @type Number
   */
  option: number;
  chart: CarbonChart;
};

/** @documenter yuidoc */
/**
 The ColorPairing

 ```handlebars
 ```
 @class ColorPairing
 @public
 **/
export default class ColorPairing extends Component<Args> {
  <template>
    {{#if @chart.setColorPairing}}
      {{onUpdate
        (fn
          @chart.setColorPairing
          (hash option=@option numberOfVariants=@numberOfVariants)
        )
        @numberOfVariants
        @option
      }}
    {{/if}}
  </template>
}
