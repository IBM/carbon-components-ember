import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
import { action } from '@ember/object';
import eq from 'ember-truth-helpers/helpers/eq';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

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

  <template>
    <nav
      class='cds--breadcrumb cds--breadcrumb--no-trailing-slash'
      aria-label='breadcrumb'
      ...attributes
    >
      {{#each @crumbs as |crumb|}}
        <div class='cds--breadcrumb-item'>
          <a
            href='#'
            {{on 'click' (fn this.onSelect crumb)}}
            class='cds--link'
            aria-current='{{if (eq crumb @current) "page"}}'
          >
            {{crumb}}
          </a>
        </div>
      {{/each}}
    </nav>
  </template>
}

export default CarbonBreadcrumb;
