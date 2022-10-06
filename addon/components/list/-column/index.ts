import Component from '@glimmer/component';

export interface ListColumnComponentSignature {
  Args: {
    nowrap?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class ListColumnComponent extends Component<ListColumnComponentSignature> {

}
