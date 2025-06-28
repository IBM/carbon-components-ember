import { fn, hash } from '@ember/helper';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import SearchComponent from '../components/search-input.gts';
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
  onSelect?(item: any): void;
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
  @tracked currentItemsSlice: any = null;
  @tracked currentItem?: T;

  filter(items: any[], term: string) {
    term = term && term.toLowerCase();
    const ensureString = (v: any) =>
      typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase();
    return items.filter((t) => {
      if (!term || term === '') return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter((v: any) => v && !v.defaultAdapter)
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

  styles = stylesheet`
    .namespace {
      .cds--pagination {
        position: absolute;
        right: 0;
        left: 0;
      }

      .cds--search {
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
        class='cds--structured-list
          {{this.styles.namespace}}
          {{if @selectable "cds--structured-list--selection"}}'
        style='position: relative;'
        {{didInsert this.delayItems}}
      >
        {{yield
          (hash
            items=this.currentItems
            SearchInput=(component
              SearchComponent
              value=this.currentSearch
              onChange=(fn (mut this.currentSearch))
              light=true
              size='sm'
            )
            Pagination=(component
              CarbonPagination
              length=@items.length
              onPageChanged=(fn (mut this.currentItemsSlice))
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
