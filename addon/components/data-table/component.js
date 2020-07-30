import Component from '@glimmer/component';
import { action, computed} from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from "../../decorators";

export default class ListComponent extends Component {
  tagName = '';
  @tracked currentSearch = null;
  @tracked selectedItems = new Set();
  @tracked currentItemsSlice = null;
  @tracked currentSearchTerm = null;

  @defaultArgs
  args = {
    onSelectionChange: () => null,
    search: null,
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
    return [...this.selectedItems];
  }

  get items() {
    if (this.currentSearch !== null) {
      return this.currentSearch;
    }
    return this.args.items;
  }

  applySearch(items, term) {
    term = term && term.toLowerCase();
    const f = this.searchFunction;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // eslint-disable-next-line no-async-promise-executor
    const p = new Promise(async (res) => {
      // eslint-disable-next-line no-unused-vars
      for (const t of items.toArray()) {
        if (await f(t, term)) {
          if (p.cancelled) break;
          await delay(0);
          this.currentSearch.pushObject(t);
        }
        if (p.cancelled) break;
      }
      res();
    });
    p.cancel = () => p.cancelled = true;
    return p;
  }

  @computed()
  get currentItems() {
    if (!this.items || !this.currentItemsSlice) return [];
    return this.items.slice(this.currentItemsSlice.start, this.currentItemsSlice.end);
  }

  get allChecked() {
    return this.currentItems.every(i => this.selectedItems.has(i));
  }

  @action
  search(term) {
    this.currentSearch = [];
    this.currentSearchTerm = term;
    if (!term) {
      this.currentSearch = null;
      return Promise.resolve();
    }
    return this.applySearch(this.args.items || [], term);
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
    this.selectedItems = this.selectedItems;
    this.args.onSelectionChange([...this.selectedItems]);
  }

  @action
  toggleSelectAllItems(select) {
    if (select) {
      this.selectedItems = new Set(this.currentItems.slice());
    } else {
      this.selectedItems = new Set([]);
    }
    // eslint-disable-next-line no-self-assign
    this.selectedItems = this.selectedItems;
    this.args.onSelectionChange([...this.selectedItems]);
  }

  @action
  delayItems() {
    setTimeout(() => {
      if (!this.currentItemsSlice) {
        this.currentItemsSlice = { start: 0, end: undefined };
      }
    }, 200);
  }
}
