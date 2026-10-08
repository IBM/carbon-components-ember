import type { TOC } from '@ember/component/template-only';

export interface TableToolbarContentSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const TableToolbarContent: TOC<TableToolbarContentSignature> = <template>
  <div class="cds--toolbar-content" ...attributes>
    {{yield}}
  </div>
</template>;

export default TableToolbarContent;
