import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { cached, tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { timeout, type TaskInstance } from 'ember-concurrency';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { runTask } from 'ember-lifeline';
import { default as defaultTo } from '../helpers/default-to.ts';
import { Close, Search as SearchIcon } from '../icons.ts';
import perform from 'ember-concurrency/helpers/perform';

export type Args = {
  onChange?(value: any): TaskInstance<any> | undefined | void;
  onClear?(): void;
  labelText?: string;
  value?: string;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  expandable?: boolean;
  light?: boolean;
  disabled?: boolean;
  id?: string;
  closeButtonLabelText?: string;
  autoComplete?: string;
  type?: string;
};

export interface SearchComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class SearchComponent extends Component<SearchComponentSignature> {
  @tracked value = null;
  @tracked isActive: boolean = false;
  isSearching: boolean = false;

  get hasInput() {
    return !!this.value;
  }

  @cached
  get guid() {
    return guidFor(this);
  }

  get inputId() {
    return this.args.id ?? `search__input-${this.guid}`;
  }

  runSearch = task({ restartable: true }, async () => {
    this.isSearching = true;
    await timeout(200);
    const task = this.args.onChange?.(this.value);
    try {
      return await task;
    } finally {
      this.isSearching = false;
      await task?.cancel?.();
    }
  });

  @action
  onSearchClear() {
    this.value = null;
    this.args.onClear?.();
  }

  @action
  setValue(v: any) {
    if (v && v.target) {
      this.value = v.target.value;
      return;
    }
    this.value = v;
  }

  @action
  activate(mouseEvent: Event) {
    if (this.isActive) {
      return;
    }
    const element = mouseEvent.target as HTMLDivElement;
    this.isActive = true;
    runTask(this, () => {
      const listener = (event: MouseEvent) => {
        let target = event.target as Element | null;
        if (target?.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(event.x, event.y);
        }
        if (element.contains(target)) return;
        if (this.value) return;
        this.isActive = false;
        document.removeEventListener('mousedown', listener);
      };
      document.addEventListener('mousedown', listener);
    });
  }

  <template>
    {{this.setValue @value}}
    <div
      data-search
      {{didUpdate (perform this.runSearch) this.value}}
      role='search'
      aria-labelledby='search-input-label-{{this.guid}}'
      class='cds--search {{if @size (concat "cds--search--" @size)}}
        {{if @light "cds--search--light"}}
        {{if @isLoading "cds--skeleton"}}
        {{if @disabled "cds--search--disabled"}}
        {{if
          @expandable
          "cds--toolbar-search-container-expandable"
          "cds--toolbar-search-container-persistent"
        }}
        {{if this.isActive "cds--toolbar-search-container-active"}}'
      ...attributes
    >
      <div class='cds--search-magnifier'>
        <SearchIcon @svgClass='cds--search-magnifier-icon' />
      </div>
      <label
        id='search-input-label-{{this.guid}}'
        for={{this.inputId}}
        class='cds--label'
      >
        {{@labelText}}
      </label>
      <input
        class='cds--search-input'
        type={{defaultTo @type 'search'}}
        id={{this.inputId}}
        placeholder={{defaultTo @placeholder 'Search'}}
        autocomplete={{defaultTo @autoComplete 'off'}}
        value={{this.value}}
        disabled={{@disabled}}
        {{on 'change' this.setValue}}
        {{on 'input' this.setValue}}
        {{! template-lint-disable }}
        {{on 'mousedown' this.activate}}
      />
      {{#if this.hasInput}}
        <button
          class='cds--search-close'
          title={{defaultTo @closeButtonLabelText 'Clear search input'}}
          aria-label={{defaultTo @closeButtonLabelText 'Clear search input'}}
          type='button'
          disabled={{@disabled}}
          {{on 'click' this.onSearchClear}}
        >
          <Close @btnClass='cds--search-clear' />
        </button>
      {{/if}}
    </div>
  </template>
}
