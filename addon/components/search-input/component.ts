import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { bool } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators'
import { timeout, Task } from 'ember-concurrency'
import { taskFor } from 'ember-concurrency-ts';
import { autoComputed } from 'carbon-components-ember/decorators';

type Args = {
  onChange(value: any): Task<any, any>;
}

export default class SearchComponent extends Component<Args> {
  @bool('value') hasInput;
  @tracked value = null;
  isSearching: boolean;

  @autoComputed()
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
    taskFor(this.runSearch).perform();
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
