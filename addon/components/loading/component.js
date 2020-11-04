import Component from '@glimmer/component';
import { action } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';
import { defaultArgs } from '../../decorators';


export default class LoadingComponent extends Component {
  @defaultArgs
  args = {
    active: true,
    small: false,
    overlay: false,
    title: null,
    inline: false
  };

  @action
  loadCarbonComponent(elem) {
    this.loading = new Loading(elem, this.args);
  }

  @action
  destroyCarbonComponent() {
    return this.loading && this.loading.end();
  }
}
