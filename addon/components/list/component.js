import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ListComponent extends Component {
  tagName = '';
  @tracked attrs;
  @tracked items;
  @tracked currentSearch = null;
  @tracked currentItemsSlice = null;

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

  @action
  delayItems() {
    setTimeout(() => {
      if (!this.currentItemsSlice) {
        this.currentItemsSlice = { start: 0, end: undefined };
      }
    }, 200);
  }
}
