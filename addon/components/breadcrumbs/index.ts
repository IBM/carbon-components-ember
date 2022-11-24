import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
import { action } from '@ember/object';

/** @documenter yuidoc */

type Args = {
  /**
   @argument crumbs
   @type String[]
   */
  crumbs: string[];

  current?: string;

  onSelect?(crumb: string): void;
}


export interface BreadcrumbSignature {
  // We have a `<table>` as our root element
  Element: HTMLElement;
  // We accept an array of items, one per row
  Args: Args;
  // We accept two named blocks: a parameter-less `header` block
  // and a `row` block which will be invoked with each item and
  // its index sequentially.
  Blocks: {
    default: [];
  };
}

/**
 The Carbon Breadcrumb

 ```handlebars
 {{import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonBreadcrumb
 @public
 **/
class CarbonBreadcrumb extends Component<BreadcrumbSignature> {

  args: Args = defaultArgs(this, {
    crumbs: []
  });

  @action
  onSelect(crumb: string) {
    this.args.onSelect?.(crumb);
  }
}

export default CarbonBreadcrumb;
