import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators'
import { Task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';


type Args = {
  onChange: (value: string) => Task<any, [ms: number]>
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
      task.cancelAll && task.cancelAll();
    }
  }

  @action
  doSearch(term) {
    if (this.lastTerm === term) return;
    this.lastTerm = term;
    taskFor(this.runSearch).perform(term);
  }
}
