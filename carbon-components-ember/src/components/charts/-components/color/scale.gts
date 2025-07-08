import { default as onUpdate } from '../../../../components/charts/-helpers/on-update.ts';
import Component from '@glimmer/component';
import { defaultArgs } from '../../../../utils/decorators.ts';
import CarbonChart from '../../../../components/charts/-components/chart.gts';
import { fn } from '@ember/helper';

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
export default class ColorScale extends Component<Args> {
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

  <template>
    {{#if @chart.setColorScale}}
      {{onUpdate (fn @chart.setColorScale @name @color) @name @color}}
    {{/if}}
  </template>
}
