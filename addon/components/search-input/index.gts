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
import { next } from '@ember/runloop';

type Args = {
  onChange(value: any): TaskInstance<any> | undefined | void;
  value: string;
  size?: 'lg'|'md'|'sm';
  isLoading?: boolean;
  expandable?: boolean;
  light?: boolean;
}

export interface SearchComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class SearchComponent extends Component<SearchComponentSignature> {
  @tracked value = null;
  @tracked isActive: boolean = false;
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

  @action
  activate(mouseEvent: Event) {
    if (this.isActive) {
      return
    }
    const element = mouseEvent.target as HTMLDivElement;
    this.isActive = true;
    next(() => {
      const listener = (event: Event) => {
        if (element.contains(event.target as HTMLDivElement)) return;
        this.isActive = false;
        (document as Document).removeEventListener('mousedown', listener);
      };
      (document as Document).addEventListener('mousedown', listener);
    });
  }

  <template>
    <div
      data-search
      {{didUpdate (fn this.setValue @value) @value}}
      {{didUpdate this.onSearchChange this.value}}
      role='search'
      aria-label='Filter table'
      class='cds--search cds--search--{{if @size @size "lg"}}
        {{if @light "cds--search--light"}}
        {{if @isLoading "cds--skeleton"}}
        {{if
          @expandable
          "cds--toolbar-search-container-expandable"
          "cds--toolbar-search-container-persistent"
        }}
        {{if this.isActive "cds--toolbar-search-container-active"}}'
      ...attributes
    >
      <div class='cds--search-magnifier'>
        <Icon @icon='search' @svgClass='cds--search-magnifier-icon' />
      </div>
      <label
        id='search-input-label-{{this.guid}}'
        for='search__input-{{this.guid}}'
        class='cds--label'
      >
        Filter table
      </label>
      <input
        class='cds--search-input'
        type='text'
        id='search__input-{{this.guid}}'
        placeholder='Filter table'
        value={{this.value}}
        {{on 'change' this.setValue}}
        {{on 'input' this.setValue}}
        {{! template-lint-disable }}
        {{on 'mousedown' this.activate}}
      />
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
    </div>
  </template>
}
