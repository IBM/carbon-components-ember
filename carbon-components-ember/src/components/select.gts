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
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import { and } from 'ember-truth-helpers';
import TriggerComponent from 'ember-power-select/components/power-select-multiple/trigger';
import OptionsComponent from 'ember-power-select/components/power-select/options';
import { guidFor } from '@ember/object/internals';
import { Close } from '../icons.ts';
import type {TOC} from "@ember/component/template-only";


type Args<T extends ContentValue> = {
  options: T[];
  searchField?: string;
  placeholder?: string;
  helperText?: string;
  title?: string;
  disabled?: boolean;
  searchEnabled?: boolean;
  renderInPlace?: boolean;
  addItem?: (item: T) => void;
  removeItem?: (item: T) => void;
} & (
  | {
  selected?: T[];
  multiple: true;
  onSelect?: (item: T[]) => void;
  onOpen?: PowerSelectArgs['onOpen'];
  search?: PowerSelectArgs['search'];
  selectFocused?: PowerSelectArgs['onFocus'];
}
  | {
  selected?: T;
  multiple?: false;
  onSelect?: (item: T) => void;
  onOpen?: PowerSelectArgs['onOpen'];
  search?: PowerSelectArgs['search'];
  selectFocused?: PowerSelectArgs['onFocus'];
});


export interface SelectComponentSignature<T extends ContentValue> {
  Args: Args<T>;
  Element: HTMLElement;
  Blocks: {
    default: [option: T];
  };
}

type ExtractInterface<C> = C extends Component<infer T> ? T : unknown;
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type OptionsComponentInterface = ExtractInterface<OptionsComponent>;

const addClassToParent = (el: HTMLElement, cls: string) => {
  setTimeout(() => {
    el.parentElement?.classList.add(cls);
  });
}

const Options: TOC<OptionsComponentInterface & { Args: { guid: string } }> = <template>
  <OptionsComponent
    @options={{@options}}
    @select={{@select}}
    @groupIndex="{{@groupIndex}}"
    @listboxId="{{@listboxId}}"
    @loadingMessage="{{@loadingMessage}}"
    @optionsComponent={{@optionsComponent}}
    @groupComponent={{@groupComponent}}
    @extra={{@extra}}
    {{didInsert addClassToParent 'cds--list-box--expanded'}}
    role="listbox"
    aria-labelledby="downshift-:{{@guid}}:-label"
    ...attributes
    class='cds--list-box--expanded cds--list-box__menu'
    as |option|
  >
    {{yield option @select}}
  </OptionsComponent>
</template>;

const SelectedItem: TOC<{
  Args: {
    select: OptionsComponentInterface['Args']['select'],
    option: ArrayElement<OptionsComponentInterface['Args']['options']>
  };
  Blocks: {
    default: [string];
  }
}> =  <template>
      <div class="cds--tag cds--tag--filter cds--tag--high-contrast">
        <span class="cds--tag__label" title="1">
          {{#if (has-block)}}
            {{yield @option}}
          {{else}}
            {{@option}}
          {{/if}}
        </span>
        <div {{on 'click' (fn @select.actions.select @option)}} role="button" tabindex="-1" class="cds--tag__close-icon" aria-label="Clear all selected items"
                                                                title="Clear all selected items">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"></path>
          </svg>
        </div>
      </div>
    </template>

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
      if (this.args.selected && Array.isArray(this.args.selected)) {
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

  get guid() {
    return guidFor(this);
  }

  optionsComponent = Options;

  selectedItemComponent = SelectedItem;

  triggerComponent = class CarbonTriggerComponent extends TriggerComponent {
    get guid() {
      return guidFor(this);
    }

    removeSelected = (opt: any) => {
      const selected = [...this.args.select.selected];
      const i = selected.findIndex(opt);
      selected.splice(i, 1);
      this.args.select.actions.select(selected)
    }

      <template>
        <div
          aria-activedescendant={{if
          (and @select.isOpen)
          @ariaActiveDescendant
        }}
          {{this.openChange @select.isOpen}}
          {{on "touchstart" this.chooseOption}}
          {{on "mousedown" this.chooseOption}}
          ...attributes
        >
          <label class="cds--label" id="downshift-:{{this.guid}}:-label" for="downshift-:{{this.guid}}:-toggle-button">{{@extra.title}}</label>
          <div class="cds--multi-select cds--list-box cds--list-box--md">
            <div class="cds--list-box__field--wrapper">
              {{#each @select.selected as |opt|}}
                <div class="cds--tag cds--tag--filter cds--tag--high-contrast" style="margin: 0;">
                  <span class="cds--tag__label" title="1">{{opt}}</span>
                  <div {{on 'click' (fn this.removeSelected opt)}} role="button" tabindex="-1" class="cds--tag__close-icon" aria-label="Clear all selected items" title="Clear all selected items" >
                    <Close />
                  </div>
                </div>
              {{/each}}
              <button
                type="button"
                class="cds--list-box__field"
                aria-describedby="multiselect-helper-text-id-:r1m:"
                aria-activedescendant=""
                aria-controls="downshift-:{{this.guid}}:-menu"
                aria-expanded="false"
                aria-haspopup="listbox"
                aria-labelledby="downshift-:{{this.guid}}:-label"
                id="downshift-:{{this.guid}}:-toggle-button"
                role="combobox"
                tabindex="0"
              >
                {{#unless @select.selected}}
                  <span id="multiselect-field-label-id-:{{this.guid}}:" class="cds--list-box__label">{{@placeholder}}</span>
                {{/unless}}
                <div class="cds--list-box__menu-icon">
                  <svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" name="chevron--down" aria-label="Open menu" width="16" height="16" viewBox="0 0 16 16" role="img" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path><title>Open menu</title>
                  </svg>
                </div>
              </button>
            </div>
            <ul id="downshift-:r1o:-menu" class="cds--list-box__menu" role="listbox" aria-labelledby="downshift-:r1o:-label"></ul>
          </div>
          <div id="multiselect-helper-text-id-:{{this.guid}}:" class="cds--form__helper-text">{{@extra.helperText}}</div></div>
      </template>
  };

  <template>
    {{#if @multiple}}
      <PowerSelectMultiple
        ...attributes
        @triggerComponent={{component this.triggerComponent extra=(hash helperText=@helperText title=@title)}}
        @optionsComponent={{this.optionsComponent}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @renderInPlace={{defaultTo @renderInPlace false}}
        @disabled={{@disabled}}
        @eventType='click'
        @searchEnabled={{defaultTo @searchEnabled true}}
        @search={{@search}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @searchField={{@searchField}}
        @matcher={{this.searchMatcher}}
        @selected={{@selected}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        @onKeydown={{this.handleKeydown}}
        @closeOnSelect={{false}}
        as |option select|
      >
        <div class='cds--list-box__menu-item__option' {{didInsert this.addClassToParent 'cds--list-box__menu-item'}}>
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
        </div>
      </PowerSelectMultiple>
    {{else}}
      <PowerSelect
        ...attributes
        @renderInPlace={{defaultTo @renderInPlace false}}
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


