import Component from '@glimmer/component';
/** @documenter yuidoc */
declare type Args = {
    /**
     @argument crumbs
     @type String[]
     */
    crumbs: string[];
};
export interface BreadcrumbSignature {
    Element: HTMLElement;
    Args: Args;
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
declare class CarbonBreadcrumb extends Component<BreadcrumbSignature> {
    args: Args;
    get lastItem(): string;
}
export default CarbonBreadcrumb;
