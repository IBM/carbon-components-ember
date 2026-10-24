/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import type Owner from '@ember/owner';
import WarningFilled from './icons/warning-filled.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import AILabel from './ai-label.gts';
import ListBox from './-private/list-box/list-box.gts';
import type { ListBoxSize } from './-private/list-box/list-box.gts';
import ListBoxCheckbox from './-private/list-box/list-box-checkbox.gts';
import ListBoxMenu from './-private/list-box/list-box-menu.gts';
import ListBoxMenuItem from './-private/list-box/list-box-menu-item.gts';
import ListBoxSelection from './-private/list-box/list-box-selection.gts';
import ListBoxTrigger from './-private/list-box/list-box-trigger.gts';
import {
  defaultCompareItems,
  defaultItemToString,
  defaultSortItems,
  enabledIndex,
  isEqual,
  isItemDisabled,
  isSelectAllItem,
  nextEnabledIndex,
} from './-private/list-box/items.ts';
import {
  positionMenu,
  scrollToHighlighted,
} from './-private/list-box/menu-modifiers.ts';
import { afterRender } from '../utils/after-render.ts';
import type {
  CompareItems,
  SortItemsOptions,
} from './-private/list-box/items.ts';
import type { WithBoundArgs } from '@glint/template';

export interface FilterableMultiSelectChange<T> {
  /** The selected items, without a select-all option. */
  selectedItems: T[];
}

export interface FilterableMultiSelectSignature<T> {
  Element: HTMLDivElement;
  Args: {
    /**
     * The id of the field. The label, input, menu and items derive theirs
     * from it. Auto-generated when omitted.
     */
    id?: string;
    /**
     * The items to choose from. They can be any value: `@itemToString` turns
     * one into its text. An item with `disabled: true` can't be chosen, and
     * one with `isSelectAll: true` checks or clears every item the text typed
     * lists.
     */
    items: T[];
    /**
     * Turns an item into the text shown for it, and filtered on. Defaults to
     * a string or number item itself, or an object's string `label`.
     */
    itemToString?: (item: T) => string;
    /**
     * Which items to list for the text typed. Defaults to those whose text
     * contains it, ignoring case. To filter elsewhere (on the server, say),
     * return `items` as they are and change them from
     * `@onInputValueChange`.
     */
    filterItems?: (
      items: readonly T[],
      options: { inputValue: string; itemToString: (item: T) => string },
    ) => T[];
    /** Called with the text typed whenever it changes. */
    onInputValueChange?: (changes: { inputValue: string }) => void;
    /** Text shown in the input while it's empty. */
    placeholder?: string;
    /** The field's label, above it. */
    titleText?: string;
    /** Visually hide `@titleText`, keeping it for assistive technology. */
    hideLabel?: boolean;
    /** Help shown below the field, unless it's invalid or warning. */
    helperText?: string;
    /**
     * The selected items, for full control of the selection: pair it with
     * `@onChange`. Wins over internal state whenever it's defined.
     */
    selectedItems?: T[];
    /**
     * The items selected at first, for the uncontrolled case. Later changes
     * are ignored.
     */
    initialSelectedItems?: T[];
    /** Called with the new selection whenever it changes. */
    onChange?: (data: FilterableMultiSelectChange<T>) => void;
    /** Called with `true` when the menu opens and `false` when it closes. */
    onMenuChange?: (open: boolean) => void;
    /**
     * Whether the menu is open. It seeds the menu's state, and opens or
     * closes the menu whenever it changes.
     */
    open?: boolean;
    /**
     * Where chosen items go in the list: `top` moves them to the top at
     * once, `top-after-reopen` (the default) the next time the menu opens,
     * and `fixed` leaves them in place.
     */
    selectionFeedback?: 'fixed' | 'top' | 'top-after-reopen';
    /**
     * Orders the items listed, apart from a select-all option, which stays
     * first. The default puts the selected items first (as
     * `@selectionFeedback` says), then the rest by `@compareItems`.
     */
    sortItems?: (items: readonly T[], options: SortItemsOptions<T>) => T[];
    /**
     * Compares two items' texts for the default order. Defaults to
     * `localeCompare` in `@locale`, with numbers compared by value.
     */
    compareItems?: CompareItems;
    /** The locale the default `@compareItems` sorts in. Defaults to `en`. */
    locale?: string;
    /**
     * Read to assistive technology with the number selected. Defaults to
     * "Total items selected: ".
     */
    clearSelectionDescription?: string;
    /**
     * Read to assistive technology after the number selected. Defaults to
     * "To clear selection, press Delete or Backspace".
     */
    clearSelectionText?: string;
    /** Show each item's text as its checkbox's tooltip. */
    useTitleInItem?: boolean;
    /**
     * **Experimental:** position the menu with Floating UI, so it opens
     * above the field when there's no room below, and hides when the field
     * scrolls out of view.
     */
    autoAlign?: boolean;
    /** The side of the field the menu opens on. Defaults to `bottom`. */
    direction?: 'top' | 'bottom';
    /**
     * The field's height. Without it, the field follows an enclosing
     * Layout's size.
     */
    size?: ListBoxSize;
    /** `inline` lays the field out next to its label. */
    type?: 'default' | 'inline';
    /** Specify if the control should be disabled, or not. */
    disabled?: boolean;
    /** Whether the selection can be read and focused, but not changed. */
    readOnly?: boolean;
    /** Specify if the current selection is invalid. */
    invalid?: boolean;
    /** Message which is displayed if the selection is invalid. */
    invalidText?: string;
    /** Specify whether the control is currently in warning state. */
    warn?: boolean;
    /** Message which is displayed if the control is in warning state. */
    warnText?: string;
  };
  Blocks: {
    /** Renders each item's text in the menu. Defaults to `@itemToString`. */
    default: [item: T];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * field. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/** Carbon React's default: the items whose text contains what was typed. */
function defaultFilterItems<T>(
  items: readonly T[],
  {
    inputValue,
    itemToString,
  }: { inputValue: string; itemToString: (item: T) => string },
): T[] {
  if (!inputValue) return [...items];
  const typed = inputValue.toLowerCase();
  return items.filter((item) =>
    itemToString(item).toLowerCase().includes(typed),
  );
}

/**
 * `FilterableMultiSelect` is a MultiSelect with a text input that narrows
 * its items, for choosing any number of items from a long list. Like Carbon
 * React's, it follows downshift's `useCombobox` keyboard model: focus stays
 * in the input while the arrow keys move the highlight, Enter checks the
 * highlighted item, and the menu stays open until Escape, Tab or a click
 * elsewhere. A tag in the field counts the items chosen, and clears them; so
 * do Delete and Escape, and Backspace in the empty input, on the closed
 * field.
 *
 * ```gjs
 * import { FilterableMultiSelect } from 'carbon-components-ember/components';
 *
 * <template>
 *   <FilterableMultiSelect
 *     @titleText='Countries'
 *     @placeholder='Filter countries'
 *     @items={{this.countries}}
 *     @onChange={{this.handleChange}}
 *   />
 * </template>
 * ```
 */
export default class FilterableMultiSelect<T> extends Component<
  FilterableMultiSelectSignature<T>
> {
  @tracked isOpen: boolean;
  @tracked inputValue = '';
  @tracked highlightedIndex = -1;
  @tracked isFocused = false;
  @tracked internalSelectedItems: T[];
  // With 'top-after-reopen', the selection when the menu last opened, which
  // the menu lists first while it stays open.
  @tracked openedSelection: T[] = [];

  guid = guidFor(this);

  #input?: HTMLInputElement;
  #lastOpenArg: boolean;

  constructor(owner: Owner, args: FilterableMultiSelectSignature<T>['Args']) {
    super(owner, args);
    this.internalSelectedItems = args.initialSelectedItems ?? [];
    this.isOpen = Boolean(args.open);
    this.#lastOpenArg = this.isOpen;
    this.openedSelection = this.selectedItems;
    // As in Carbon React, a menu open at first is reported once.
    if (this.isOpen) afterRender(this, () => this.args.onMenuChange?.(true));
  }

  get id() {
    return this.args.id ?? `filterable-multi-select-${this.guid}`;
  }

  get labelId() {
    return `${this.id}-label`;
  }

  get inputId() {
    return `${this.id}-input`;
  }

  get toggleId() {
    return `${this.id}-toggle-button`;
  }

  get menuId() {
    return `${this.id}__menu`;
  }

  get helperId() {
    return `filterablemultiselect-helper-text-${this.guid}`;
  }

  get invalidId() {
    return `${this.id}-error-msg`;
  }

  get warnId() {
    return `${this.id}-warn-msg`;
  }

  itemId = (index: number): string => `${this.id}-item-${index}`;

  get selectedItems(): T[] {
    return this.args.selectedItems ?? this.internalSelectedItems;
  }

  @cached
  get filteredItems(): T[] {
    return (this.args.filterItems ?? defaultFilterItems)(this.args.items, {
      inputValue: this.inputValue,
      itemToString: this.itemToString,
    });
  }

  get listedItems() {
    return this.filteredItems.filter((item) => !isSelectAllItem(item));
  }

  // The listed items a select-all option checks or clears.
  get selectableItems() {
    return this.listedItems.filter((item) => !isItemDisabled(item));
  }

  get hasSelectAll() {
    return this.filteredItems.some(isSelectAllItem);
  }

  get selectAllState() {
    const selectable = this.selectableItems;
    const unchecked = selectable.filter((item) => !this.#isSelected(item));
    return {
      checked: selectable.length > 0 && unchecked.length === 0,
      indeterminate:
        unchecked.length > 0 && unchecked.length < selectable.length,
    };
  }

  // The items in the order the menu lists them, which the keyboard follows:
  // a select-all option first, while it has items to check.
  @cached
  get sortedItems(): T[] {
    const feedback = this.args.selectionFeedback ?? 'top-after-reopen';
    const selectedItems =
      feedback === 'fixed'
        ? []
        : feedback === 'top'
          ? this.selectedItems
          : this.topItems;
    const sorted = (this.args.sortItems ?? defaultSortItems)(this.listedItems, {
      selectedItems,
      itemToString: this.itemToString,
      compareItems: this.args.compareItems ?? defaultCompareItems,
      locale: this.args.locale ?? 'en',
    });
    const selectAllItem = this.args.items.find(isSelectAllItem);
    return selectAllItem !== undefined && this.selectableItems.length > 0
      ? [selectAllItem, ...sorted]
      : sorted;
  }

  // As in Carbon React, the selection jumps to the top only while the menu
  // is closed.
  get topItems() {
    return this.isOpen ? this.openedSelection : this.selectedItems;
  }

  get selectionCount() {
    return this.selectedItems.filter((item) => !isSelectAllItem(item)).length;
  }

  #isSelected(item: T) {
    return this.selectedItems.some((selected) => isEqual(selected, item));
  }

  isChecked = (item: T): boolean =>
    isSelectAllItem(item)
      ? this.selectAllState.checked
      : this.#isSelected(item);

  isIndeterminate = (item: T): boolean =>
    isSelectAllItem(item) && this.selectAllState.indeterminate;

  isActive = (item: T): boolean =>
    this.isChecked(item) && !isSelectAllItem(item);

  // What assistive technology reads with the label.
  get selectionSummary() {
    const {
      clearSelectionDescription = 'Total items selected: ',
      clearSelectionText = 'To clear selection, press Delete or Backspace',
    } = this.args;
    const count = this.selectedItems.length;
    return count > 0
      ? `${clearSelectionDescription} ${count}. ${clearSelectionText}.`
      : `${clearSelectionDescription} 0.`;
  }

  get direction() {
    return this.args.direction ?? 'bottom';
  }

  get floatsMenu() {
    return Boolean(this.args.autoAlign && this.isOpen);
  }

  get isInline() {
    return this.args.type === 'inline';
  }

  // As in Carbon React, a disabled or read-only field shows neither state.
  get isInvalid() {
    return Boolean(
      this.args.invalid && !this.args.disabled && !this.args.readOnly,
    );
  }

  get isWarn() {
    return Boolean(
      this.args.warn &&
      !this.args.invalid &&
      !this.args.disabled &&
      !this.args.readOnly,
    );
  }

  get showHelperText() {
    return (
      Boolean(this.args.helperText) &&
      !this.isInline &&
      !this.isInvalid &&
      !this.isWarn
    );
  }

  get describedBy() {
    if (this.isInvalid && this.args.invalidText) return this.invalidId;
    if (this.isWarn && this.args.warnText) return this.warnId;
    if (this.showHelperText) return this.helperId;
    return undefined;
  }

  get activeDescendant() {
    return this.isOpen && this.highlightedIndex >= 0
      ? this.itemId(this.highlightedIndex)
      : undefined;
  }

  get wrapperClasses() {
    const classes = [
      'cds--multi-select__wrapper',
      'cds--multi-select--filterable__wrapper',
      'cds--list-box__wrapper',
    ];
    if (this.isInline) {
      classes.push(
        'cds--multi-select__wrapper--inline',
        'cds--list-box__wrapper--inline',
      );
      if (this.isInvalid) {
        classes.push(
          'cds--multi-select__wrapper--inline--invalid',
          'cds--list-box__wrapper--inline--invalid',
        );
      }
    }
    if (this.args.direction === 'top') classes.push('cds--list-box--up');
    if (this.args.autoAlign) classes.push('cds--autoalign');
    return classes.join(' ');
  }

  // The field's own classes; ListBox adds the list-box ones.
  get fieldClasses() {
    const classes = [
      'cds--multi-select',
      'cds--combo-box',
      'cds--multi-select--filterable',
    ];
    if (this.isInvalid) classes.push('cds--multi-select--invalid');
    if (this.isInvalid && this.isFocused) {
      classes.push('cds--multi-select--invalid--focused');
    }
    if (this.isOpen) classes.push('cds--multi-select--open');
    if (this.isInline) classes.push('cds--multi-select--inline');
    if (this.selectedItems.length > 0) {
      classes.push('cds--multi-select--selected');
    }
    if (this.isFocused) {
      classes.push('cds--multi-select--filterable--input-focused');
    }
    if (this.args.readOnly) classes.push('cds--multi-select--readonly');
    if (this.hasSelectAll) classes.push('cds--multi-select--selectall');
    return classes.join(' ');
  }

  itemToString = (item: T): string =>
    (this.args.itemToString ?? defaultItemToString)(item);

  #setOpen(open: boolean) {
    if (open === this.isOpen) return;
    if (open) this.openedSelection = this.selectedItems;
    this.isOpen = open;
    if (!open) this.highlightedIndex = -1;
    this.args.onMenuChange?.(open);
  }

  // Opens the menu, on the first item when something is selected.
  #open() {
    if (this.args.readOnly) return;
    this.#setOpen(true);
    if (this.selectedItems.length > 0) this.highlightedIndex = 0;
  }

  #setInputValue(inputValue: string) {
    if (inputValue === this.inputValue) return;
    this.inputValue = inputValue;
    this.args.onInputValueChange?.({ inputValue });
  }

  #setSelection(selectedItems: T[]) {
    if (this.args.selectedItems === undefined) {
      this.internalSelectedItems = selectedItems;
    }
    this.args.onChange?.({ selectedItems });
  }

  #toggleItem(item: T) {
    if (this.args.disabled || this.args.readOnly) return;
    const selected = this.selectedItems;
    if (isSelectAllItem(item)) {
      // As in Carbon React, it checks or clears only the items listed for
      // the text typed.
      const { checked, indeterminate } = this.selectAllState;
      const listed = this.filteredItems;
      this.#setSelection(
        checked || indeterminate
          ? selected.filter(
              (candidate) =>
                !listed.some((listedItem) => isEqual(listedItem, candidate)),
            )
          : [
              ...selected,
              ...this.selectableItems.filter(
                (candidate) => !this.#isSelected(candidate),
              ),
            ],
      );
      return;
    }
    const index = selected.findLastIndex((candidate) =>
      isEqual(candidate, item),
    );
    this.#setSelection(
      index === -1
        ? [...selected, item]
        : selected.filter((_candidate, position) => position !== index),
    );
  }

  // Keeps the highlight on an item checked or unchecked, wherever its new
  // place in the list is.
  #toggleAndFollow(item: T) {
    this.#toggleItem(item);
    this.highlightedIndex = this.sortedItems.indexOf(item);
  }

  clearSelection = () => {
    if (this.args.disabled || this.args.readOnly) return;
    if (this.selectedItems.length === 0) return;
    this.#setSelection([]);
  };

  clearSelectionAndFocus = () => {
    this.clearSelection();
    this.#input?.focus();
  };

  clearInput = () => {
    this.#setInputValue('');
    this.#input?.focus();
  };

  handleInput = (event: Event) => {
    this.#setInputValue((event.target as HTMLInputElement).value);
    this.#setOpen(true);
    this.highlightedIndex = enabledIndex(this.sortedItems, 0);
  };

  handleInputClick = (event: MouseEvent) => {
    if (this.args.readOnly) {
      event.preventDefault();
      return;
    }
    if (this.isOpen) {
      this.#setOpen(false);
    } else {
      this.#open();
    }
  };

  handleToggleClick = () => {
    if (this.isOpen) {
      this.#setOpen(false);
    } else {
      this.#open();
    }
    this.#input?.focus();
  };

  handleKeydown = (event: KeyboardEvent) => {
    // Keys that build or confirm an IME composition belong to it.
    if (event.isComposing || event.keyCode === 229) return;
    if (this.args.readOnly) {
      // As in Carbon React, these don't open a read-only field.
      if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
      return;
    }
    const input = event.target as HTMLInputElement;
    const items = this.sortedItems;
    switch (event.key) {
      case ' ':
        // A space typed mustn't also toggle an enclosing control.
        event.stopPropagation();
        break;
      case 'Enter':
        if (this.isOpen) {
          event.preventDefault();
          this.#toggleHighlighted();
        } else {
          this.#open();
        }
        break;
      case 'Escape':
      case 'Delete':
        this.#clearKey(event);
        break;
      case 'Backspace':
        // As downshift's useMultipleSelection, Backspace at the start of the
        // input clears a closed field.
        if (
          !this.isOpen &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          input.selectionStart === 0 &&
          input.selectionEnd === 0
        ) {
          this.clearSelection();
        }
        break;
      case 'Tab':
        this.#setOpen(false);
        break;
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.isOpen) {
          // As in Carbon React, only ArrowDown opens the field.
          if (event.key === 'ArrowDown') {
            this.#setOpen(true);
            this.highlightedIndex = enabledIndex(items, 0);
          }
          break;
        }
        const next = nextEnabledIndex(
          items,
          this.highlightedIndex,
          event.key === 'ArrowDown' ? 1 : -1,
        );
        this.highlightedIndex = next < 0 ? enabledIndex(items, 0) : next;
        break;
      }
      case 'PageDown':
      case 'PageUp':
        if (this.isOpen) {
          event.preventDefault();
          this.highlightedIndex = nextEnabledIndex(
            items,
            this.highlightedIndex,
            event.key === 'PageDown' ? 10 : -10,
          );
        }
        break;
      case 'Home':
      case 'End': {
        const toStart = event.key === 'Home';
        const caret = toStart ? 0 : input.value.length;
        input.setSelectionRange(caret, caret);
        if (this.isOpen) {
          event.preventDefault();
          this.highlightedIndex = toStart
            ? enabledIndex(items, 0)
            : enabledIndex(items, items.length - 1, true);
        }
        break;
      }
    }
  };

  // As in Carbon React: on the open field, Escape clears the text typed and
  // closes the menu, and Delete edits the text; on the closed field, both
  // clear the text and the selection.
  #clearKey(event: KeyboardEvent) {
    event.stopPropagation();
    if (this.isOpen) {
      if (event.key === 'Escape') {
        this.#setInputValue('');
        this.#setOpen(false);
      }
      return;
    }
    this.#setInputValue('');
    this.clearSelection();
  }

  #toggleHighlighted() {
    const item = this.sortedItems[this.highlightedIndex];
    if (item === undefined || isItemDisabled(item)) return;
    this.#toggleAndFollow(item);
  }

  handleItemClick = (item: T) => {
    if (isItemDisabled(item)) return;
    this.#toggleAndFollow(item);
  };

  handleFocus = () => {
    this.isFocused = true;
  };

  handleBlur = () => {
    // As in Carbon React, leaving the field closes it and clears the text
    // typed.
    this.isFocused = false;
    this.#setInputValue('');
    this.#setOpen(false);
  };

  // Keeps focus in the input when the menu, its button or the clear button
  // is pressed, as downshift does.
  keepFocus = (event: MouseEvent) => {
    event.preventDefault();
  };

  registerInput = modifier((input: HTMLInputElement) => {
    this.#input = input;
  });

  // Opens or closes the menu when @open changes, as Carbon React does.
  syncOpen = modifier(
    (_input: HTMLInputElement, [open]: [open: boolean | undefined]) => {
      const value = Boolean(open);
      if (value === this.#lastOpenArg) return;
      this.#lastOpenArg = value;
      afterRender(this, () => this.#setOpen(value));
    },
  );

  <template>
    <div
      class="{{this.wrapperClasses}}
        {{if (has-block 'decorator') 'cds--list-box__wrapper--decorator'}}"
      ...attributes
    >
      {{#if @titleText}}
        <label
          id={{this.labelId}}
          for={{this.inputId}}
          class="cds--label
            {{if @disabled 'cds--label--disabled'}}
            {{if @hideLabel 'cds--visually-hidden'}}"
        >
          {{@titleText}}
          <span class="cds--visually-hidden">{{this.selectionSummary}}</span>
        </label>
      {{/if}}
      <ListBox
        id={{this.id}}
        class={{this.fieldClasses}}
        @size={{@size}}
        @type={{if this.isInline "inline" "default"}}
        @disabled={{@disabled}}
        @isOpen={{and (not @readOnly) this.isOpen}}
        @invalid={{this.isInvalid}}
        @invalidText={{@invalidText}}
        @invalidTextId={{this.invalidId}}
        @warn={{this.isWarn}}
        @warnText={{@warnText}}
        @warnTextId={{this.warnId}}
      >
        <div class="cds--list-box__field">
          {{#if this.selectedItems.length}}
            <ListBoxSelection
              @selectionCount={{this.selectionCount}}
              @clearSelection={{this.clearSelectionAndFocus}}
              @disabled={{@disabled}}
              @readOnly={{@readOnly}}
            />
          {{/if}}
          <input
            id={{this.inputId}}
            class="cds--text-input
              {{unless this.inputValue 'cds--text-input--empty'}}"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded={{if this.isOpen "true" "false"}}
            aria-controls={{if this.isOpen this.menuId}}
            aria-activedescendant={{this.activeDescendant}}
            aria-describedby={{this.describedBy}}
            autocomplete="off"
            placeholder={{@placeholder}}
            value={{this.inputValue}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            {{on "input" this.handleInput}}
            {{on "click" this.handleInputClick}}
            {{on "keydown" this.handleKeydown}}
            {{on "focus" this.handleFocus}}
            {{on "blur" this.handleBlur}}
            {{this.registerInput}}
            {{this.syncOpen @open}}
          />
          {{#if this.isInvalid}}
            <WarningFilled @size="16" @svgClass="cds--list-box__invalid-icon" />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size="16"
              @svgClass="cds--list-box__invalid-icon cds--list-box__invalid-icon--warning"
            />
          {{/if}}
          {{#if this.inputValue}}
            <ListBoxSelection
              @clearSelection={{this.clearInput}}
              @disabled={{@disabled}}
              @readOnly={{@readOnly}}
              {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus in the input, see keepFocus }}
              {{on "mousedown" this.keepFocus}}
            />
          {{/if}}
          <ListBoxTrigger
            id={{this.toggleId}}
            aria-controls={{this.menuId}}
            aria-expanded={{if this.isOpen "true" "false"}}
            disabled={{@disabled}}
            @isOpen={{this.isOpen}}
            {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus in the input, see keepFocus }}
            {{on "mousedown" this.keepFocus}}
            {{on "click" this.handleToggleClick}}
          />
        </div>
        {{#if (has-block "decorator")}}
          <div class="cds--list-box__inner-wrapper--decorator">
            {{yield (component AILabel size="mini") to="decorator"}}
          </div>
        {{/if}}
        <ListBoxMenu
          @id={{this.menuId}}
          aria-labelledby={{if @titleText this.labelId}}
          hidden={{not this.isOpen}}
          {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus in the input, see keepFocus }}
          {{on "mousedown" this.keepFocus}}
          {{scrollToHighlighted this.highlightedIndex}}
          {{(if this.floatsMenu positionMenu) placement=this.direction}}
        >
          {{#if this.isOpen}}
            {{#each this.sortedItems as |item index|}}
              <ListBoxMenuItem
                id={{this.itemId index}}
                {{! eslint-disable-next-line ember/template-require-context-role -- ListBoxMenu is the role="listbox" }}
                role="option"
                aria-selected={{if (this.isChecked item) "true" "false"}}
                aria-checked={{if
                  (this.isIndeterminate item)
                  "mixed"
                  (if (this.isChecked item) "true" "false")
                }}
                aria-label={{this.itemToString item}}
                @disabled={{isItemDisabled item}}
                @isActive={{this.isActive item}}
                @isHighlighted={{eq index this.highlightedIndex}}
                @title={{this.itemToString item}}
                {{on "click" (fn this.handleItemClick item)}}
              >
                {{! eslint-disable-next-line ember/template-require-presentational-children -- ListBoxCheckbox only draws the box, with divs }}
                <ListBoxCheckbox
                  @checked={{this.isChecked item}}
                  @indeterminate={{this.isIndeterminate item}}
                  @disabled={{or @disabled (isItemDisabled item)}}
                  @title={{if @useTitleInItem (this.itemToString item)}}
                >
                  {{#if (has-block)}}
                    {{yield item}}
                  {{else}}
                    {{this.itemToString item}}
                  {{/if}}
                </ListBoxCheckbox>
              </ListBoxMenuItem>
            {{/each}}
          {{/if}}
        </ListBoxMenu>
      </ListBox>
      {{#if this.showHelperText}}
        <div
          id={{this.helperId}}
          class="cds--form__helper-text
            {{if @disabled 'cds--form__helper-text--disabled'}}"
        >{{@helperText}}</div>
      {{/if}}
    </div>
  </template>
}
