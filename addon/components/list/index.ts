import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import SearchComponent from 'carbon-components-ember/components/search-input';
import { WithBoundArgs } from '@glint/template';
import CarbonPagination from 'carbon-components-ember/components/pagination';
import ListColumnComponent from 'carbon-components-ember/components/list/-column';
import ListBodyComponent from 'carbon-components-ember/components/list/-body';
import ListHeaderComponent from 'carbon-components-ember/components/list/-header';

type Args<T> = {
  items?: T[];
  loading?: boolean;
  onSelect?(item: any): void;
  selectable?: boolean;
}

export interface ListComponentSignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [{
      items: T[];
      SearchInput: WithBoundArgs<typeof SearchComponent, 'value'|'onChange'|'light'|'size'>;
      Pagination: WithBoundArgs<typeof CarbonPagination, 'length'|'onPageChanged'>;
      Column: typeof ListColumnComponent;
      BodyRows: WithBoundArgs<typeof ListBodyComponent<T>, 'list'|'items'>;
      Header: typeof ListHeaderComponent;
    }];
  };
}

export default class ListComponent<T> extends Component<ListComponentSignature<T>> {
  @tracked currentSearch: string;
  @tracked currentItemsSlice:any = null;
  @tracked currentItem?: T;

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

  @action
  onSelect(item: T) {
    this.currentItem = item;
    this.args.onSelect?.(item);
  }
}
