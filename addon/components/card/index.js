import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
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
    constructor() {
        super(...arguments);
        this.args = defaultArgs(this, {
            loading: false,
            title: ''
        });
    }
}
