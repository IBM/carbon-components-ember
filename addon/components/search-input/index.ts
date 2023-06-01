import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency'
import { timeout, TaskInstance } from 'ember-concurrency'
import { autoComputed } from 'carbon-components-ember/decorators';

type Args = {
  onChange(value: any): TaskInstance<any> | undefined | void;
  value: string;
  size?: 'lg'|'md'|'sm';
  isLoading?: boolean;
  light?: boolean;
}

export interface SearchComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class SearchComponent extends Component<SearchComponentSignature> {
  @tracked value = null;
  isSearching: boolean;

  get hasInput() {
    return !!this.value;
  }

  @autoComputed()
  get guid() {
    return guidFor(this);
  }

  runSearch = task({ restartable: true }, async() => {
    this.isSearching = true;
    await timeout(200);
    const task = this.args.onChange(this.value);
    try {
      return await task;
    } finally {
      this.isSearching = false;
      task && task.cancel && task.cancel();
    }
  })
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
