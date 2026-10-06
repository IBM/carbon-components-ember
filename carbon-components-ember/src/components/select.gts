import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { defaultArgs } from '../utils/decorators.ts';
import PowerSelect from 'ember-power-select/components/power-select';
import type { PowerSelectArgs } from 'ember-power-select/components/power-select';
import type { ContentValue } from '@glint/template';
import { modifier } from 'ember-modifier';
import isSelected from 'ember-power-select/helpers/ember-power-select-is-equal';
import TriggerComponent from 'ember-power-select/components/power-select/trigger';
import OptionsComponent from 'ember-power-select/components/power-select/options';
import type { PowerSelectOptionsSignature } from 'ember-power-select/components/power-select/options';
import type {
  Option,
  PowerSelectSelectedItemSignature,
} from 'ember-power-select/types';
import { guidFor } from '@ember/object/internals';
import { Close } from '../icons.ts';
import type { TOC } from '@ember/component/template-only';

export type Args<T extends ContentValue> = {
  options: T[];
  searchField?: string;
  placeholder?: string;
  loadingMessage?: string;
  searchPlaceholder?: string;
  /**
   * id of an element that labels the select, for a visible label rendered
   * outside it (e.g. Pagination's "Items per page:"). Otherwise `@title` is
   * the label, and the placeholder names it as a last resort.
   */
  ariaLabelledBy?: string;
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
      onOpen?: PowerSelectArgs<T, true>['onOpen'];
      search?: PowerSelectArgs<T, true>['search'];
      selectFocused?: PowerSelectArgs<T, true>['onFocus'];
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
  Element: HTMLElement;
  Blocks: {
    default: [option: Option<T>];
  };
}

/** What `Select` passes to its custom power-select components via `@extra`. */
interface SelectExtra {
  title?: string;
  helperText?: string;
  /** id of the visible label, which names the trigger */
  labelId?: string;
  /** id of whatever labels the select (`@ariaLabelledBy` or the title) */
  labelledBy?: string;
  /** id of the helper text, which describes the trigger */
  helperTextId?: string;
  /** names the select and its options when nothing labels them */
  ariaLabel?: string;
  inline?: boolean;
  isSingleSelect?: boolean;
  showNumber?: boolean;
  searchPlaceholder?: string;
}

// The internal components below serve both the single and multiple modes,
// and every option type.
type AnySelectMode = any;
type AnyOption = any;

const addClassToParent = (el: HTMLElement, cls: string, ifTrue: boolean) => {
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
};

const addMenuItemClass = modifier((element: HTMLElement) => {
  addClassToParent(element, 'cds--list-box__menu-item', true);
});

const toggleHighlightedClass = modifier(
  (element: HTMLElement, [highlighted]: [boolean]) => {
    addClassToParent(
      element,
      'cds--list-box__menu-item--highlighted',
      highlighted,
    );
  },
);

// power-select types `@extra` per invocation; Select always passes a
// SelectExtra.
const selectExtra = (extra: unknown) => (extra ?? {}) as SelectExtra;

const Options: TOC<
  PowerSelectOptionsSignature<AnyOption, unknown, AnySelectMode>
> = <template>
  {{#let (selectExtra @extra) as |extra|}}
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
      aria-labelledby={{extra.labelledBy}}
      aria-label={{unless extra.labelledBy extra.ariaLabel}}
      ...attributes
      class="cds--list-box--expanded cds--list-box__menu"
      as |option|
    >
      {{yield option @select}}
    </OptionsComponent>
  {{/let}}
</template>;

const SelectedItem: TOC<
  PowerSelectSelectedItemSignature<AnyOption, unknown, AnySelectMode>
> = <template>
  <div class="cds--tag cds--tag--filter cds--tag--high-contrast">
    <span class="cds--tag__label" title="1">{{@selected}}</span>
    {{! template-lint-disable require-presentational-children }}
    <div
      {{on "click" (fn @select.actions.select @selected)}}
      role="button"
      tabindex="-1"
      class="cds--tag__close-icon"
      aria-label="Clear all selected items"
      title="Clear all selected items"
    >
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
        width="16"
        height="16"
        viewBox="0 0 32 32"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"
        ></path>
      </svg>
    </div>
  </div>
</template>;

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

  get selectedOption() {
    return this.args.selected as Option<T> | undefined;
  }

  get selectedOptions() {
    return this.args.selected as Option<T>[] | undefined;
  }

  @action
  onChange(selection: Option<T> | Option<T>[] | undefined) {
    const choice = selection as T | T[] | undefined;
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

  get labelId() {
    return `${this.guid}-label`;
  }

  get helperTextId() {
    return `${this.guid}-helper-text`;
  }

  get labelledBy() {
    return (
      this.args.ariaLabelledBy ?? (this.args.title ? this.labelId : undefined)
    );
  }

  private optionsComponent = Options;

  selectedItemComponent = SelectedItem;

  private triggerComponent = class CarbonTriggerComponent extends TriggerComponent<
    AnyOption,
    unknown,
    AnySelectMode
  > {
    get extra(): SelectExtra {
      return this.args.extra ?? {};
    }

    get guid() {
      return guidFor(this);
    }

    removeSelected = (opt: any) => {
      const selected = [...this.args.select.selected];
      const i = selected.indexOf(opt);
      selected.splice(i, 1);
      this.args.select.actions.select(selected);
    };

    removeAll = () => {
      this.args.select.actions.select([]);
    };

    doSearch = (event: Event) => {
      this.args.select.actions.search((event.target as HTMLInputElement).value);
    };

    focus = modifier((element: HTMLElement) => {
      element.focus();
    });

    <template>
      {{#if this.extra.title}}
        {{! It names power-select's trigger (the real combobox) through
          aria-labelledby; the trigger isn't a labelable element for "for". }}
        <label
          class="cds--label {{if @select.disabled 'cds--label--disabled'}}"
          id={{this.extra.labelId}}
        >{{this.extra.title}}</label>
      {{/if}}
      {{! template-lint-disable no-pointer-down-event-binding }}
      {{! template-lint-disable no-unsupported-role-attributes }}
      {{! power-select's own trigger handlers (removing selected items on
        mousedown), as in its stock trigger; this sits inside power-select's
        focusable trigger, which is the interactive element. }}
      {{! template-lint-disable no-invalid-interactive }}
      <div
        class="cds--multi-select cds--combo-box cds--list-box
          {{if @select.disabled 'cds--list-box--disabled'}}
          {{if @searchEnabled 'cds--multi-select--filterable'}}
          {{if
            @select.isOpen
            'cds--multi-select--open cds--multi-select--filterable--input-focused cds--list-box--expanded'
          }}"
        style={{if this.extra.inline "background: transparent; border: none;"}}
        {{this.openChange @select.isOpen}}
        {{on "touchstart" this.chooseOption}}
        {{on "mousedown" this.chooseOption}}
        {{! @glint-expect-error: power-select types its trigger as a <ul>; this one renders a <div> }}
        ...attributes
      >
        <div class="cds--list-box__field--wrapper">
          {{#if
            (and
              this.extra.isSingleSelect
              (not (and @select.isOpen @searchEnabled))
            )
          }}
            <div
              class="cds--list-box__label"
              style="margin-left: 15px; margin-right: 3px; width: -webkit-fill-available;"
            >{{#if
                @select.selected
              }}{{@select.selected}}{{else}}{{@placeholder}}{{/if}}</div>
          {{/if}}
          {{#if (and this.extra.showNumber @select.selected.length)}}
            <div
              class="cds--tag cds--tag--filter cds--tag--high-contrast"
              style="margin: 0;"
            >
              <span
                class="cds--tag__label"
                title="{{@select.selected.length}}"
              >{{@select.selected.length}}</span>
              {{! template-lint-disable require-presentational-children }}
              <div
                {{on "click" this.removeAll}}
                role="button"
                tabindex="-1"
                class="cds--tag__close-icon"
                aria-label="Clear all selected items"
                title="Clear all selected items"
              >
                <Close />
              </div>
            </div>
          {{else}}
            {{#each @select.selected as |opt|}}
              <div
                class="cds--tag cds--tag--filter cds--tag--high-contrast"
                style="margin: 0;"
              >
                <span class="cds--tag__label" title="1">{{opt}}</span>
                {{! template-lint-disable require-presentational-children }}
                <div
                  {{on "click" (fn this.removeSelected opt)}}
                  role="button"
                  tabindex="-1"
                  class="cds--tag__close-icon"
                  aria-label="Clear all selected items"
                  title="Clear all selected items"
                >
                  <Close />
                </div>
              </div>
            {{/each}}
          {{/if}}
          {{#if (and @searchEnabled @select.isOpen)}}
            {{! template-lint-disable no-redundant-role }}
            <input
              placeholder="{{this.extra.searchPlaceholder}}"
              class="cds--text-input cds--text-input--empty"
              aria-activedescendant={{@ariaActiveDescendant}}
              aria-autocomplete="list"
              aria-expanded="true"
              autocomplete="off"
              id="carbon-multiselect-{{this.guid}}-input"
              role="combobox"
              aria-describedby={{if
                this.extra.helperText
                this.extra.helperTextId
              }}
              aria-haspopup="listbox"
              value=""
              aria-controls="carbon-multiselect-{{this.guid}}__menu"
              {{on "input" this.doSearch}}
              {{this.focus}}
            />
          {{/if}}

          {{! Styling only: power-select's own trigger is the focusable
            combobox, so this must not be a second one. }}
          <div
            style={{if
              this.extra.isSingleSelect
              "overflow: visible; width: 50px;"
              "overflow: visible; "
            }}
            class="cds--list-box__field"
            aria-hidden="true"
          >
            {{! A single select shows its placeholder where the selection goes
              (above); this narrow field only holds the chevron. }}
            {{#unless (or @select.selected this.extra.isSingleSelect)}}
              <span
                id="multiselect-field-label-id-:{{this.guid}}:"
                class="cds--list-box__label"
              >{{@placeholder}}</span>
            {{/unless}}
            <div class="cds--list-box__menu-icon">
              <svg
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                fill="currentColor"
                {{! @glint-expect-error: name is not a standard svg attribute, but matches the markup @carbon/react renders }}
                name="chevron--down"
                aria-label="Open menu"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path><title
                >Open menu</title>
              </svg>
            </div>
          </div>
        </div>
        {{#if this.extra.helperText}}
          <div id={{this.extra.helperTextId}} class="cds--form__helper-text">
            {{this.extra.helperText}}
          </div>
        {{/if}}
      </div>
    </template>
  };

  <template>
    {{#if @multiple}}
      <PowerSelect
        @multiple={{true}}
        {{! @glint-expect-error: power-select types its element as Element; it renders an HTMLElement }}
        ...attributes
        class="cds--select cds--select-md
          {{if @inline 'cds--select--inline'}}
          {{if @disabled 'cds--select--disabled'}}"
        style="outline: none"
        @extra={{hash
          helperText=@helperText
          helperTextId=this.helperTextId
          title=@title
          labelId=this.labelId
          labelledBy=this.labelledBy
          ariaLabel=@placeholder
          showNumber=@showNumber
          searchPlaceholder=@searchPlaceholder
          inline=@inline
        }}
        @ariaLabelledBy={{this.labelledBy}}
        @ariaLabel={{unless this.labelledBy @placeholder}}
        @ariaDescribedBy={{if @helperText this.helperTextId}}
        @triggerComponent={{this.triggerComponent}}
        @optionsComponent={{this.optionsComponent}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @renderInPlace={{or @renderInPlace false}}
        @disabled={{@disabled}}
        @eventType="click"
        @searchEnabled={{or @searchEnabled false}}
        @search={{@search}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @searchField={{@searchField}}
        @searchPlaceholder={{@searchPlaceholder}}
        @loadingMessage={{@loadingMessage}}
        @matcher={{this.searchMatcher}}
        @selected={{this.selectedOptions}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        @onKeydown={{this.handleKeydown}}
        @closeOnSelect={{false}}
        as |option select|
      >
        <div
          class="cds--list-box__menu-item__option"
          {{toggleHighlightedClass (eq option select.highlighted)}}
          {{addMenuItemClass}}
        >
          {{! A drawn checkbox, as in Carbon React's MultiSelect: the option
            itself carries the selection (aria-selected), so a real checkbox
            here would be a control nested in a control. }}
          <div class="cds--checkbox-wrapper">
            <span
              class="cds--checkbox-label"
              data-contained-checkbox-state={{if
                (isSelected option select.selected)
                "true"
                "false"
              }}
            >
              <span class="cds--checkbox-label-text">
                {{#if (has-block)}}
                  {{yield option}}
                {{else}}
                  {{option}}
                {{/if}}
              </span>
            </span>
          </div>
        </div>
      </PowerSelect>
    {{else}}
      <PowerSelect
        {{! @glint-expect-error: power-select types its element as Element; it renders an HTMLElement }}
        ...attributes
        class="cds--select cds--select-md
          {{if @inline 'cds--select--inline'}}
          {{if @disabled 'cds--select--disabled'}}"
        style="outline: none"
        @extra={{hash
          isSingleSelect=true
          helperText=@helperText
          helperTextId=this.helperTextId
          title=@title
          labelId=this.labelId
          labelledBy=this.labelledBy
          ariaLabel=@placeholder
          searchPlaceholder=@searchPlaceholder
          inline=@inline
        }}
        @ariaLabelledBy={{this.labelledBy}}
        @ariaLabel={{unless this.labelledBy @placeholder}}
        @ariaDescribedBy={{if @helperText this.helperTextId}}
        @renderInPlace={{or @renderInPlace false}}
        {{! @glint-expect-error: null is allowed }}
        @beforeOptionsComponent={{null}}
        @triggerComponent={{this.triggerComponent}}
        @optionsComponent={{this.optionsComponent}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @disabled={{@disabled}}
        @eventType="click"
        @search={{@search}}
        @searchEnabled={{or @searchEnabled false}}
        @searchPlaceholder={{@searchPlaceholder}}
        @loadingMessage={{@loadingMessage}}
        @options={{@options}}
        @onFocus={{this.selectFocused}}
        @onOpen={{@onOpen}}
        @searchField={{@searchField}}
        @matcher={{this.searchMatcher}}
        @selected={{this.selectedOption}}
        @placeholder={{@placeholder}}
        @onChange={{this.onChange}}
        as |option select|
      >
        <div
          class="cds--list-box__menu-item__option"
          {{toggleHighlightedClass (eq option select.highlighted)}}
          {{addMenuItemClass}}
        >
          {{#if (isSelected option select.selected)}}
            <span
              style="font-weight: bold; position: absolute; margin-left: -14px;"
            >&check;</span>
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
