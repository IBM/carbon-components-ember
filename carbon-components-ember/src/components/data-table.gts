import { default as ListColumn } from './data-table/-column.gts';
import { default as ListHeader } from './data-table/-header.gts';
import { default as ListBody } from './data-table/-body.gts';
import { default as Toolbar } from './data-table/-toolbar.gts';
import { default as Table } from './data-table/-table.gts';
import { default as Pagination } from './pagination.gts';
import { default as SearchInput } from './data-table/-search-input.gts';
import { default as Menu } from './data-table/-menu.gts';
import { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../utils/decorators.ts';
import { A, type NativeArray } from '@ember/array';
import { task } from 'ember-concurrency';
import TableToolbarComponent from '../components/data-table/-toolbar.gts';
import TableSearchComponent from '../components/data-table/-search-input.gts';
import CarbonPagination from '../components/pagination.gts';
import TableComponent from '../components/data-table/-table.gts';
import DataTableBody from '../components/data-table/-body.gts';
import TableMenuComponent from '../components/data-table/-menu.gts';
import TableColumn from '../components/data-table/-column.gts';
import { type WithBoundArgs } from '@glint/template';
import ListHeaderComponent, {
  type Header,
} from '../components/data-table/-header.gts';
import { hash } from '@ember/helper';
import { runTask } from 'ember-lifeline';

class TrackedSet<T> extends Set<T> {
  @tracked counter = 0;

  toArray(): T[] {
    if (!this.counter) return [];
    return [...this];
  }

  setTo(array: T[]) {
    this.clear();
    for (const arrayElement of array) {
      this.add(arrayElement);
    }
    this.counter++;
  }

  clear() {
    super.clear();
    this.counter++;
  }

  add(v: T) {
    this.counter++;
    return super.add(v);
  }

  delete(v: T) {
    this.counter++;
    return super.delete(v);
  }

  hasAll(a: T[]) {
    if (!this.counter) return false;
    return a.every((i) => this.has(i));
  }

  has(v: T) {
    if (!this.counter) return false;
    return super.has(v);
  }

  get size() {
    if (!this.counter) return 0;
    return super.size;
  }
}

type Slice = {
  start: number;
  end?: number;
  itemsPerPage: number;
  page: number;
};

class State<T> {
  @tracked currentItemsSlice?: Slice = undefined;
  @tracked currentSearchTerm?: string = undefined;
  @tracked currentSearch?: NativeArray<T> = undefined;
  @tracked selectedItems = new TrackedSet<T>();
}

type Args<T> = {
  onSelectionChange?: (items: T[]) => void;
  registerState?: (state: State<T>) => void;
  search?: () => Promise<boolean>;
  state?: State<T>;
  items: T[];
  isLoading?: boolean;
  title?: string;
  description?: string;
};

export interface DataTableComponentSignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [
      {
        Toolbar: WithBoundArgs<typeof TableToolbarComponent, 'table'>;
        SearchInput: WithBoundArgs<
          typeof TableSearchComponent,
          'isLoading' | 'value' | 'onChange'
        >;
        Pagination: WithBoundArgs<
          typeof CarbonPagination,
          'isLoading' | 'length' | 'state' | 'onPageChanged'
        >;
        Table: WithBoundArgs<typeof TableComponent, 'isLoading'>;
        EachBodyRows: WithBoundArgs<
          typeof DataTableBody<T>,
          'table' | 'isExpandable' | 'isCheckable' | 'items'
        >;
        Column: typeof TableColumn;
        Menu: typeof TableMenuComponent;
        Header: WithBoundArgs<typeof ListHeaderComponent, 'table'>;
      },
    ];
  };
}

export default class DataTableComponent<T> extends Component<
  DataTableComponentSignature<T>
> {
  // this is set by the Header Component
  declare isExpandable: boolean;
  declare isCheckable: boolean;
  declare headers: Header[];

  @defaultArgs
  args: Args<T> = {
    onSelectionChange: () => null,
    registerState: () => null,
    search: undefined,
    state: undefined,
    items: undefined as never,
    isLoading: false,
    title: '',
    description: '',
  };

  @tracked internalState: State<T>;

  get searchFunction() {
    if (this.args.search) return this.args.search;
    const ensureString = (v: unknown) =>
      typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase();
    const f = (t: any, term: string) => {
      if (!term || term === '') return true;
      if (t.id && t.id.toLowerCase().includes(term)) return true;
      return Object.values(t.toJSON ? t.toJSON() : t)
        .filter((v: any) => v && !v.defaultAdapter)
        .some((v) => v && ensureString(v).includes(term));
    };
    return f;
  }

  constructor(...args: [never, never]) {
    super(...args);
    runTask(this, () => {
      if (!this.state.currentItemsSlice) {
        this.state.currentItemsSlice = {
          start: 0,
          end: undefined,
          itemsPerPage: 0,
          page: 0,
        };
      }
    });

    this.internalState = new State();
  }

  get state(): State<T> {
    return this.args.state || this.internalState;
  }

  get selectedItemsArray() {
    return this.state.selectedItems.toArray();
  }

  get items(): T[] {
    if (this.state.currentSearch) {
      return this.state.currentSearch.toArray();
    }
    return this.args.items;
  }

  applySearch = task({ restartable: true }, async (items, term) => {
    this.state.currentSearch = A([]);
    term = term && term.toLowerCase();
    const f = this.searchFunction;
    for (const t of items) {
      const r = await f(t, term);
      if (r) {
        this.state.currentSearch.pushObject(t);
      }
    }
  });

  get currentItems() {
    if (!this.items || !this.state.currentItemsSlice) return [];
    return this.items.slice(
      this.state.currentItemsSlice.start,
      this.state.currentItemsSlice.end,
    );
  }

  get allChecked() {
    return this.state.selectedItems.hasAll(this.currentItems);
  }

  @action
  didInsert() {
    runTask(this, () => this.args.registerState?.(this.state));
  }

  @action
  async search(term?: string) {
    this.state.currentSearchTerm = term;
    if (!term) {
      this.state.currentSearch = undefined;
      await this.applySearch.cancelAll();
      return;
    }
    return this.applySearch.perform(this.args.items || [], term);
  }

  @action
  toggleItemSelection(item: T, selected: boolean) {
    if (selected && !this.state.selectedItems.has(item)) {
      this.state.selectedItems.add(item);
    }
    if (!selected) {
      this.state.selectedItems.delete(item);
    }
    this.args.onSelectionChange?.(this.state.selectedItems.toArray());
  }

  @action
  toggleSelectAllItems(select: boolean) {
    if (select) {
      this.state.selectedItems.setTo(this.currentItems.slice());
    } else {
      this.state.selectedItems.setTo([]);
    }
    this.args.onSelectionChange?.(this.state.selectedItems.toArray());
  }

  @action
  changePage(slice: Slice) {
    this.state.currentItemsSlice = slice;
  }

  <template>
    <div
      class='cds--data-table-container {{if @isLoading "bx-skeleton"}}'
      data-table
    >
      <div class='cds--data-table-header' {{didInsert this.didInsert}}>
        <h4 class='cds--data-table-header__title'>
          {{@title}}
        </h4>
        <p class='cds--data-table-header__description'>
          {{@description}}
        </p>
      </div>

      {{yield
        (hash
          SearchInput=(component
            SearchInput
            isLoading=@isLoading
            value=@state.currentSearchTerm
            onChange=this.search
          )
          Pagination=(component
            Pagination
            isLoading=@isLoading
            length=this.items.length
            state=this.state.currentItemsSlice
            onPageChanged=this.changePage
          )
          Menu=Menu
          Table=(component Table isLoading=@isLoading)
          Column=ListColumn
          EachBodyRows=(component
            ListBody
            isExpandable=this.isExpandable
            isCheckable=this.isCheckable
            table=this
            items=this.currentItems
          )
          Header=(component ListHeader table=this)
          Toolbar=(component Toolbar table=this)
        )
      }}
    </div>
  </template>
}
