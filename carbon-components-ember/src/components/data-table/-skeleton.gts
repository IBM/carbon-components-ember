import type { TOC } from '@ember/component/template-only';

export interface DataTableSkeletonSignature {
  Args: {
    headers: string[];
  };
}

const DataTableSkeleton: TOC<DataTableSkeletonSignature> = <template>
  <section class="cds--structured-list cds--skeleton">
    <div class="cds--structured-list-tbody">
      <div class="cds--structured-list-row">
        {{#each @headers}}
          <div
            class="cds--structured-list-td cds--structured-list-content--nowrap"
          >
            <div class="cds--skeleton__text"></div>
          </div>
        {{/each}}
      </div>
    </div>
  </section>
</template>;

export default DataTableSkeleton;
