import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { defaultArgs } from "../../decorators";

export default class CarbonPagination extends Component {
  @tracked currentPage = 1;
  @tracked itemsPerPage = 10;

  @defaultArgs
  args = {
    disabled: false,
    length: 1,
    onPageChanged : () => null,
    state: null,
    itemsPerPageOptions: null
  };


  get pages() {
    return parseInt(this.args.length / this.itemsPerPage) + 1;
  }

  get currentSlice() {
    const ipp = this.itemsPerPage;
    return {
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      start: (this.currentPage - 1) * ipp,
      end: (this.currentPage - 1) * ipp + ipp
    };
  }

  @action
  setState(state) {
    if (!state) return;
    this.currentPage = state.page;
    this.itemsPerPage = state.itemsPerPage;
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
    this.args.onPageChanged(this.currentSlice);
  }

  @action
  lengthChanged() {
    if (this.currentPage > this.pages) {
      this.currentPage = this.pages;
      this.pageChanged();
    }
  }
}
