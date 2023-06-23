import Component from '@glimmer/component';
import { action } from '@ember/object';
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
}


