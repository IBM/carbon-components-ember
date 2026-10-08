import type { TOC } from '@ember/component/template-only';

export interface ListHeaderSignature {
  Args: {
    headers: string[];
  };
}

const ListHeader: TOC<ListHeaderSignature> = <template>
  <div class="cds--structured-list-thead">
    <div class="cds--structured-list-row cds--structured-list-row--header-row">
      {{#each @headers as |h|}}
        <div class="cds--structured-list-th">
          {{h}}
        </div>
      {{/each}}
    </div>
  </div>
</template>;

export default ListHeader;
