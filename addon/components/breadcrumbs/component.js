import Component from '@ember/component';

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
  tagName = '';
  args = {
    /**
     @argument crumbs
     @type String[]
     */
    crumbs: []
  };

  get lastItem() {
    return this.attrs.crumbs && this.attrs.crumbs[this.attrs.crumbs.length - 1];
  }
}

export default CarbonBreadcrumb;
