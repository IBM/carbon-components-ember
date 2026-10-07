import { concat } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

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

const TableComponent: TOC<TableComponentSignature> = <template>
  <table
    class="cds--data-table
      {{if @size (concat 'cds--data-table--' @size)}}
      {{if @useZebraStyles 'cds--data-table--zebra'}}
      {{if @isSortable 'cds--data-table--sort'}}
      {{if @isLoading 'cds--skeleton'}}"
  >
    {{yield}}
  </table>
</template>;

export default TableComponent;
