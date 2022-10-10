import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';

type Args = {
  status?: 'active'|'finished'|'error'|'indeterminate';
  size?: 'small'|'big';
  type?: 'default'|'inline'|'indented';
  value?: number;
  max?: number;
  label?: string;
  helperText?: string;
}

export interface ProgressBarInterface {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 The Carbon ProgressBar

 ```handlebars

 <Carbon::ProgressBar />
 ```
 @class CarbonButton
 @public
 **/
export default class ProgressBar extends Component<ProgressBarInterface> {
  get guid() {
    return guidFor(this);
  }

  get defaultArgs(): WithRequired<Args, 'max'> {
    return Object.assign({}, {
      status: 'active',
      value: undefined,
      max: 100,
      size: undefined,
      type: 'default',
      helperText: '',
      label: '',
    }, this.args)
  }
}



