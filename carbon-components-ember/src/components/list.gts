import { modifier } from 'ember-modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import SearchComponent from '../components/search.gts';
import type { WithBoundArgs } from '@glint/template';
import CarbonPagination from '../components/pagination.gts';
import ListColumnComponent from '../components/list/-column.gts';
import ListBodyComponent from '../components/list/-body.gts';
import ListHeaderComponent from '../components/list/-header.gts';
import { stylesheet } from 'astroturf';
import ListSkeletonComponent from '../components/list/-skeleton.gts';

export type Args<T> = {
  items?: T[];
  loading?: boolean;
  onSelect?(item: T): void;
  selectable?: boolean;
};

export interface ListComponentSignature<T> {
  Args: Args<T>;
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

export default class ListComponent<T> extends Component<
  ListComponentSignature<T>
> {
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

  delayItems = modifier(() => {
    const timer = setTimeout(() => {
      if (!this.currentItemsSlice) {
        this.currentItemsSlice = { start: 0, end: undefined };
      }
    }, 200);
    return () => clearTimeout(timer);
  });

  onSelect = (item: T) => {
    this.currentItem = item;
    this.args.onSelect?.(item);
  };

  styles = stylesheet`
    .namespace {
      position: relative;
      :global(.cds--pagination) {
        position: absolute;
        right: 0;
        left: 0;
      }

      :global(.cds--search) {
        width: 250px;
        display: table-caption;
      }
    }` as {
    namespace: string;
  };

  <template>
    {{#if @loading}}
      <ListSkeletonComponent />
    {{else}}
      <section
        class="cds--structured-list
          {{this.styles.namespace}}
          {{if @selectable 'cds--structured-list--selection'}}"
        {{this.delayItems}}
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
