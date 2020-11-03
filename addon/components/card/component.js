import Component from '@glimmer/component';
import { defaultArgs } from "../../decorators";
/** @documenter yuidoc */

/**
 The CardComponent

 ```handlebars
 {{import Button from 'carbon-components-ember/components/button'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonButton
 @public
 **/
export default class CardComponent extends Component {
  tagName = '';

  @defaultArgs
  args = {
    /**
     @argument loading
     @type boolean
     */
    loading: false,

    /**
     @argument title
     @type String
     */
    title: ''
  };
}
