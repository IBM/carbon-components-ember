import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';
/** @documenter yuidoc */

export type Args = {
  crumbs: string[];
  current?: string;
  onSelect?(crumb: string): void;
};

export interface BreadcrumbSignature {
  Element: HTMLElement;
  Args: Args;
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
export default class CarbonBreadcrumb extends Component<BreadcrumbSignature> {
  args: Args = defaultArgs(this, {
    crumbs: [],
  });

  onSelect = (crumb: string, event: MouseEvent) => {
    // The crumbs are `href="#"` links driven by `@onSelect`; don't follow
    // them (it would jump the page and add a history entry).
    event.preventDefault();
    this.args.onSelect?.(crumb);
  };

  isCurrent = (item: string) => item === this.args.current;

  <template>
    <nav
      class="cds--breadcrumb cds--breadcrumb--no-trailing-slash"
      aria-label="breadcrumb"
      ...attributes
    >
      {{#each @crumbs as |crumb|}}
        <div
          class="cds--breadcrumb-item
            {{if (this.isCurrent crumb) 'cds--breadcrumb-item--current'}}"
        >
          <a
            href="#"
            {{on "click" (fn this.onSelect crumb)}}
            class="cds--link"
            aria-current="{{if (this.isCurrent crumb) 'true'}}"
          >
            {{crumb}}
          </a>
        </div>
      {{/each}}
    </nav>
  </template>
}
