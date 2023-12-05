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
  <template>
    <div
      class='cds--structured-list-td
        {{if @nowrap "cds--structured-list-content--nowrap"}}'
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
