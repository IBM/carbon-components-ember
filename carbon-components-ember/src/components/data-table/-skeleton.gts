import Component from '@glimmer/component';

type Args = {
  headers: string[];
};

export default class ListSkeletonComponent extends Component<Args> {
  <template>
    <section class='cds--structured-list cds--skeleton'>
      <div class='cds--structured-list-tbody'>
        <div class='cds--structured-list-row'>
          {{#each @headers}}
            <div
              class='cds--structured-list-td cds--structured-list-content--nowrap'
            >
              <div class='cds--skeleton__text'></div>
            </div>
          {{/each}}
        </div>
      </div>
    </section>
  </template>
}
