import Component from '@glimmer/component';

export default class ListSkeletonComponent extends Component {
  <template>
    <section class='cds--structured-list cds--skeleton'>
      <div class='cds--structured-list-thead'>
        <div
          class='cds--structured-list-row cds--structured-list-row--header-row'
        >
          <div class='cds--structured-list-th'>
            Item
          </div>
          <div class='cds--structured-list-th'>
            Details
          </div>
        </div>
      </div>
      <div class='cds--structured-list-tbody'>
        <div class='cds--structured-list-row'>
          <div
            class='cds--structured-list-td cds--structured-list-content--nowrap'
          >
            <div class='cds--skeleton__text'></div>
          </div>
          <div
            class='cds--structured-list-td cds--structured-list-content--nowrap'
          >
            <div class='cds--skeleton__text'></div>
          </div>
        </div>
      </div>
    </section>
  </template>
}
