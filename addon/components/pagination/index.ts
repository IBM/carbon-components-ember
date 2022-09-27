import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { defaultArgs } from '../../decorators';
import { next } from '@ember/runloop';
/** @documenter yuidoc */

type Slice = {
  page: number;
  itemsPerPage: number;
  start: number;
  end: number;
}

type Args = {
  disabled: boolean,
  length: number,
  onPageChanged : (currentSlice: Slice) => void,
  state?: {
    page: number;
    itemsPerPage: number
  },
  itemsPerPageOptions: number
};

export default class CarbonPagination extends Component<Args> {
  @tracked currentPage = 1;
  @tracked itemsPerPage = 10;

  args: Args = defaultArgs(this, {
    disabled: false,
    length: 1,
    onPageChanged : () => null,
    state: null,
    itemsPerPageOptions: null
  });


  get pages() {
    return parseInt((this.args.length / this.itemsPerPage).toString()) + 1;
  }

  get currentSlice(): Slice {
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
    this.lengthChanged();
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
    next(() => {
      this.args.onPageChanged(this.currentSlice);
    });
  }

  @action
  lengthChanged() {
    if (this.currentPage > this.pages) {
      this.currentPage = this.pages;
      this.pageChanged();
    }
  }
}
