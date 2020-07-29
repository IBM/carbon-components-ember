import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from "../../decorators";

export default class ListComponent extends Component {
  tagName = '';
  @tracked currentSearch = null;
  @tracked selectedItems = [];
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

  get currentItems() {
    if (this.currentSearch) {
      return this.filter(this.items || [], this.currentSearch);
    }
    if (!this.items || !this.currentItemsSlice) return [];
    return this.items.slice(this.currentItemsSlice.start, this.currentItemsSlice.end);
  }

  get allChecked() {
    return this.currentItems.every(i => this.selectedItems.includes(i));
  }

  @action
  toggleItemSelection(item, selected) {
    if (selected && !this.selectedItems.includes(item)) {
      this.selectedItems.pushObject(item);
    }
    if (!selected) {
      this.selectedItems.removeObject(item);
    }
    this.args.onSelectionChange(this.selectedItems);
  }

  @action
  toggleSelectAllItems(select) {
    if (select) {
      this.selectedItems = this.currentItems.slice();
    } else {
      this.selectedItems = [];
    }
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
