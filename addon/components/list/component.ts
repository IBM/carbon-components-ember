import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Args = {
  items: any[]
}

export default class ListComponent extends Component<Args> {
  @tracked currentSearch = null;
  @tracked currentItemsSlice:any = null;

  filter(items, term) {
    term = term && term.toLowerCase();
    const ensureString = v => (typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    return items.filter((t) => {
      if (!term || term === '') return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter((v: any) => v && !v.defaultAdapter)
        .some(v => (v && ensureString(v).includes(term)));
    });
  }

  get currentItems() {
    if (this.currentSearch) {
      return this.filter(this.args.items || [], this.currentSearch);
    }
    if (!this.args.items || !this.currentItemsSlice) return [];
    return this.args.items.slice(this.currentItemsSlice.start, this.currentItemsSlice.end);
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
