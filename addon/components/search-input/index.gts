import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency'
import { timeout, TaskInstance } from 'ember-concurrency'
import { autoComputed } from 'carbon-components-ember/decorators';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import { fn } from '@ember/helper';
import Icon from 'carbon-components-ember/components/icon';
import { on } from '@ember/modifier';

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

  <template>
    <div
      data-search
      {{didUpdate (fn this.setValue @value) @value}}
      {{didUpdate this.onSearchChange this.value}}
      role='search'
      class='cds--search cds--search--{{if @size @size "lg"}}
        {{if @light "cds--search--light"}}
        {{if @isLoading "cds--skeleton"}}'
      ...attributes
    >
      {{#if this.hasInput}}
        <button
          class='cds--search-close'
          title='Clear search input'
          aria-label='Clear search input'
          type='button'
          {{on 'click' this.onSearchClear}}
        >
          <Icon @icon='close' @btnClass='cds--search-clear' />
        </button>
      {{/if}}
      <label
        id='search-input-label-{{this.guid}}'
        class='cds--label'
        for='search__input-{{this.guid}}'
      >
        Search
      </label>
      <input
        class='cds--search-input'
        type='text'
        id='search__input-{{this.guid}}'
        placeholder='Search'
        value={{this.value}}
        {{on 'change' this.setValue}}
        {{on 'input' this.setValue}}
      />
      <Icon @icon='search' @btnClass='cds--search-magnifier' />
    </div>
  </template>
}
