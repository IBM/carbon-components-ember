import type { TOC } from '@ember/component/template-only';

export type Args = {
  headers: string[];
};

const ListHeaderComponent: TOC<{ Args: Args }> = <template>
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

export default ListHeaderComponent;
