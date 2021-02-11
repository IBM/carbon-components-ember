import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
/** @documenter yuidoc */


type Args = {
  /**
   @argument loading
   @type boolean
   */
  loading: boolean;
  /**
   @argument title
   @type String
   */
  title: string;
}

/**
 The CardComponent

 ```handlebars
 {{import Button from 'carbon-components-ember/components/button'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonButton
 @public
 **/
export default class CardComponent extends Component<Args> {
  args = defaultArgs({
    loading: false,
    title: ''
  });
}
