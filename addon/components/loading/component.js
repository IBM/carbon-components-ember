import Component from '@glimmer/component';
import { action, getProperties } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';
import { defaultArgs } from "../../decorators";


export default class LoadingComponent extends Component {
  carbonElement = null;

  @defaultArgs
  args = {
    active: true,
    inline: false
  };

  @action
  loadCarbonComponent() {
    this.loading = new Loading(this.carbonElement, this.args);
  }

  @action
  destroyCarbonComponent() {
    return this.loading && this.loading.end();
  }
}
