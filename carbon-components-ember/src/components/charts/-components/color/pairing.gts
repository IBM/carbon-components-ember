import { default as onUpdate } from '../../../charts/-helpers/on-update.ts';
import Component from '@glimmer/component';
import { defaultArgs } from '../../../../utils/decorators.ts';
import CarbonChart from '../../../charts/-components/chart.gts';
import { fn, hash } from '@ember/helper';

type Args = {
  numberOfVariants?: number;
  option: number;
  chart: CarbonChart | null;
};

/** @documenter yuidoc */
/**
 The ColorPairing

 ```handlebars
 ```
 @class ColorPairing
 @public
 **/
class ColorPairing extends Component<Args> {
  @defaultArgs
  args: Args = {
    /**
     * define palette with {numberOfVariants} color variants
     * @argument numberOfVariants
     * @type Number
     */
    numberOfVariants: undefined,
    /**
     * the option number of the color paring
     * @argument option
     * @type Number
     */
    option: 1,
    chart: null,
  };

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

export default ColorPairing;
