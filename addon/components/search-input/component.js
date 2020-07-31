import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { bool } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { task } from 'ember-concurrency-decorators'
import { timeout } from 'ember-concurrency'

export default class SearchComponent extends Component {
  @bool('value') hasInput;
  @tracked value = null;

  @computed()
  get guid() {
    return guidFor(this);
  }

  @task({ restartable: true })
  *runSearch() {
    this.isSearching = true;
    yield timeout(200);
    const task = this.args.onChange(this.value);
    try {
      return yield task;
    } finally {
      this.isSearching = false;
      task && task.cancelAll && task.cancelAll();
    }
  }

  @action
  onSearchChange() {
    this.runSearch.perform();
  }

  @action
  onSearchClear() {
    this.value = null;
  }

  @action
  setValue(v) {
    if (v && v.target) {
      this.value = v.target.value;
      return;
    }
    this.value = v;
  }
}
