import Component from '@glimmer/component';
import { action, computed} from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from "../../decorators";

export default class ListComponent extends Component {
  tagName = '';
  @tracked currentSearch = null;
  @tracked selectedItems = new Set();
  @tracked currentItemsSlice = null;

  @defaultArgs
  args = {
    onSelectionChange: () => null,
    items: null
  }

  get items() {
    return this.args.items;
  }

  filter(items, term) {
    term = term && term.toLowerCase();
    const ensureString = v => (typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    return items.filter((t) => {
      if (!term || term === '') return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter(v => v && !v.defaultAdapter)
        .some(v => (v && ensureString(v).includes(term)));
    });
  }

  @computed('currentSearch', 'items', 'currentItemsSlice')
  get currentItems() {
    if (this.currentSearch) {
      return this.filter(this.items || [], this.currentSearch);
    }
    if (!this.items || !this.currentItemsSlice) return [];
    return this.items.slice(this.currentItemsSlice.start, this.currentItemsSlice.end);
  }

  get allChecked() {
    return this.currentItems.every(i => this.selectedItems.has(i));
  }

  @action
  toggleItemSelection(item, selected) {
    if (selected && !this.selectedItems.has(item)) {
      this.selectedItems.add(item);
    }
    if (!selected) {
      this.selectedItems.remove(item);
    }
    // eslint-disable-next-line no-self-assign
    this.selectedItems = this.selectedItems;
    this.args.onSelectionChange(this.selectedItems);
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
    this.args.onSelectionChange(this.selectedItems);
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
