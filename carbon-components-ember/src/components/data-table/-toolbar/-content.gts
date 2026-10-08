import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Blocks: {
    default: [];
  };
}

const TableToolbarContentComponent: TOC<Signature> = <template>
  <div class="cds--toolbar-content">
    {{yield}}
  </div>
</template>;

export default TableToolbarContentComponent;
