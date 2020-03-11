import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CarbonPagination extends Component {
  tagName = '';
  @tracked disabled = false;
  @tracked currentPage = 1;
  @tracked length = 1;
  @tracked itemsPerPage = 10;

  get pages() {
    return parseInt(this.length / this.itemsPerPage) + 1;
  }

  get currentSlice() {
    return {
      start: (this.currentPage - 1) * this.itemsPerPage,
      end: (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage
    };
  }

  @action
  setItemsPerPage(items) {
    this.itemsPerPage = items;
    this.pageChanged();
  }

  @action
  setCurrentPage(p) {
    this.currentPage = p;
    this.pageChanged();
  }

  @action
  pageBack() {
    this.currentPage -= 1;
    this.pageChanged();
  }

  @action
  pageForward() {
    this.currentPage += 1;
    this.pageChanged();
  }

  @action
  pageChanged() {
    this.attrs.onPageChanged(this.currentSlice);
  }
}
