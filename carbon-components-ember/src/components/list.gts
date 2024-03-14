import { default as ListRow } from './-row';
import { default as ListColumn } from './-column';
import { default as ListHeader } from './-header';
import { default as ListBody } from './-body';
import { default as Skeleton } from './-skeleton';
import { default as Pagination } from '../pagination';
import { default as SearchInput } from '../search-input';
import { default as styles } from './styles.scoped.scss';
import { fn } from '@ember/helper';
import { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import SearchComponent from '#∼/components/search-input.gts'
import { WithBoundArgs } from '@glint/template';
import CarbonPagination from '#∼/components/pagination.gts'
import ListColumnComponent from '#∼/components/list/-column.gts'
import ListBodyComponent from '#∼/components/list/-body.gts'
import ListHeaderComponent from '#∼/components/list/-header.gts'

type Args<T> = {
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
        BodyRows: WithBoundArgs<typeof ListBodyComponent, 'list' | 'items'>;
        Header: typeof ListHeaderComponent;
      },
    ];
  };
}

export default class ListComponent<T> extends Component<
  ListComponentSignature<T>
> {
  @tracked currentSearch: string;
  @tracked currentItemsSlice: any = null;
  @tracked currentItem?: T;

  filter(items, term) {
    term = term && term.toLowerCase();
    const ensureString = (v) =>
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

  <template>
    {{#if @loading}}
      <Skeleton />
    {{else}}
      <section
        class='cds--structured-list
          {{styles.namespace}}
          {{if @selectable "cds--structured-list--selection"}}'
        style='position: relative;'
        {{didInsert this.delayItems}}
      >
        {{yield
          (hash
            items=this.currentItems
            SearchInput=(component
              SearchInput
              value=this.currentSearch
              onChange=(fn (mut this.currentSearch))
              light=true
              size='sm'
            )
            Pagination=(component
              Pagination
              length=@items.length
              onPageChanged=(fn (mut this.currentItemsSlice))
            )
            Column=ListColumn
            BodyRows=(component ListBody list=this items=this.currentItems)
            Header=ListHeader
          )
        }}
      </section>
    {{/if}}
  </template>
}
