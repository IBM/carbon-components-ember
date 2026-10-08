import type { TOC } from '@ember/component/template-only';

export interface ListColumnSignature {
  Args: {
    nowrap?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const ListColumn: TOC<ListColumnSignature> = <template>
  <div
    class="cds--structured-list-td
      {{if @nowrap 'cds--structured-list-content--nowrap'}}"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export default ListColumn;
