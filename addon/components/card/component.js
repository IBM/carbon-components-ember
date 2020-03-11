import Component from '@ember/component';
import {argsCompat} from "../../decorators/bx-class-names";
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

  @argsCompat
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
