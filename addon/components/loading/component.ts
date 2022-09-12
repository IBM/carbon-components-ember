import Component from '@glimmer/component';
import { action } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';
import { defaultArgs } from '../../decorators';

type Args = {
  active?: boolean,
  small?: boolean,
  overlay?: boolean,
  title?: boolean,
  inline?: boolean
}

export interface LoadingComponentSignature {
  Args: Args
}

export default class LoadingComponent extends Component<LoadingComponentSignature> {
  args: Args = defaultArgs(this, {
    active: true,
    small: false,
    overlay: false,
    title: null,
    inline: false
  });
  loading: any;

  @action
  loadCarbonComponent(elem) {
    this.loading = new Loading(elem, this.args);
  }

  @action
  destroyCarbonComponent() {
    return this.loading && this.loading.end();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'carbon-components-ember/components/loading': typeof LoadingComponent;
    'Carbon::Loading': typeof LoadingComponent;
  }
}
