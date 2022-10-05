import Component from '@glimmer/component';
import { action } from '@ember/object';
import Loading from 'carbon-components/es/components/loading/loading';
import { defaultArgs } from '../../decorators';

type Args = {
  active?: boolean;
  small?: boolean;
  overlay?: boolean;
  title?: boolean;
  inline?: boolean;
  classNames?: string;
}

export interface LoadingComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
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


