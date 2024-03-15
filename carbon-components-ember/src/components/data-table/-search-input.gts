import { default as SearchInput } from '/components/search-input.gts';
import { default as Loading } from '/components/loading.gts';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { TaskInstance } from 'ember-concurrency';
import { stylesheet } from 'astroturf';

type Args = {
  onChange: (value: string) => TaskInstance<any> | undefined;
  isLoading: boolean;
  expandable?: boolean;
  value: string;
};

export default class TableSearchComponent extends Component<Args> {
  @tracked isSearching;
  lastTerm = null;

  runSearch = task({ restartable: true }, async (term) => {
    this.isSearching = true;
    const task = this.args.onChange(term);
    try {
      return task;
    } finally {
      this.isSearching = false;
      task?.cancel?.();
    }
  });

  @action
  doSearch(term) {
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    this.runSearch.cancelAll();
    return this.runSearch.perform(term);
  }

  styles = stylesheet`
    .is-searching {
      .cds--search-magnifier {
        display: none;
      }
    }
  ` as { 'is-searching': string };

  <template>
    <SearchInput
      @isLoading={{@isLoading}}
      @value={{@value}}
      @expandable={{@expandable}}
      @onChange={{this.doSearch}}
      class='{{if this.isSearching this.styles.is-searching}}'
    />
    <Loading
      style='position: relative; top: -41px; right: 7px'
      @inline={{true}}
      @active={{this.isSearching}}
    />
  </template>
}
