import { modifier } from 'ember-modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import SearchComponent from '../components/search.gts';
import type { WithBoundArgs } from '@glint/template';
import CarbonPagination from '../components/pagination.gts';
import ListColumnComponent from '../components/list/-column.gts';
import ListBodyComponent from '../components/list/-body.gts';
import ListHeaderComponent from '../components/list/-header.gts';
import ListSkeletonComponent from '../components/list/-skeleton.gts';
import './list.scss';

export interface ListSignature<T> {
  Element: HTMLElement;
  Args: {
    items?: T[];
    loading?: boolean;
    onSelect?(item: T): void;
    selectable?: boolean;
  };
  Blocks: {
    default: [
      {
        items: T[];
        SearchInput: WithBoundArgs<
          typeof SearchComponent,
          'value' | 'onChange' | 'light' | 'size'
        >;
        Pagination: WithBoundArgs<
          typeof CarbonPagination,
          'length' | 'onPageChanged'
        >;
        Column: typeof ListColumnComponent;
        BodyRows: WithBoundArgs<typeof ListBodyComponent<T>, 'list' | 'items'>;
        Header: typeof ListHeaderComponent;
      },
    ];
  };
}

export default class List<T> extends Component<ListSignature<T>> {
  @tracked currentSearch?: string;
  @tracked currentItemsSlice: { start: number; end?: number } | null = null;
  @tracked currentItem?: T;

  filter(items: T[], term: string) {
    term = term && term.toLowerCase();
    const ensureString = (v: unknown) =>
      typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase();
    return items.filter((t) => {
      if (!term || term === '') return true;
      const item = t as { toJSON?: () => object };
      return Object.values(
        typeof item.toJSON === 'function' ? item.toJSON() : (t as object),
      )
        .filter(
          (v: unknown) =>
            v && !(v as { defaultAdapter?: unknown }).defaultAdapter,
        )
        .some((v) => v && ensureString(v).includes(term));
    });
  }

  get currentItems() {
    if (this.currentSearch) {
      return this.filter(this.args.items || [], this.currentSearch);
    }
    if (!this.args.items || !this.currentItemsSlice) return [];
    return this.args.items.slice(
      this.currentItemsSlice.start,
      this.currentItemsSlice.end,
    );
  }

  setCurrentSearch = (search: string) => {
    this.currentSearch = search;
  };

  setCurrentItemsSlice = (slice: { start: number; end: number }) => {
    this.currentItemsSlice = slice;
  };

  showAllItems = task(async () => {
    await timeout(200);
    if (!this.currentItemsSlice) {
      this.currentItemsSlice = { start: 0, end: undefined };
    }
  });

  delayItems = modifier(() => {
    void this.showAllItems.perform();
    return () => void this.showAllItems.cancelAll();
  });

  onSelect = (item: T) => {
    this.currentItem = item;
    this.args.onSelect?.(item);
  };

  <template>
    {{#if @loading}}
      <ListSkeletonComponent ...attributes />
    {{else}}
      <section
        class="cds--structured-list cds--ember-list
          {{if @selectable 'cds--structured-list--selection'}}"
        {{this.delayItems}}
        ...attributes
      >
        {{yield
          (hash
            items=this.currentItems
            SearchInput=(component
              SearchComponent
              value=this.currentSearch
              onChange=this.setCurrentSearch
              light=true
              size="sm"
            )
            Pagination=(component
              CarbonPagination
              length=@items.length
              onPageChanged=this.setCurrentItemsSlice
            )
            Column=ListColumnComponent
            BodyRows=(component
              ListBodyComponent list=this items=this.currentItems
            )
            Header=ListHeaderComponent
          )
        }}
      </section>
    {{/if}}
  </template>
}
