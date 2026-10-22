import SearchInput from '../search.gts';
import InlineLoading from '../inline-loading.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import type { TaskInstance } from 'ember-concurrency';
import type { SearchSignature } from '../search.gts';
import './-search-input.scss';

export interface TableToolbarSearchSignature {
  Element: SearchSignature['Element'];
  Args: {
    /**
     * Classes for the search's wrapper, as Carbon React's `className`.
     * `class` and the other attributes go on the `<input>`.
     */
    className?: string;
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

  // Filters once typing pauses, rather than on every keystroke.
  runSearch = task({ restartable: true }, async (term: string) => {
    await timeout(200);
    this.isSearching = true;
    const task = this.args.onChange(term);
    try {
      return await task;
    } finally {
      this.isSearching = false;
      await task?.cancel?.();
    }
  });

  doSearch = (event: Event & { target: HTMLInputElement }) => {
    const term = event.target.value;
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    void this.runSearch.perform(term);
  };

  <template>
    <SearchInput
      @isLoading={{@isLoading}}
      @value={{@value}}
      @expandable={{@expandable}}
      @size={{@size}}
      @labelText={{if @labelText @labelText "Filter table"}}
      @placeholder={{if @placeholder @placeholder "Filter table"}}
      @onChange={{this.doSearch}}
      @className="{{if this.isSearching 'cds--ember-table-search--searching'}}
        {{@className}}"
      ...attributes
    />
    {{#if this.isSearching}}
      <InlineLoading class="cds--ember-table-search__loading" />
    {{/if}}
  </template>
}
