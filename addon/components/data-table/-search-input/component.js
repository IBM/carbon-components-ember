import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { task } from 'ember-concurrency-decorators'


export default class TableSearchComponent extends Component {

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
    this.runSearch.perform(term);
  }
}
