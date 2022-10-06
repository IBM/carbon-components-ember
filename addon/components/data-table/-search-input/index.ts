import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators'
import { TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';


type Args = {
  onChange: (value: string) => TaskInstance<any>|undefined;
  isLoading: boolean;
  value: string;
}


export default class TableSearchComponent extends Component<Args> {

  @tracked isSearching;
  lastTerm = null;

  @task({ restartable: true })
  *runSearch(term) {
    this.isSearching = true;
    const task = this.args.onChange(term);
    try {
      return yield task;
    } finally {
      this.isSearching = false;
      task?.cancel?.();
    }
  }

  @action
  doSearch(term) {
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    taskFor(this.runSearch)?.cancelAll()
    return taskFor(this.runSearch).perform(term);
  }
}
