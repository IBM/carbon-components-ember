import { concat } from '@ember/helper';
import Component from '@glimmer/component';

export type Args = {
  isLoading?: boolean;
  isSortable?: boolean;
  useZebraStyles?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export interface TableComponentSignature {
  Args: Args;
  Blocks: {
    default: [];
  };
}

export default class TableComponent extends Component<TableComponentSignature> {
  <template>
    <table
      class='cds--data-table
        {{if @size (concat "cds--data-table--" @size)}}
        {{if @useZebraStyles "cds--data-table--zebra"}}
        {{if @isSortable "cds--data-table--sort"}}
        {{if @isLoading "cds--skeleton"}}'
    >
      {{yield}}
    </table>
  </template>
}
