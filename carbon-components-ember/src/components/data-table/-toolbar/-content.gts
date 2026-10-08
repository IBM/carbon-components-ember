import type { TOC } from '@ember/component/template-only';

export interface TableToolbarContentSignature {
  Blocks: {
    default: [];
  };
}

const TableToolbarContent: TOC<TableToolbarContentSignature> = <template>
  <div class="cds--toolbar-content">
    {{yield}}
  </div>
</template>;

export default TableToolbarContent;
