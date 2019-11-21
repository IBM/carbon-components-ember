import Component from '@ember/component';
import { action, getProperties } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';


export default class LoadingComponent extends Component {
  carbonElement = null;
  tagName = '';
  attrsDefaults = {
    active: true,
    inline: false
  };

  get loaderAttrs() {
    let attrs = getProperties(this, Object.keys(this.attrs));
    Object.keys(attrs).forEach((k) => {
      if (attrs[k] === undefined) {
        delete attrs[k];
      }
    });
    attrs = Object.assign({}, this.attrsDefaults, attrs);
    return attrs;
  }

  @action
  loadCarbonComponent() {
    const attrs = this.loaderAttrs;
    this.loading = new Loading(this.carbonElement, attrs);
  }

  @action
  destroyCarbonComponent() {
    return this.loading && this.loading.end();
  }
}
