import Component from '@glimmer/component';
import { defaultArgs } from "../../decorators";

/** @documenter yuidoc */

/**
 The Carbon Breadcrumb

 ```handlebars
 {{import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonBreadcrumb
 @public
 **/
class CarbonBreadcrumb extends Component {

  @defaultArgs
  args = {
    /**
     @argument crumbs
     @type String[]
     */
    crumbs: []
  };

  get lastItem() {
    return this.args.crumbs && this.args.crumbs[this.args.crumbs.length - 1];
  }
}

export default CarbonBreadcrumb;
