import SearchInput from '../search.gts';
import InlineLoading from '../inline-loading.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import type { TaskInstance } from 'ember-concurrency';
import { stylesheet } from 'astroturf';
import type { SearchSignature } from '../search.gts';

export interface TableToolbarSearchSignature {
  Element: SearchSignature['Element'];
  Args: {
    onChange: (value: string) => TaskInstance<unknown> | undefined;
    isLoading: boolean;
    expandable?: boolean;
    value: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * Names the search (and its `role="search"` landmark). Defaults to
     * "Filter table", as Carbon React; give each table on a page its own.
     */
    labelText?: string;
    /** Defaults to "Filter table", as Carbon React. */
    placeholder?: string;
  };
}

export default class TableToolbarSearch extends Component<TableToolbarSearchSignature> {
  @tracked isSearching: boolean = false;
  lastTerm?: string = undefined;

  runSearch = task({ restartable: true }, async (term: string) => {
    this.isSearching = true;
    const task = this.args.onChange(term);
    try {
      return await task;
    } finally {
      this.isSearching = false;
      await task?.cancel?.();
    }
  });

  doSearch = (term: string) => {
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    void this.runSearch.cancelAll();
    return this.runSearch.perform(term);
  };

  styles = stylesheet`
    .is-searching {
      .cds--search-magnifier {
        display: none;
      }
    }

    .loading {
      position: relative;
      top: -41px;
      right: 7px;
    }
  ` as { 'is-searching': string; loading: string };

  <template>
    <SearchInput
      @isLoading={{@isLoading}}
      @value={{@value}}
      @expandable={{@expandable}}
      @size={{@size}}
      @labelText={{if @labelText @labelText "Filter table"}}
      @placeholder={{if @placeholder @placeholder "Filter table"}}
      @onChange={{this.doSearch}}
      class="{{if this.isSearching this.styles.is-searching}}"
      ...attributes
    />
    {{#if this.isSearching}}
      <InlineLoading class={{this.styles.loading}} />
    {{/if}}
  </template>
}
