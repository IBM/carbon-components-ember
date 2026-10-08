import { concat } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

export interface TableSignature {
  Element: HTMLTableElement;
  Args: {
    isLoading?: boolean;
    isSortable?: boolean;
    useZebraStyles?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };
  Blocks: {
    default: [];
  };
}

const Table: TOC<TableSignature> = <template>
  <table
    class="cds--data-table
      {{if @size (concat 'cds--data-table--' @size)}}
      {{if @useZebraStyles 'cds--data-table--zebra'}}
      {{if @isSortable 'cds--data-table--sort'}}
      {{if @isLoading 'cds--skeleton'}}"
    ...attributes
  >
    {{yield}}
  </table>
</template>;

export default Table;
