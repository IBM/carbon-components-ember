import Component from '@glimmer/component';
import { action, computed} from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from "../../decorators";
import { task } from 'ember-concurrency-decorators'

class TrackedSet {
  @tracked counter = 0;
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

export default class ListComponent extends Component {
  tagName = '';

  @tracked currentSearch = null;
  @tracked currentItemsSlice = null;
  @tracked currentSearchTerm = null;
  selectedItems = new TrackedSet();

  get trackedState() {
    return {
      selectedItems: this.selectedItems.toArray(),
      currentSearchTerm: this.currentSearchTerm,
      currentSearch: this.currentSearch,
      currentItemsSlice: this.currentItemsSlice,
    }
  }

  @defaultArgs
  args = {
    onSelectionChange: () => null,
    onStateChanged: () => null,
    search: null,
    state: null,
    items: null
  }

  get searchFunction() {
    if (this.args.search) return this.args.search;
    const ensureString = v => (typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    const f = (t, term) => {
      if (!term || term === '') return true;
      if (t.id && t.id.includes(term)) return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter(v => v && !v.defaultAdapter)
        .some(v => (v && ensureString(v).includes(term)));
    };
    return f;
  }

  get selectedItemsArray() {
    return this.selectedItems.toArray();
  }

  get items() {
    if (this.currentSearch !== null) {
      return this.currentSearch;
    }
    return this.args.items;
  }

  @task({ restartable: true })
  *applySearch(items, term) {
    this.currentSearch = [];
    let cancelled = false;
    const run = async () => {
      term = term && term.toLowerCase();
      const f = this.searchFunction;
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      for (const t of items.toArray()) {
        if (cancelled) break;
        if (await f(t, term)) {
          this.currentSearch.pushObject(t);
        }
      }
    }

    try {
      return yield run();
    } finally {
      cancelled = true;
    }
  }

  @computed()
  get currentItems() {
    if (!this.items || !this.currentItemsSlice) return [];
    return this.items.slice(this.currentItemsSlice.start, this.currentItemsSlice.end);
  }

  get allChecked() {
    return this.selectedItems.hasAll(this.currentItems);
  }

  @action
  search(term) {
    this.currentSearchTerm = term;
    if (!term) {
      this.currentSearch = null;
      this.applySearch.cancelAll();
      return Promise.resolve();
    }
    return this.applySearch.perform(this.args.items || [], term);
  }

  @action
  toggleItemSelection(item, selected) {
    if (selected && !this.selectedItems.has(item)) {
      this.selectedItems.add(item);
    }
    if (!selected) {
      this.selectedItems.delete(item);
    }
    // eslint-disable-next-line no-self-assign
    this.args.onSelectionChange(this.selectedItems.toArray());
  }

  @action
  toggleSelectAllItems(select) {
    if (select) {
      this.selectedItems.setTo(this.currentItems.slice());
    } else {
      this.selectedItems.setTo([]);
    }
    // eslint-disable-next-line no-self-assign
    this.args.onSelectionChange(this.selectedItems.toArray());
  }

  @action
  updateState() {
    if (this.args.state) {
      this.currentItemsSlice = this.args.state.currentItemsSlice || this.currentItemsSlice;
      this.currentSearch = this.args.state.currentSearch || this.currentSearch;
      this.currentSearchTerm = this.args.state.currentSearchTerm || this.currentSearchTerm;
      if (this.args.state.selectedItems) {
        this.selectedItems.setTo(this.args.state.selectedItems);
      }
    }
  }

  @action
  initialize() {
    if (this.args.state) {
      this.updateState();
    }
    setTimeout(() => {
      if (!this.currentItemsSlice) {
        this.currentItemsSlice = { start: 0, end: undefined };
      }
    }, 200);
  }

  @action
  updateItems() {
    this.selectedItems.toArray().forEach((i) => {
      if (!this.args.items.includes(i)) {
        this.selectedItems.delete(i);
      }
    });
  }
}
