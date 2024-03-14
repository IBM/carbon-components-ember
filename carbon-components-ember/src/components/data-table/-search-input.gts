import { default as SearchInput } from '#∼/components/search-input.gts'
import { default as Loading } from '#∼/components/loading.gts'
import { default as styles } from './styles.scoped.scss';
import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { TaskInstance } from 'ember-concurrency';

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

  <template>
    <SearchInput
      @isLoading={{@isLoading}}
      @value={{@value}}
      @expandable={{@expandable}}
      @onChange={{this.doSearch}}
      class='{{if this.isSearching styles.is-searching}}'
    />
    <Loading
      style='position: relative; top: -41px; right: 7px'
      @inline={{true}}
      @active={{this.isSearching}}
    />
  </template>
}
