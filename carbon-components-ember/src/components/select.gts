/// <reference types="@gavant/glint-template-types/types/ember-power-select/components/power-select.d.ts" />
/// <reference types="@gavant/glint-template-types/types/ember-power-select/components/power-select-multiple.d.ts" />

import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { defaultArgs } from '../utils/decorators.ts';
import PowerSelect, {
  type PowerSelectArgs,
} from 'ember-power-select/components/power-select';
import { type ContentValue } from '@glint/template';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import defaultTo from '../helpers/default-to.ts';
import Checkbox from '../components/checkbox.gts';
import isSelected from 'ember-power-select/helpers/ember-power-select-is-equal';



type Args<T extends ContentValue> = {
  options: T[];
  searchField?: string;
  placeholder?: string;
  disabled?: boolean;
  searchEnabled?: boolean;
  addItem?: (item: T) => void;
  removeItem?: (item: T) => void;
} & (
  | {
      selected?: T[];
      multiple: true;
      onSelect?: (item: T[]) => void;
      onOpen?: PowerSelectArgs<T>['onOpen'];
      search?: PowerSelectArgs<T>['search'];
      selectFocused?: PowerSelectArgs<T>['onFocus'];
    }
  | {
      selected?: T;
      multiple?: false;
      onSelect?: (item: T) => void;
      onOpen?: PowerSelectArgs<T>['onOpen'];
      search?: PowerSelectArgs<T>['search'];
      selectFocused?: PowerSelectArgs<T>['onFocus'];
    }
);

export interface SelectComponentSignature<T extends ContentValue> {
  Args: Args<T>;
  Element: HTMLDivElement;
  Blocks: {
    default: [option: T];
  };
}

export default class SelectComponent<T extends ContentValue> extends Component<
  SelectComponentSignature<T>
> {
  args: Args<T> = defaultArgs(this, {
    options: [] as T[],
    multiple: false,
    disabled: false,
    onSelect: () => null,
    addItem: () => null,
    removeItem: () => null,
  });

  searchMatcher(item: any, term: string) {
    if (!term || term === '') return 1;
    const pass = Object.values(item.toJSON ? item.toJSON() : item)
      .filter((v: any) => v && !v.defaultAdapter)
      .some((v) =>
        typeof v === 'string'
          ? v.includes(term)
          : JSON.stringify(v).includes(term),
      );
    if (pass) return 1;
    return -1;
  }

  @action
  indexOfOption(opt: T) {
    return this.args.options.indexOf(opt);
  }

  @action
  onChange(choice: T | T[]) {
    if (choice && this.args.multiple === true && Array.isArray(choice)) {
      choice.forEach((item) => {
        if (
          !this.args.selected ||
          !(this.args.selected as T[]).includes(item)
        ) {
          if (this.args.addItem) this.args.addItem(item);
        }
      });
      if (this.args.selected) {
        this.args.selected.forEach((item) => {
          if (!choice.includes(item)) {
            if (this.args.removeItem) this.args.removeItem(item);
          }
        });
      }
    }
    if (this.args.onSelect) this.args.onSelect(choice as any);
  }

  @action
  selectFocused(select: any, event: any) {
    return this.args.selectFocused && this.args.selectFocused?.(select, event);
  }

  @action
  handleKeydown(select: any, event: any) {
    const selected = this.args.selected || ([] as T[]);

    let backspaceHandled = false;

    // Delete the entire last tag if backspacing into the tags area.
    if (event.keyCode === 8 && isBlank(event.target.value)) {
      // BACKSPACE === 8
      if (Array.isArray(selected)) {
        if (this.args.removeItem) this.args.removeItem(selected.slice(-1)[0]!);
      }
      event.preventDefault();
      backspaceHandled = true;
      return false;
    }

    if (event.keyCode === 13) {
      // enter === 8
      set(select, 'searchText', '');
      backspaceHandled = true;
    }

    if (backspaceHandled) {
      event.preventDefault();
    }
    return undefined;
  }

  @action
  didInsert(element: HTMLElement) {
    element
      .getElementsByClassName('ember-power-select-status-icon')
      .item(0)!.innerHTML = `
        <svg class="cds--dropdown__arrow" width="10" height="6" viewBox="0 0 10 6">
          <path d="M5 6L0 1 0.7 0.3 5 4.6 9.3 0.3 10 1z"></path>
        </svg>`;
  }

  <template>
    {{#if @multiple}}
      <PowerSelectMultiple
        {{didInsert this.didInsert}}
        ...attributes
        @renderInPlace={{true}}
        @disabled={{@disabled}}
        @eventType='click'
        @searchEnabled={{defaultTo @searchEnabled true}}
        @search={{@search}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @onOpen={{@onOpen}}
        @searchField={{@searchField}}
        @matcher={{this.searchMatcher}}
        @selected={{@selected}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        @onKeydown={{this.handleKeydown}}
        @closeOnSelect={{false}}
        as |option select|
      >
        <Checkbox
          @readonly={{true}}
          @checked={{isSelected option select.selected}}
        >
          {{#if (has-block)}}
            {{yield option}}
          {{else}}
            {{option}}
          {{/if}}
        </Checkbox>
      </PowerSelectMultiple>
    {{else}}
      <PowerSelect
        {{didInsert this.didInsert}}
        ...attributes
        @renderInPlace={{true}}
        @disabled={{@disabled}}
        @eventType='click'
        @search={{@search}}
        @searchEnabled={{defaultTo @searchEnabled true}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @onOpen={{@onOpen}}
        @searchField={{@searchField}}
        @matcher={{this.searchMatcher}}
        @selected={{@selected}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        as |option|
      >
        {{#if (has-block)}}
          {{yield option}}
        {{else}}
          {{option}}
        {{/if}}
      </PowerSelect>
    {{/if}}
  </template>
}
