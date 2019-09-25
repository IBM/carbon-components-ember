import Component from '@ember/component';

class CarbonBreadcrumb extends Component {
  tagName = '';

  get lastItem() {
    return this.attrs.crumbs && this.attrs.crumbs[this.attrs.crumbs.length - 1];
  }
}

export default CarbonBreadcrumb;
