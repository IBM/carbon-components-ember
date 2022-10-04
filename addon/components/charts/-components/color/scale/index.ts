import Component from '@glimmer/component';
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
}

export default ColorScale;
