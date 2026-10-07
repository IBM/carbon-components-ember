import type { TOC } from '@ember/component/template-only';

export interface ListColumnComponentSignature {
  Args: {
    nowrap?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const ListColumnComponent: TOC<ListColumnComponentSignature> = <template>
  <div
    class="cds--structured-list-td
      {{if @nowrap 'cds--structured-list-content--nowrap'}}"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export default ListColumnComponent;
