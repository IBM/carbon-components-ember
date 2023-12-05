import Component from '@glimmer/component';

export interface TableColumnSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class TableColumn extends Component<TableColumnSignature> {
  <template>
    <td ...attributes>
      {{yield}}
    </td>
  </template>
}
