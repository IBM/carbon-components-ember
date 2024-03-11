import { default as onUpdate } from '../../../-helpers/on-update';
import { fn } from '@ember/helper';import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators';
import CarbonChart from 'carbon-components-ember/components/charts/-components/chart';

type Args = {
  name: string;
  color: string;
  chart: CarbonChart;
}

/** @documenter yuidoc */
/**
 The ColorScale

 ```handlebars
 ```
 @class ColorScale
 @public
 **/
class ColorScale extends Component<Args> {
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

   chart: null as any
 }

  <template>
    
    
    
    {{#if @chart.setColorScale}}
      {{onUpdate (fn @chart.setColorScale @name @color) @name @color}}
    {{/if}}
  </template>
}

export default ColorScale;
