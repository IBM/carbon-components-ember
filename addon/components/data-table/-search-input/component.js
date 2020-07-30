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
    const p = this.args.onChange(term);
    try {
      yield p;
      return;
    } finally {
      this.isSearching = false;
      p.cancel && p.cancel();
    }
  }

  @action
  doSearch(term) {
    if (this.lastTerm === term) return ;
    this.lastTerm = term;
    this.runSearch.perform(term);
  }
}
