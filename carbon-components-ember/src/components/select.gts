import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { defaultArgs } from '../utils/decorators.ts';
import PowerSelect, {
  type PowerSelectArgs,
} from 'ember-power-select/components/power-select';
import type { ContentValue } from '@glint/template';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import defaultTo from '../helpers/default-to.ts';
import Checkbox from '../components/checkbox.gts';
import isSelected from 'ember-power-select/helpers/ember-power-select-is-equal';
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import { and, eq, not } from 'ember-truth-helpers';
import TriggerComponent from 'ember-power-select/components/power-select-multiple/trigger';
import OptionsComponent from 'ember-power-select/components/power-select/options';
import { guidFor } from '@ember/object/internals';
import { Close } from '../icons.ts';
import type { TOC } from "@ember/component/template-only";


type Args<T extends ContentValue> = {
  options: T[];
  searchField?: string;
  placeholder?: string;
  loadingMessage?: string;
  searchPlaceholder?: string;
  helperText?: string;
  title?: string;
  disabled?: boolean;
  inline?: boolean;
  showNumber?: boolean;
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

const addClassToParent = (el: HTMLElement, args: [string, boolean]) => {
  const [cls, ifTrue] = args;
  if (ifTrue !== false) {
    setTimeout(() => {
      el.parentElement?.classList.add(cls);
    });
  }
  if (ifTrue === false) {
    setTimeout(() => {
      el.parentElement?.classList.remove(cls);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
      {{! template-lint-disable require-presentational-children }}
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

  private optionsComponent = Options;

  selectedItemComponent = SelectedItem;

  private triggerComponent = class CarbonTriggerComponent extends TriggerComponent {
    get guid() {
      return guidFor(this);
    }

    removeSelected = (opt: any) => {
      const selected = [...this.args.select.selected];
      const i = selected.indexOf(opt);
      selected.splice(i, 1);
      this.args.select.actions.select(selected)
    }

    removeAll = () => {
      this.args.select.actions.select([]);
    }

    doSearch = (event: Event) => {
      this.args.select.actions.search((event.target as HTMLInputElement).value);
    }

    focus = (element: HTMLElement) => {
      element.focus();
    }

      <template>
          {{#if @extra.title}}
            <label class="cds--label {{if @select.disabled 'cds--label--disabled'}}" id="downshift-:{{this.guid}}:-label" for="downshift-:{{this.guid}}:-toggle-button">{{@extra.title}}</label>
          {{/if}}
          {{! template-lint-disable no-pointer-down-event-binding }}
          {{! template-lint-disable no-unsupported-role-attributes }}
          <div tabindex="1" class="cds--multi-select cds--combo-box cds--list-box
                    {{if @select.disabled 'cds--list-box--disabled'}}
                    {{if @searchEnabled 'cds--multi-select--filterable'}}
                    {{if @select.isOpen 'cds--multi-select--open cds--multi-select--filterable--input-focused cds--list-box--expanded'}}"
               style={{if @extra.inline 'background: transparent; border: none;'}}
               aria-activedescendant={{if
            (and @select.isOpen)
            @ariaActiveDescendant
          }}
            {{this.openChange @select.isOpen}}
            {{on "touchstart" this.chooseOption}}
            {{on "mousedown" this.chooseOption}}
               ...attributes
          >
            <div class="cds--list-box__field--wrapper">
              {{#if  (and @extra.isSingleSelect (not (and @select.isOpen @searchEnabled)))}}
                <div class="cds--list-box__label" style="margin-left: 15px; margin-right: 3px; width: -webkit-fill-available;">{{@select.selected}}</div>
              {{/if}}
              {{#if (and @extra.showNumber @select.selected.length)}}
                <div class="cds--tag cds--tag--filter cds--tag--high-contrast" style="margin: 0;">
                  <span class="cds--tag__label" title="{{@select.selected.length}}">{{@select.selected.length}}</span>
                  {{! template-lint-disable require-presentational-children }}
                  <div {{on 'click' this.removeAll}} role="button" tabindex="-1" class="cds--tag__close-icon" aria-label="Clear all selected items" title="Clear all selected items" >
                    <Close />
                  </div>
                </div>
              {{else}}
                {{#each @select.selected as |opt|}}
                  <div class="cds--tag cds--tag--filter cds--tag--high-contrast" style="margin: 0;">
                    <span class="cds--tag__label" title="1">{{opt}}</span>
                    {{! template-lint-disable require-presentational-children }}
                    <div {{on 'click' (fn this.removeSelected opt)}} role="button" tabindex="-1" class="cds--tag__close-icon" aria-label="Clear all selected items" title="Clear all selected items" >
                      <Close />
                    </div>
                  </div>
                {{/each}}
              {{/if}}
              {{#if (and @searchEnabled @select.isOpen)}}
                {{! template-lint-disable no-redundant-role }}
                <input
                  placeholder="{{@extra.searchPlaceholder}}"
                  class="cds--text-input cds--text-input--empty"
                  aria-activedescendant=""
                  aria-autocomplete="list"
                  aria-expanded="true"
                  autocomplete="off"
                  id="carbon-multiselect-{{this.guid}}-input"
                  role="combobox"
                  aria-describedby="filterablemultiselect-helper-text-id-:re8:"
                  aria-haspopup="listbox"
                  value=""
                  aria-controls="carbon-multiselect-{{this.guid}}__menu"
                  {{on 'input' this.doSearch}}
                  {{didInsert this.focus}}
                >
              {{/if}}

              <button
                style={{if @extra.isSingleSelect 'overflow: visible; width: 50px;' 'overflow: visible; '}}
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
          <div id="multiselect-helper-text-id-:{{this.guid}}:" class="cds--form__helper-text">{{@extra.helperText}}</div>
        </div>
      </template>
  };

  <template>
    {{#if @multiple}}
      <PowerSelectMultiple
        ...attributes
        class="cds--select cds--select-md {{if @inline 'cds--select--inline'}} {{if @disabled 'cds--select--disabled'}}"
        style="outline: none"
        @extra={{hash helperText=@helperText title=@title showNumber=@showNumber searchPlaceholder=@searchPlaceholder inline=@inline}}
        @triggerComponent={{this.triggerComponent}}
        @optionsComponent={{this.optionsComponent}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @renderInPlace={{defaultTo @renderInPlace false}}
        @disabled={{@disabled}}
        @eventType='click'
        @searchEnabled={{defaultTo @searchEnabled false}}
        @search={{@search}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @searchField={{@searchField}}
        @searchPlaceholder={{@searchPlaceholder}}
        @loadingMessage={{@loadingMessage}}
        @matcher={{this.searchMatcher}}
        @selected={{@selected}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        @onKeydown={{this.handleKeydown}}
        @closeOnSelect={{false}}
        as |option select|
      >
        <div class='cds--list-box__menu-item__option' {{didUpdate addClassToParent  'cds--list-box__menu-item--highlighted' (eq option select.highlighted)}} {{didInsert addClassToParent 'cds--list-box__menu-item'}}>
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
        class="cds--select cds--select-md {{if @inline 'cds--select--inline'}} {{if @disabled 'cds--select--disabled'}}"
        style="outline: none"
        @extra={{hash isSingleSelect=true searchPlaceholder=@searchPlaceholder inline=@inline}}
        @renderInPlace={{defaultTo @renderInPlace false}}
        {{! @glint-expect-error: null is allowed }}
        @beforeOptionsComponent={{null}}
        @triggerComponent={{this.triggerComponent}}
        @optionsComponent={{this.optionsComponent}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @disabled={{@disabled}}
        @eventType='click'
        @search={{@search}}
        @searchEnabled={{defaultTo @searchEnabled false}}
        @searchPlaceholder={{@searchPlaceholder}}
        @loadingMessage={{@loadingMessage}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @onOpen={{@onOpen}}
        @searchField={{@searchField}}
        @matcher={{this.searchMatcher}}
        @selected={{@selected}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        as |option select|
      >
        <div class='cds--list-box__menu-item__option' {{didUpdate addClassToParent  'cds--list-box__menu-item--highlighted' (eq option select.highlighted)}} {{didInsert addClassToParent 'cds--list-box__menu-item'}}>
          {{#if (isSelected option select.selected)}}
            <span style="font-weight: bold; position: absolute; margin-left: -14px;">&check;</span>
          {{/if}}
        {{#if (has-block)}}
          {{yield option}}
        {{else}}
          {{option}}
        {{/if}}
        </div>
      </PowerSelect>
    {{/if}}
  </template>
}
