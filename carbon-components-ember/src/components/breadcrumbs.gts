import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';
import { action } from '@ember/object';
import eq from 'ember-truth-helpers/helpers/eq';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
/** @documenter yuidoc */

type Args = {
  crumbs: string[];
  current?: string;
  onSelect?(crumb: string): void;
};

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
 {{import Breadcrumbs from '/components/breadcrumbs.ts'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonBreadcrumb
 @public
 **/
class CarbonBreadcrumb extends Component<BreadcrumbSignature> {
  args: Args = defaultArgs(this, {
    crumbs: [],
  });

  @action
  onSelect(crumb: string) {
    this.args.onSelect?.(crumb);
  }

  isCurrent = (item: any) => item === this.args.current;

  <template>
    <nav
      class='cds--breadcrumb cds--breadcrumb--no-trailing-slash'
      aria-label='breadcrumb'
      ...attributes
    >
      {{#each @crumbs as |crumb|}}
        <div class='cds--breadcrumb-item {{if (this.isCurrent crumb)'cds--breadcrumb-item--current'}}'>
          <a
            href='#'
            {{on 'click' (fn this.onSelect crumb)}}
            class='cds--link'
            aria-current='{{if (this.isCurrent crumb) "true"}}'
          >
            {{crumb}}
          </a>
        </div>
      {{/each}}
    </nav>
  </template>
}

export default CarbonBreadcrumb;
