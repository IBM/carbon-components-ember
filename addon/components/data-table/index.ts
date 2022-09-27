import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../../decorators';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency-decorators';
import {next} from '@ember/runloop';

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
  @tracked currentItemsSlice?: {start: number, end?: number} = undefined;
  @tracked currentSearchTerm?: string = undefined;
  @tracked currentSearch?: MutableArray<any> = undefined;
  @tracked selectedItems = new TrackedSet();

}

type Args = {
  onSelectionChange: (items: any[]) => void,
  registerState: (state: State) => void,
  search: () => Promise<boolean>,
  state: State,
  items: any[];
  isLoading: boolean;
  title: string;
  description: string;
}

export interface DataTableComponentSignature {
  Args: Args;
  Blocks: {
    default: [{

    }]
  }
}

export default class DataTableComponent extends Component<DataTableComponentSignature> {
  // this is set by the Header Component
  declare isExpandable: boolean
  declare isCheckable: boolean

  args: Args = defaultArgs(this, {
    onSelectionChange: (items: any[]) => null,
    registerState: (state: State) => null,
    search: null,
    state: null,
    items: null
  });

  @tracked internalState: State;

  get searchFunction() {
    if (this.args.search) return this.args.search;
    const ensureString = v => (typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    const f = (t, term) => {
      if (!term || term === '') return true;
      if (t.id && t.id.includes(term)) return true;
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
        this.state.currentItemsSlice = { start: 0, end: undefined };
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

  @task({ restartable: true })
  *applySearch(items, term) {
    this.state.currentSearch = A([]);
    let cancelled = false;
    const run = async() => {
      term = term && term.toLowerCase();
      const f = this.searchFunction;
      for (const t of items.toArray()) {
        if (cancelled) break;
        if (await f(t, term)) {
          this.state.currentSearch!!.pushObject(t);
        }
      }
    }

    try {
      return yield run();
    } finally {
      cancelled = true;
    }
  }

  get currentItems() {
    if (!this.items || !this.state.currentItemsSlice) return [];
    return this.items.slice(this.state.currentItemsSlice.start, this.state.currentItemsSlice.end);
  }

  get allChecked() {
    return this.state.selectedItems.hasAll(this.currentItems);
  }

  @action
  didInsert() {
    next(this.args, this.args.registerState, this.state);
  }

  @action
  search(term) {
    this.state.currentSearchTerm = term;
    if (!term) {
      this.state.currentSearch = undefined;
      taskFor(this.applySearch).cancelAll();
      return
    }
    return taskFor(this.applySearch).perform(this.args.items || [], term);
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
    this.args.onSelectionChange(this.state.selectedItems.toArray());
  }

  @action
  toggleSelectAllItems(select) {
    if (select) {
      this.state.selectedItems.setTo(this.currentItems.slice());
    } else {
      this.state.selectedItems.setTo([]);
    }
    // eslint-disable-next-line no-self-assign
    this.args.onSelectionChange(this.state.selectedItems.toArray());
  }

  @action
  changePage(slice) {
    this.state.currentItemsSlice = slice;
  }
}
