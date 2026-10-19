/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { rawTimeout, task } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import type Owner from '@ember/owner';
import WarningFilled from './icons/warning-filled.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import AILabel from './ai-label.gts';
import ListBox from './-private/list-box/list-box.gts';
import ListBoxMenu from './-private/list-box/list-box-menu.gts';
import ListBoxMenuIcon from './-private/list-box/list-box-menu-icon.gts';
import ListBoxMenuItem from './-private/list-box/list-box-menu-item.gts';
import ListBoxSelection from './-private/list-box/list-box-selection.gts';
import {
  defaultCompareItems,
  defaultItemToString,
  defaultSortItems,
  enabledIndex,
  isEqual,
  isItemDisabled,
  isSelectAllItem,
  nextEnabledIndex,
  withoutUndefinedValues,
} from './-private/list-box/items.ts';
import {
  positionMenu,
  scrollToHighlighted,
} from './-private/list-box/menu-modifiers.ts';
import { afterRender } from '../utils/after-render.ts';
import { typeaheadIndex } from '../utils/roving-focus.ts';
import type {
  CompareItems,
  SortItemsOptions,
} from './-private/list-box/items.ts';
import type { WithBoundArgs } from '@glint/template';
import './multi-select.scss';

export type { CompareItems, SortItemsOptions };

export interface MultiSelectChange<T> {
  /** The selected items, without a select-all option. */
  selectedItems: T[];
}

export interface MultiSelectSignature<T> {
  Element: HTMLDivElement;
  Args: {
    /**
     * The id of the field. The label, button, menu and items derive theirs
     * from it. Auto-generated when omitted.
     */
    id?: string;
    /**
     * The items to choose from. They can be any value: `@itemToString` turns
     * one into its text. An item with `disabled: true` can't be chosen, and
     * one with `isSelectAll: true` selects or clears every other item.
     * Object items with an `undefined` value aren't listed, as in Carbon
     * React.
     */
    items: T[];
    /**
     * Turns an item into the text shown for it. Defaults to a string or
     * number item itself, or an object's string `label`.
     */
    itemToString?: (item: T) => string;
    /** The text in the field, whatever is selected. */
    label: string;
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
    onChange?: (data: MultiSelectChange<T>) => void;
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
     * Orders the items. The default puts a select-all option first, then the
     * selected items (as `@selectionFeedback` says), then the rest by
     * `@compareItems`. To only change how items compare, pass that instead.
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
     * Read to assistive technology before the number selected. Defaults to
     * "Total items selected: ".
     */
    clearSelectionDescription?: string;
    /**
     * Read to assistive technology after the items selected. Defaults to
     * "To clear selection, press Delete or Backspace".
     */
    clearSelectionText?: string;
    /**
     * Announced when Delete clears the selection. Defaults to "all items
     * have been cleared".
     */
    clearAnnouncement?: string;
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
    size?: 'xs' | 'sm' | 'md' | 'lg';
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

/**
 * `MultiSelect` is a field that opens a listbox of checkable items, for
 * choosing any number of them. Like Carbon React's, it's built on the
 * internal ListBox parts and follows downshift's `useSelect` keyboard model:
 * focus stays on the field while the arrow keys move the highlight, Space or
 * Enter checks the highlighted item, and the menu stays open until Escape,
 * Tab or a click elsewhere. A tag in the field counts the items chosen, and
 * clears them; so do Delete and Escape on the closed field.
 *
 * ```gjs
 * import { MultiSelect } from 'carbon-components-ember/components';
 *
 * <template>
 *   <MultiSelect
 *     @titleText='Toppings'
 *     @label='Choose toppings'
 *     @items={{array 'Cheese' 'Olives' 'Peppers'}}
 *     @onChange={{this.handleChange}}
 *   />
 * </template>
 * ```
 */
export default class MultiSelect<T> extends Component<MultiSelectSignature<T>> {
  @tracked isOpen: boolean;
  @tracked highlightedIndex = -1;
  @tracked isFocused = false;
  @tracked internalSelectedItems: T[];
  // With 'top-after-reopen', the selection when the menu last opened, which
  // the menu lists first.
  @tracked topItems: T[] = [];
  @tracked itemsCleared = false;

  guid = guidFor(this);

  #lastOpenArg: boolean;
  searchBuffer = '';
  searchAnchorIndex = -1;

  // Characters typed within this window of each other search together, as
  // in downshift.
  resetSearchBuffer = task({ restartable: true }, async () => {
    await rawTimeout(500);
    this.searchBuffer = '';
    this.searchAnchorIndex = -1;
  });

  constructor(owner: Owner, args: MultiSelectSignature<T>['Args']) {
    super(owner, args);
    this.internalSelectedItems = args.initialSelectedItems ?? [];
    this.isOpen = Boolean(args.open);
    this.#lastOpenArg = this.isOpen;
    if (this.isOpen) this.topItems = this.selectedItems;
  }

  get id() {
    return this.args.id ?? `multi-select-${this.guid}`;
  }

  get labelId() {
    return `${this.id}-label`;
  }

  get toggleId() {
    return `${this.id}-toggle-button`;
  }

  get menuId() {
    return `${this.id}-menu`;
  }

  get helperId() {
    return `multiselect-helper-text-${this.guid}`;
  }

  get invalidId() {
    return `${this.id}-error-msg`;
  }

  get warnId() {
    return `${this.id}-warn-msg`;
  }

  itemId = (index: number): string => `${this.menuId}-item-${index}`;

  get selectedItems(): T[] {
    return this.args.selectedItems ?? this.internalSelectedItems;
  }

  @cached
  get availableItems(): T[] {
    return withoutUndefinedValues(this.args.items);
  }

  get hasSelectAll() {
    return this.availableItems.some(isSelectAllItem);
  }

  // The items in the order the menu lists them, which the keyboard follows.
  @cached
  get sortedItems(): T[] {
    const feedback = this.args.selectionFeedback ?? 'top-after-reopen';
    const selectedItems =
      feedback === 'fixed'
        ? []
        : feedback === 'top'
          ? this.selectedItems
          : this.topItems;
    return (this.args.sortItems ?? defaultSortItems)(this.availableItems, {
      selectedItems,
      itemToString: this.itemToString,
      compareItems: this.args.compareItems ?? defaultCompareItems,
      locale: this.args.locale ?? 'en',
    });
  }

  get selectableCount() {
    return this.availableItems.filter(
      (item) => !isSelectAllItem(item) && !isItemDisabled(item),
    ).length;
  }

  get selectedCount() {
    return this.selectedItems.filter((item) => !isSelectAllItem(item)).length;
  }

  get selectionCount() {
    return this.hasSelectAll ? this.selectedCount : this.selectedItems.length;
  }

  isChecked = (item: T): boolean => {
    if (isSelectAllItem(item)) {
      return (
        this.selectableCount > 0 && this.selectedCount === this.selectableCount
      );
    }
    return this.selectedItems.some((selected) => isEqual(selected, item));
  };

  isIndeterminate = (item: T): boolean =>
    isSelectAllItem(item) &&
    this.selectedCount > 0 &&
    this.selectedCount < this.selectableCount;

  isActive = (item: T): boolean =>
    this.isChecked(item) && !isSelectAllItem(item);

  // What assistive technology reads with the label while items are chosen.
  get selectionSummary() {
    const {
      clearSelectionDescription = 'Total items selected: ',
      clearSelectionText = 'To clear selection, press Delete or Backspace',
    } = this.args;
    const texts = this.selectedItems
      .map((item) => this.itemToString(item))
      .join(', ');
    return `${clearSelectionDescription} ${this.selectedItems.length} ${texts},${clearSelectionText}`;
  }

  get clearAnnouncement() {
    return this.args.clearAnnouncement ?? 'all items have been cleared';
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
    const classes = ['cds--multi-select__wrapper', 'cds--list-box__wrapper'];
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
    return classes.join(' ');
  }

  // MultiSelect's own classes; ListBox adds the list-box ones.
  get multiSelectClasses() {
    const classes = ['cds--multi-select'];
    if (this.isInvalid) classes.push('cds--multi-select--invalid');
    if (this.isInvalid && this.isFocused) {
      classes.push('cds--multi-select--invalid--focused');
    }
    if (this.isWarn) classes.push('cds--multi-select--warning');
    if (this.isInline) classes.push('cds--multi-select--inline');
    if (this.selectedItems.length > 0) {
      classes.push('cds--multi-select--selected');
    }
    if (this.args.direction === 'top') classes.push('cds--list-box--up');
    if (this.args.readOnly) classes.push('cds--multi-select--readonly');
    if (this.args.autoAlign) classes.push('cds--autoalign');
    if (this.hasSelectAll) classes.push('cds--multi-select--selectall');
    return classes.join(' ');
  }

  itemToString = (item: T): string =>
    (this.args.itemToString ?? defaultItemToString)(item);

  #setOpen(open: boolean) {
    if (open === this.isOpen) return;
    this.isOpen = open;
    if (open) {
      this.topItems = this.selectedItems;
    } else {
      this.highlightedIndex = -1;
    }
    this.args.onMenuChange?.(open);
  }

  #setSelection(selectedItems: T[]) {
    if (this.args.selectedItems === undefined) {
      this.internalSelectedItems = selectedItems;
    }
    // So the next Delete is announced again.
    if (selectedItems.length > 0) this.itemsCleared = false;
    this.args.onChange?.({ selectedItems });
  }

  // Checks or unchecks an item, as Carbon React's `useSelection` does: the
  // select-all option clears a selection or checks every enabled item, and
  // checking the last unchecked item settles on all of them.
  #toggleItem(item: T) {
    if (this.args.disabled) return;
    const selected = this.selectedItems;
    const available = this.availableItems;
    const selectable = available.filter(
      (candidate) => !isItemDisabled(candidate) && !isSelectAllItem(candidate),
    );
    let next: T[];
    if (isSelectAllItem(item)) {
      next = selected.length > 0 ? [] : selectable;
    } else {
      const index = selected.findLastIndex((candidate) =>
        isEqual(candidate, item),
      );
      if (index === -1) {
        next = [...selected, item];
        const disabledCount = available.filter(isItemDisabled).length;
        if (
          this.hasSelectAll &&
          available.length - 1 === next.length + disabledCount
        ) {
          next = selectable;
        }
      } else {
        next = selected.filter(
          (candidate, position) =>
            position !== index && !isSelectAllItem(candidate),
        );
      }
    }
    this.#setSelection(next);
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

  handleClick = (event: MouseEvent) => {
    if (this.args.readOnly) {
      // A read-only field still takes focus, but doesn't open.
      event.preventDefault();
      (event.currentTarget as HTMLElement).focus();
      return;
    }
    if (this.isOpen) {
      this.#setOpen(false);
      return;
    }
    this.#setOpen(true);
    this.highlightedIndex = this.selectedItems.length > 0 ? 0 : -1;
  };

  handleKeydown = (event: KeyboardEvent) => {
    const { key } = event;
    if (this.args.readOnly) {
      if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(key)) {
        event.preventDefault();
      }
      return;
    }
    if (this.isOpen) {
      this.#keydownInMenu(event);
      return;
    }
    switch (key) {
      case 'Delete':
      case 'Escape':
        // As in Carbon React, both clear the closed field.
        event.stopPropagation();
        if (key === 'Delete' && this.selectedItems.length > 0) {
          this.itemsCleared = true;
        }
        this.clearSelection();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.itemsCleared = false;
        if (this.selectedItems.length === 0) this.isFocused = false;
        this.#setOpen(true);
        this.highlightedIndex = enabledIndex(this.sortedItems, 0);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.itemsCleared = false;
        this.#setOpen(true);
        this.highlightedIndex = this.selectedItems.length > 0 ? 0 : -1;
        break;
      case 'ArrowUp':
      case 'Home':
      case 'End':
        // As downshift, these don't open the field, or scroll the page.
        event.preventDefault();
        break;
    }
  };

  #keydownInMenu(event: KeyboardEvent) {
    const items = this.sortedItems;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const down = event.key === 'ArrowDown';
        if (down && this.selectedItems.length === 0) this.isFocused = false;
        const next = nextEnabledIndex(
          items,
          this.highlightedIndex,
          down ? 1 : -1,
          { loop: false },
        );
        this.highlightedIndex = next < 0 ? enabledIndex(items, 0) : next;
        break;
      }
      case 'PageDown':
      case 'PageUp':
        event.preventDefault();
        this.highlightedIndex = nextEnabledIndex(
          items,
          this.highlightedIndex,
          event.key === 'PageDown' ? 10 : -10,
          { loop: false },
        );
        break;
      case 'Home':
        event.preventDefault();
        this.highlightedIndex = enabledIndex(items, 0);
        break;
      case 'End':
        event.preventDefault();
        this.highlightedIndex = enabledIndex(items, items.length - 1, true);
        break;
      case 'Escape':
        this.isFocused = true;
        this.#setOpen(false);
        break;
      case 'Enter':
        event.preventDefault();
        this.isFocused = true;
        this.#toggleHighlighted();
        break;
      case ' ':
        event.preventDefault();
        // Mid-typeahead, a space is part of what's typed ("Option 1").
        if (this.searchBuffer) {
          this.#typeahead(' ');
        } else {
          this.#toggleHighlighted();
        }
        break;
      case 'Tab':
        this.#setOpen(false);
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          this.#typeahead(event.key);
        }
    }
  }

  #toggleHighlighted() {
    const item = this.sortedItems[this.highlightedIndex];
    if (item === undefined || isItemDisabled(item)) return;
    this.#toggleAndFollow(item);
  }

  // Highlights the next item whose text starts with the characters typed so
  // far, skipping disabled items, as downshift does.
  #typeahead(key: string) {
    const items = this.sortedItems;
    if (!this.searchBuffer) this.searchAnchorIndex = this.highlightedIndex;
    this.searchBuffer += key;
    void this.resetSearchBuffer.perform();
    const index = typeaheadIndex(
      items.map((item) =>
        isItemDisabled(item) ? '' : this.itemToString(item),
      ),
      this.searchBuffer,
      { current: this.highlightedIndex, anchor: this.searchAnchorIndex },
    );
    if (index >= 0) this.highlightedIndex = index;
  }

  handleItemClick = (item: T) => {
    if (isItemDisabled(item)) return;
    this.#toggleAndFollow(item);
  };

  handleFocus = () => {
    this.isFocused = true;
  };

  handleBlur = () => {
    this.isFocused = false;
    // The menu keeps focus on the field (see keepFocus), so a blur means it
    // moved somewhere else.
    if (this.isOpen) this.#setOpen(false);
  };

  // Keeps focus on the field when an item is pressed, as downshift does.
  keepFocus = (event: MouseEvent) => {
    event.preventDefault();
  };

  // Opens or closes the menu when @open changes, as Carbon React does.
  syncOpen = modifier(
    (_button: HTMLButtonElement, [open]: [open: boolean | undefined]) => {
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
      <label
        id={{this.labelId}}
        for={{this.toggleId}}
        class="cds--label
          {{if @disabled 'cds--label--disabled'}}
          {{if @hideLabel 'cds--visually-hidden'}}"
      >
        {{@titleText}}
        {{#if this.selectedItems.length}}
          <span class="cds--visually-hidden">{{this.selectionSummary}}</span>
        {{/if}}
      </label>
      <ListBox
        id={{this.id}}
        class={{this.multiSelectClasses}}
        @size={{@size}}
        @type={{if this.isInline "inline" "default"}}
        @disabled={{@disabled}}
        @isOpen={{this.isOpen}}
        @invalid={{this.isInvalid}}
        @invalidText={{@invalidText}}
        @invalidTextId={{this.invalidId}}
        @warn={{this.isWarn}}
        @warnText={{@warnText}}
        @warnTextId={{this.warnId}}
      >
        {{#if this.isInvalid}}
          <WarningFilled @size="16" @svgClass="cds--list-box__invalid-icon" />
        {{else if this.isWarn}}
          <WarningAltFilled
            @size="16"
            @svgClass="cds--list-box__invalid-icon cds--list-box__invalid-icon--warning"
          />
        {{/if}}
        <div
          class="cds--list-box__field--wrapper
            {{if
              this.isFocused
              'cds--list-box__field--wrapper--input-focused'
            }}"
        >
          {{#if this.selectedItems.length}}
            <ListBoxSelection
              @selectionCount={{this.selectionCount}}
              @clearSelection={{this.clearSelection}}
              @disabled={{@disabled}}
              @readOnly={{@readOnly}}
            />
          {{/if}}
          <button
            type="button"
            id={{this.toggleId}}
            class="cds--list-box__field"
            role="combobox"
            tabindex="0"
            aria-haspopup="listbox"
            aria-expanded={{if this.isOpen "true" "false"}}
            aria-controls={{this.menuId}}
            aria-activedescendant={{this.activeDescendant}}
            aria-labelledby={{this.labelId}}
            aria-describedby={{this.describedBy}}
            aria-disabled={{if (or @disabled @readOnly) "true" "false"}}
            disabled={{@disabled}}
            {{on "click" this.handleClick}}
            {{on "keydown" this.handleKeydown}}
            {{on "focus" this.handleFocus}}
            {{on "blur" this.handleBlur}}
            {{this.syncOpen @open}}
          >
            <span class="cds--list-box__label">{{@label}}</span>
            <ListBoxMenuIcon @isOpen={{this.isOpen}} />
          </button>
          {{#if (has-block "decorator")}}
            <div class="cds--list-box__inner-wrapper--decorator">
              {{yield (component AILabel size="mini") to="decorator"}}
            </div>
          {{/if}}
        </div>
        <ListBoxMenu
          @id={{this.menuId}}
          aria-labelledby={{this.labelId}}
          hidden={{not this.isOpen}}
          {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus on the field, see keepFocus }}
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
                aria-disabled={{if (isItemDisabled item) "true"}}
                @disabled={{isItemDisabled item}}
                @isActive={{this.isActive item}}
                @isHighlighted={{eq index this.highlightedIndex}}
                @title={{this.itemToString item}}
                {{on "click" (fn this.handleItemClick item)}}
              >
                {{! An option's children can't be interactive, so its checkbox is
                  only drawn, from Carbon's styles; aria-checked says the same. }}
                <div class="cds--checkbox-wrapper">
                  <div class="cds--form-item cds--checkbox-wrapper">
                    <div
                      class="cds--checkbox-label
                        {{if
                          (this.isIndeterminate item)
                          'cds--ember-multi-select__checkbox--mixed'
                        }}"
                      data-contained-checkbox-state={{if
                        (this.isChecked item)
                        "true"
                        "false"
                      }}
                      data-contained-checkbox-disabled={{if
                        @disabled
                        "true"
                        "false"
                      }}
                      title={{if @useTitleInItem (this.itemToString item)}}
                    >
                      <div class="cds--checkbox-label-text">
                        {{#if (has-block)}}
                          {{yield item}}
                        {{else}}
                          {{this.itemToString item}}
                        {{/if}}
                      </div>
                    </div>
                  </div>
                </div>
              </ListBoxMenuItem>
            {{/each}}
          {{/if}}
        </ListBoxMenu>
        {{! Carbon React labels an empty live region, which isn't read out;
          its text is announced instead. }}
        <span class="cds--visually-hidden" aria-live="assertive">
          {{~if this.itemsCleared this.clearAnnouncement~}}
        </span>
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
