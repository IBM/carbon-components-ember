import Component from '@ember/component';
import { action } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';


export default class LoadingComponent extends Component {
  carbonElement = null;
  tagName = '';

  updateLoading() {
    if (this.attrs.active !== undefined) {
      if (this.loading) this.loading.set(this.active);
    }
  }

  @action
  loadCarbonComponent() {
    this.loading = new Loading(this.carbonElement, this.attrs);
  }

  @action
  destroyCarbonComponent() {
    return this.loading && this.loading.end();
  }
}
