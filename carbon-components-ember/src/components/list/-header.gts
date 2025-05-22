import Component from '@glimmer/component';

export type Args = {
  headers: string[];
};

export default class ListHeaderComponent extends Component<Args> {
  <template>
    <div class='cds--structured-list-thead'>
      <div
        class='cds--structured-list-row cds--structured-list-row--header-row'
      >
        {{#each @headers as |h|}}
          <div class='cds--structured-list-th'>
            {{h}}
          </div>
        {{/each}}
      </div>
    </div>
  </template>
}
