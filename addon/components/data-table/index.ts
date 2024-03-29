import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../../decorators';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import { task } from 'ember-concurrency';
import { next } from '@ember/runloop';
import TableToolbarComponent from 'carbon-components-ember/components/data-table/-toolbar';
import TableSearchComponent from 'carbon-components-ember/components/data-table/-search-input';
import CarbonPagination from 'carbon-components-ember/components/pagination';
import TableComponent from 'carbon-components-ember/components/data-table/-table';
import DataTableBody from 'carbon-components-ember/components/data-table/-body';
import TableMenuComponent from 'carbon-components-ember/components/data-table/-menu';
import TableColumn from 'carbon-components-ember/components/data-table/-column';
import { WithBoundArgs } from '@glint/template';
import ListHeaderComponent, { Header } from 'carbon-components-ember/components/data-table/-header';

class TrackedSet {
  @tracked counter = 0;
  set: Set<any>;
  constructor() {
    this.set = new Set();
  }

  toArray() {
    if (!this.counter) return [];
    return [...this.set];
  }

  setTo(array) {
    this.set = new Set(array);
    this.counter++;
  }

  clear() {
    this.set.clear();
    this.counter++;
  }

  add(v) {
    this.set.add(v);
    this.counter++;
  }

  delete(v) {
    this.set.delete(v);
    this.counter++;
  }

  hasAll(a) {
    if (!this.counter) return false;
    return a.every(i => this.set.has(i));
  }

  has(v) {
    if (!this.counter) return false;
    return this.set.has(v);
  }

  get size() {
    if (!this.counter) return 0;
    return this.set.size;
  }
}

class State {
  @tracked currentItemsSlice?: {start: number; end?: number; itemsPerPage: number; page: number} = undefined;
  @tracked currentSearchTerm?: string = undefined;
  @tracked currentSearch?: MutableArray<any> = undefined;
  @tracked selectedItems = new TrackedSet();

}

type Args<T> = {
  onSelectionChange?: (items: any[]) => void;
  registerState?: (state: State) => void;
  search?: () => Promise<boolean>;
  state?: State;
  items: T[];
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export interface DataTableComponentSignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [{
      Toolbar: WithBoundArgs<typeof TableToolbarComponent, 'table'>;
      SearchInput: WithBoundArgs<typeof TableSearchComponent, 'isLoading'|'value'|'onChange'>;
      Pagination: WithBoundArgs<typeof CarbonPagination, 'isLoading'|'length'|'state'|'onPageChanged'>;
      Table: WithBoundArgs<typeof TableComponent, 'isLoading'>;
      EachBodyRows: WithBoundArgs<typeof DataTableBody<T>, 'table'|'isExpandable'|'isCheckable'|'items'>;
      Column: typeof TableColumn;
      Menu: typeof TableMenuComponent;
      Header: WithBoundArgs<typeof ListHeaderComponent, 'table'>;
    }];
  };
}

export default class DataTableComponent<T> extends Component<DataTableComponentSignature<T>> {
  // this is set by the Header Component
  declare isExpandable: boolean
  declare isCheckable: boolean
  declare headers: Header[]

  @defaultArgs
  args: Args<T> = {
    onSelectionChange: (items: any[]) => null,
    registerState: (state: State) => null,
    search: undefined,
    state: undefined,
    items: undefined as any,
    isLoading: false,
    title: '',
    description: ''
  };

  @tracked internalState: State;

  get searchFunction() {
    if (this.args.search) return this.args.search;
    const ensureString = v => (typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    const f = (t, term) => {
      if (!term || term === '') return true;
      if (t.id && t.id.toLowerCase().includes(term)) return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter((v: any) => v && !v.defaultAdapter)
        .some(v => (v && ensureString(v).includes(term)));
    };
    return f;
  }

  constructor(...args: [any, any]) {
    super(...args);
    next(() => {
      if (!this.state.currentItemsSlice) {
        this.state.currentItemsSlice = { start: 0, end: undefined, itemsPerPage: 0, page: 0 };
      }
    });

    this.internalState = new State();
  }

  get state(): State {
    return this.args.state || this.internalState;
  }

  get selectedItemsArray() {
    return this.state.selectedItems.toArray();
  }

  get items(): any[] {
    if (this.state.currentSearch) {
      return this.state.currentSearch.toArray();
    }
    return this.args.items;
  }

  applySearch = task({ restartable: true }, async(items, term) => {
    this.state.currentSearch = A([]);
    term = term && term.toLowerCase();
    const f = this.searchFunction;
    for (const t of items.toArray()) {
      if (await f(t, term)) {
        this.state.currentSearch!!.pushObject(t);
      }
    }
  })

  get currentItems() {
    if (!this.items || !this.state.currentItemsSlice) return [];
    return this.items.slice(this.state.currentItemsSlice.start, this.state.currentItemsSlice.end);
  }

  get allChecked() {
    return this.state.selectedItems.hasAll(this.currentItems);
  }

  @action
  didInsert() {
    next(() => this.args.registerState?.(this.state));
  }

  @action
  search(term) {
    this.state.currentSearchTerm = term;
    if (!term) {
      this.state.currentSearch = undefined;
      this.applySearch.cancelAll();
      return
    }
    return this.applySearch.perform(this.args.items || [], term);
  }

  @action
  toggleItemSelection(item, selected) {
    if (selected && !this.state.selectedItems.has(item)) {
      this.state.selectedItems.add(item);
    }
    if (!selected) {
      this.state.selectedItems.delete(item);
    }
    // eslint-disable-next-line no-self-assign
    this.args.onSelectionChange?.(this.state.selectedItems.toArray());
  }

  @action
  toggleSelectAllItems(select) {
    if (select) {
      this.state.selectedItems.setTo(this.currentItems.slice());
    } else {
      this.state.selectedItems.setTo([]);
    }
    // eslint-disable-next-line no-self-assign
    this.args.onSelectionChange?.(this.state.selectedItems.toArray());
  }

  @action
  changePage(slice) {
    this.state.currentItemsSlice = slice;
  }
}
