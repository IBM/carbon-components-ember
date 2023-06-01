import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency'
import { TaskInstance } from 'ember-concurrency';


type Args = {
  onChange: (value: string) => TaskInstance<any>|undefined;
  isLoading: boolean;
  value: string;
}


export default class TableSearchComponent extends Component<Args> {

  @tracked isSearching;
  lastTerm = null;

  runSearch = task({ restartable: true }, async(term) => {
    this.isSearching = true;
    const task = this.args.onChange(term);
    try {
      return await task;
    } finally {
      this.isSearching = false;
      task?.cancel?.();
    }
  });

  @action
  doSearch(term) {
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    this.runSearch.cancelAll()
    return this.runSearch.perform(term);
  }
}
