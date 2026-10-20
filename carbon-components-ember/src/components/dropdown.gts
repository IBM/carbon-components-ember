/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { task, timeout } from 'ember-concurrency';
import type Owner from '@ember/owner';
import Checkmark from './icons/checkmark.ts';
import WarningFilled from './icons/warning-filled.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import AILabel from './ai-label.gts';
import ListBox from './-private/list-box/list-box.gts';
import ListBoxMenu from './-private/list-box/list-box-menu.gts';
import ListBoxMenuIcon from './-private/list-box/list-box-menu-icon.gts';
import ListBoxMenuItem from './-private/list-box/list-box-menu-item.gts';
import { defaultItemToString } from './-private/list-box/items.ts';
import { nextIndex, typeaheadIndex } from '../utils/roving-focus.ts';
import type { WithBoundArgs } from '@glint/template';

export interface DropdownSignature<T> {
  Element: HTMLDivElement;
  Args: {
    /**
     * The id of the underlying field button. Also used to derive the ids of
     * the label and menu, so the ARIA wiring between them stays consistent.
     * Auto-generated when omitted.
     */
    id?: string;
    /**
     * The list of items to choose from.
     */
    items: T[];
    /**
     * The field's label, rendered above the control.
     */
    titleText: string;
    /**
     * Placeholder text shown in the field when nothing is selected.
     */
    label: string;
    /**
     * Convert an item to display text. Used for the field button's `title`,
     * each item's title when its text is cut off and, when no item block is
     * supplied, as the default rendering of each menu item. Defaults to
     * reading a `label` property off the item, falling back to an empty
     * string.
     */
    itemToString?: (item: T) => string;
    /**
     * The currently selected item (controlled). Wins over internal state
     * whenever it is defined.
     */
    selectedItem?: T | null;
    /**
     * Seeds the initially selected item for the uncontrolled case.
     */
    initialSelectedItem?: T;
    /**
     * Called whenever the selection changes, with the newly selected item.
     */
    onChange?: (data: { selectedItem: T | null }) => void;
    /**
     * Specify if the control should be disabled, or not.
     */
    disabled?: boolean;
    /**
     * Specify if the control should be read-only. A read-only field button
     * remains focusable but cannot be opened or changed.
     */
    readOnly?: boolean;
    /**
     * Specify if the currently selected value is invalid.
     */
    invalid?: boolean;
    /**
     * Message which is displayed if the value is invalid.
     */
    invalidText?: string;
    /**
     * Specify whether the control is currently in warning state.
     */
    warn?: boolean;
    /**
     * Message which is displayed if the control is in warning state.
     */
    warnText?: string;
    /**
     * Provide text that is used alongside the control label for additional
     * help.
     */
    helperText?: string;
    /**
     * Visually hide the label, while still keeping it available to
     * assistive technology.
     */
    hideLabel?: boolean;
    /**
     * Specify the size of the Dropdown.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * `default` renders the standalone field; `inline` lays the field out
     * next to its label (via flex layout classes) and suppresses the helper
     * text row. The label itself is always rendered - use `@hideLabel` to
     * visually hide it.
     */
    type?: 'default' | 'inline';
    /**
     * The direction the menu should open in.
     */
    direction?: 'top' | 'bottom';
  };
  Blocks: {
    /**
     * Customize how each item renders in the menu. Falls back to
     * `itemToString(item)` when no block is supplied. The field button's own
     * text always uses `itemToString`, matching React's default behaviour
     * when `renderSelectedItem` is not passed.
     */
    default: [item: T];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the field.
     * Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/**
 * `Dropdown` is a single-select field that opens a listbox of items on
 * click. Like Carbon React's, it's built on the internal ListBox parts;
 * Carbon's CSS positions the menu below (or, with `@direction="top"`, above)
 * the field, and focus stays on the field while the arrow keys move the
 * highlight (`aria-activedescendant`).
 *
 * ```gjs
 * import { Dropdown } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Dropdown
 *     @titleText='Choose an option'
 *     @label='Select an option'
 *     @items={{array 'Option 1' 'Option 2' 'Option 3'}}
 *     @onChange={{this.handleChange}}
 *   />
 * </template>
 * ```
 */
export default class Dropdown<T> extends Component<DropdownSignature<T>> {
  @tracked isOpen = false;
  @tracked highlightedIndex = -1;
  @tracked isFocused = false;
  @tracked internalSelectedItem: T | null;

  guid = guidFor(this);

  // Character-key typeahead: characters typed within `resetSearchBuffer`'s
  // window of each other accumulate into a single search query, mirroring
  // downshift's `getItemIndexByCharacterKey`.
  searchBuffer = '';
  searchAnchorIndex = -1;

  resetSearchBuffer = task({ restartable: true }, async () => {
    await timeout(500);
    this.searchBuffer = '';
    this.searchAnchorIndex = -1;
  });

  constructor(owner: Owner, args: DropdownSignature<T>['Args']) {
    super(owner, args);
    this.internalSelectedItem = args.initialSelectedItem ?? null;
  }

  get id() {
    return this.args.id ?? `dropdown-${this.guid}`;
  }

  get labelId() {
    return `${this.id}-label`;
  }

  get menuId() {
    return `${this.id}-menu`;
  }

  get invalidId() {
    return `${this.id}-error-msg`;
  }

  get warnId() {
    return `${this.id}-warn-msg`;
  }

  get helperId() {
    return `${this.id}-helper-text`;
  }

  get describedBy() {
    if (this.isInvalid) return this.invalidId;
    if (this.isWarn) return this.warnId;
    if (this.showHelperText) return this.helperId;
    return undefined;
  }

  itemId = (index: number): string => {
    return `${this.menuId}-item-${index}`;
  };

  get activeDescendant(): string | undefined {
    return this.isOpen && this.highlightedIndex >= 0
      ? this.itemId(this.highlightedIndex)
      : undefined;
  }

  // As in Carbon React, the invalid or warning text replaces the helper.
  get showHelperText() {
    return !!(
      this.args.helperText &&
      !this.isInline &&
      !this.isInvalid &&
      !this.isWarn
    );
  }

  get selectedItem(): T | null {
    return this.args.selectedItem !== undefined
      ? this.args.selectedItem
      : this.internalSelectedItem;
  }

  get isInline() {
    return this.args.type === 'inline';
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get triggerText() {
    return this.selectedItem !== null
      ? this.itemToString(this.selectedItem)
      : this.args.label;
  }

  get wrapperClasses() {
    const classes = ['cds--dropdown__wrapper', 'cds--list-box__wrapper'];
    if (this.isInline) {
      classes.push(
        'cds--dropdown__wrapper--inline',
        'cds--list-box__wrapper--inline',
      );
      if (this.isInvalid) {
        classes.push(
          'cds--dropdown__wrapper--inline--invalid',
          'cds--list-box__wrapper--inline--invalid',
        );
      }
    }
    return classes.join(' ');
  }

  // Dropdown's own classes; ListBox adds the list-box ones.
  get dropdownClasses() {
    // No size classes without @size, so the field follows an enclosing
    // Layout's size, as in Carbon React.
    const classes = ['cds--dropdown'];
    if (this.args.size) classes.push(`cds--dropdown--${this.args.size}`);
    if (this.isInvalid) classes.push('cds--dropdown--invalid');
    if (this.isWarn) classes.push('cds--dropdown--warning');
    if (this.isOpen) classes.push('cds--dropdown--open');
    // As in Carbon React, only while nothing is selected.
    if (this.isFocused && this.selectedItem === null) {
      classes.push('cds--dropdown--focus');
    }
    if (this.isInline) classes.push('cds--dropdown--inline');
    if (this.args.disabled) classes.push('cds--dropdown--disabled');
    if (this.args.readOnly) classes.push('cds--dropdown--readonly');
    if (this.args.direction === 'top') classes.push('cds--list-box--up');
    return classes.join(' ');
  }

  itemToString = (item: T): string =>
    (this.args.itemToString ?? defaultItemToString)(item);

  openMenu() {
    this.isOpen = true;
    const items = this.args.items;
    const selectedIndex =
      this.selectedItem !== null ? items.indexOf(this.selectedItem) : -1;
    this.highlightedIndex =
      selectedIndex >= 0 ? selectedIndex : items.length ? 0 : -1;
  }

  close() {
    this.isOpen = false;
    this.highlightedIndex = -1;
  }

  selectItem = (item: T) => {
    if (this.args.selectedItem === undefined) {
      this.internalSelectedItem = item;
    }
    this.args.onChange?.({ selectedItem: item });
    this.close();
  };

  handleTriggerClick = () => {
    if (this.args.disabled || this.args.readOnly) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.openMenu();
    }
  };

  handleTriggerKeydown = (event: KeyboardEvent) => {
    if (this.args.disabled || this.args.readOnly) return;
    const items = this.args.items;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        // As in Carbon React, ArrowUp on the closed field does nothing (the
        // page can scroll); only ArrowDown opens the menu.
        if (!this.isOpen && event.key === 'ArrowUp') break;
        event.preventDefault();
        if (!this.isOpen) {
          this.openMenu();
        } else {
          this.highlightedIndex =
            nextIndex(event.key, this.highlightedIndex, items.length) ?? -1;
        }
        break;
      case 'Enter':
      case ' ':
        // Mid-typeahead in the open menu, a space is part of what's typed
        // ("Option 1"); on the closed field it opens the menu.
        if (event.key === ' ' && this.isOpen && this.searchBuffer) {
          event.preventDefault();
          this.handleCharacterKey(' ');
          break;
        }
        event.preventDefault();
        if (!this.isOpen) {
          this.openMenu();
        } else if (
          this.highlightedIndex >= 0 &&
          items[this.highlightedIndex] !== undefined
        ) {
          this.selectItem(items[this.highlightedIndex] as T);
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Home':
      case 'End':
        if (this.isOpen && items.length) {
          event.preventDefault();
          this.highlightedIndex =
            nextIndex(event.key, this.highlightedIndex, items.length) ?? -1;
        }
        break;
      case 'Tab':
        if (this.isOpen) {
          this.close();
        }
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          this.handleCharacterKey(event.key);
        }
        break;
    }
  };

  // Jumps the highlight (or, when closed, the selection) to the next item
  // whose text starts with the characters typed so far, as a native
  // `<select>` (and downshift's `useSelect`) does.
  handleCharacterKey(key: string) {
    const items = this.args.items;
    if (!items.length) return;

    const current = this.isOpen
      ? this.highlightedIndex
      : this.selectedItem !== null
        ? items.indexOf(this.selectedItem)
        : -1;
    if (!this.searchBuffer) {
      this.searchAnchorIndex = current;
    }
    this.searchBuffer += key;
    void this.resetSearchBuffer.perform();

    const index = typeaheadIndex(
      items.map((item) => this.itemToString(item)),
      this.searchBuffer,
      { current, anchor: this.searchAnchorIndex },
    );
    if (index < 0) return;
    if (this.isOpen) {
      this.highlightedIndex = index;
    } else {
      this.selectItem(items[index] as T);
    }
  }

  handleItemClick = (item: T) => {
    if (this.args.disabled || this.args.readOnly) return;
    this.selectItem(item);
  };

  setHighlighted = (index: number) => {
    this.highlightedIndex = index;
  };

  handleFocus = () => {
    this.isFocused = true;
  };

  handleBlur = () => {
    this.isFocused = false;
    // Only the field button is ever focusable, so a blur means focus moved
    // somewhere else entirely (another field, Tab, or a click outside) -
    // `preventMenuMouseDown` below stops a click on a menu item from
    // triggering this in the first place.
    this.close();
  };

  preventMenuMouseDown = (event: MouseEvent) => {
    // Keeps focus on the field button when clicking an item, the same way
    // downshift does - otherwise the button would blur (and the menu would
    // close, see `handleBlur`) before the item's own click handler runs.
    event.preventDefault();
  };

  <template>
    <div
      class="{{this.wrapperClasses}}
        {{if (has-block 'decorator') 'cds--list-box__wrapper--decorator'}}"
      ...attributes
    >
      <label
        id={{this.labelId}}
        class="cds--label
          {{if @disabled 'cds--label--disabled'}}
          {{if @hideLabel 'cds--visually-hidden'}}"
      >{{@titleText}}</label>
      <ListBox
        class={{this.dropdownClasses}}
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
        <button
          type="button"
          id={{this.id}}
          class="cds--list-box__field"
          title={{this.triggerText}}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={{if this.isOpen "true" "false"}}
          aria-controls={{this.menuId}}
          aria-activedescendant={{this.activeDescendant}}
          aria-labelledby={{this.labelId}}
          aria-describedby={{this.describedBy}}
          aria-disabled={{if @readOnly "true"}}
          disabled={{@disabled}}
          {{on "click" this.handleTriggerClick}}
          {{on "keydown" this.handleTriggerKeydown}}
          {{on "focus" this.handleFocus}}
          {{on "blur" this.handleBlur}}
        >
          <span class="cds--list-box__label">{{this.triggerText}}</span>
          <ListBoxMenuIcon @isOpen={{this.isOpen}} />
        </button>
        {{#if (has-block "decorator")}}
          <div class="cds--list-box__inner-wrapper--decorator">
            {{yield (component AILabel size="mini") to="decorator"}}
          </div>
        {{/if}}
        <ListBoxMenu
          @id={{this.menuId}}
          aria-labelledby={{this.labelId}}
          {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus on the field, see preventMenuMouseDown }}
          {{on "mousedown" this.preventMenuMouseDown}}
        >
          {{#if this.isOpen}}
            {{#each @items as |item index|}}
              <ListBoxMenuItem
                id={{this.itemId index}}
                {{! eslint-disable-next-line ember/template-require-context-role -- ListBoxMenu is the role="listbox" }}
                role="option"
                aria-selected={{if (eq item this.selectedItem) "true" "false"}}
                @isActive={{eq item this.selectedItem}}
                @isHighlighted={{eq index this.highlightedIndex}}
                @title={{this.itemToString item}}
                {{on "click" (fn this.handleItemClick item)}}
                {{on "mouseenter" (fn this.setHighlighted index)}}
              >
                {{#if (has-block)}}
                  {{yield item}}
                {{else}}
                  {{this.itemToString item}}
                {{/if}}
                {{#if (eq item this.selectedItem)}}
                  <Checkmark
                    @size="16"
                    @svgClass="cds--list-box__menu-item__selected-icon"
                  />
                {{/if}}
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
