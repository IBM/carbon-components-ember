/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { eq } from 'ember-truth-helpers';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import {
  ChevronDown,
  Checkmark,
  WarningFilled,
  WarningAltFilled,
} from '../icons.ts';

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
     * Convert an item to display text. Used both for the field button's
     * `title` attribute and, when no item block is supplied, as the default
     * rendering of each menu item. Defaults to reading a `label` property
     * off the item, falling back to an empty string.
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
     * next to its label and hides the label row.
     */
    type?: 'default' | 'inline';
    /**
     * The direction the menu should open in.
     */
    direction?: 'top' | 'bottom';
    /**
     * A component (for example `AILabel`) rendered inside the field.
     */
    decorator?: ComponentLike;
  };
  Blocks: {
    /**
     * Customize how each item renders in the menu. Falls back to
     * `itemToString(item)` when no block is supplied. The field button's own
     * text always uses `itemToString`, matching React's default behaviour
     * when `renderSelectedItem` is not passed.
     */
    default: [item: T];
  };
}

/**
 * `Dropdown` is a single-select field that opens a listbox of items on
 * click. It is built directly on Carbon's `ListBox` markup (no positioning
 * library is involved - `.cds--list-box__menu` is a plain descendant of
 * `.cds--list-box`, absolutely positioned by Carbon's own CSS) and manages
 * its own open/highlight state, rather than going through
 * `ember-power-select`; see the accompanying commit message for why.
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

  // Character-key typeahead: characters typed within `searchTimer`'s window
  // of each other accumulate into a single search query, mirroring
  // downshift's `getItemIndexByCharacterKey`.
  searchBuffer = '';
  searchAnchorIndex = -1;
  searchTimer?: ReturnType<typeof setTimeout>;

  constructor(owner: Owner, args: DropdownSignature<T>['Args']) {
    super(owner, args);
    this.internalSelectedItem = args.initialSelectedItem ?? null;
    registerDestructor(this, () => clearTimeout(this.searchTimer));
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

  get descriptionId() {
    return `${this.id}-description`;
  }

  @action
  itemId(index: number): string {
    return `${this.menuId}-item-${index}`;
  }

  get activeDescendant(): string | undefined {
    return this.isOpen && this.highlightedIndex >= 0
      ? this.itemId(this.highlightedIndex)
      : undefined;
  }

  get showHelperText() {
    return !!(this.args.helperText && !this.isInline);
  }

  get hasDescription() {
    return this.isInvalid || this.isWarn || this.showHelperText;
  }

  get selectedItem(): T | null {
    return this.args.selectedItem !== undefined
      ? this.args.selectedItem
      : this.internalSelectedItem;
  }

  get size() {
    return this.args.size ?? 'md';
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
    }
    if (this.args.decorator) {
      classes.push('cds--list-box__wrapper--decorator');
    }
    return classes.join(' ');
  }

  get boxClasses() {
    const classes = ['cds--dropdown', 'cds--list-box'];
    classes.push(`cds--dropdown--${this.size}`, `cds--list-box--${this.size}`);
    if (this.isInvalid) {
      classes.push('cds--dropdown--invalid', 'cds--list-box--invalid');
    } else if (this.isWarn) {
      classes.push('cds--dropdown--warning', 'cds--list-box--warning');
    }
    if (this.isOpen) {
      classes.push('cds--dropdown--open', 'cds--list-box--expanded');
    }
    if (this.isFocused) {
      classes.push('cds--dropdown--focus');
    }
    if (this.isInline) {
      classes.push('cds--dropdown--inline', 'cds--list-box--inline');
    }
    if (this.args.disabled) {
      classes.push('cds--dropdown--disabled', 'cds--list-box--disabled');
    }
    if (this.args.readOnly) {
      classes.push('cds--dropdown--readonly');
    }
    if (this.args.direction === 'top') {
      classes.push('cds--list-box--up');
    }
    return classes.join(' ');
  }

  @action
  itemToString(item: T): string {
    if (this.args.itemToString) {
      return this.args.itemToString(item);
    }
    if (typeof item === 'string') return item;
    if (typeof item === 'number') return `${item}`;
    if (
      item !== null &&
      typeof item === 'object' &&
      'label' in item &&
      typeof (item as Record<string, unknown>)['label'] === 'string'
    ) {
      return (item as Record<string, unknown>)['label'] as string;
    }
    return '';
  }

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

  @action
  selectItem(item: T) {
    if (this.args.selectedItem === undefined) {
      this.internalSelectedItem = item;
    }
    this.args.onChange?.({ selectedItem: item });
    this.close();
  }

  @action
  handleTriggerClick() {
    if (this.args.disabled || this.args.readOnly) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.openMenu();
    }
  }

  @action
  handleTriggerKeydown(event: KeyboardEvent) {
    if (this.args.disabled || this.args.readOnly) return;
    const items = this.args.items;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openMenu();
        } else if (items.length) {
          this.highlightedIndex = Math.min(
            this.highlightedIndex + 1,
            items.length - 1,
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.openMenu();
        } else if (items.length) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
      case 'Enter':
      case ' ':
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
        if (this.isOpen && items.length) {
          event.preventDefault();
          this.highlightedIndex = 0;
        }
        break;
      case 'End':
        if (this.isOpen && items.length) {
          event.preventDefault();
          this.highlightedIndex = items.length - 1;
        }
        break;
      case 'Tab':
        if (this.isOpen) {
          this.close();
        }
        break;
      default:
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          this.handleCharacterKey(event.key);
        }
        break;
    }
  }

  // Jumps the highlight (or, when closed, the selection) to the next item
  // whose text starts with the characters typed so far, the same
  // native-`<select>`-like behavior downshift's `useSelect` provides by
  // default.
  handleCharacterKey(key: string) {
    const items = this.args.items;
    if (!items.length) return;

    clearTimeout(this.searchTimer);
    const currentIndex = this.isOpen
      ? this.highlightedIndex
      : this.selectedItem !== null
        ? items.indexOf(this.selectedItem)
        : -1;
    if (!this.searchBuffer) {
      this.searchAnchorIndex = currentIndex;
    }
    this.searchBuffer += key.toLowerCase();
    this.searchTimer = setTimeout(() => {
      this.searchBuffer = '';
      this.searchAnchorIndex = -1;
    }, 500);

    // A run of the same repeated character (e.g. "b", "b", "b") cycles
    // through every item starting with that character, one per keypress,
    // instead of narrowing to items starting with "bbb".
    const isRepeatedChar =
      this.searchBuffer.length > 1 &&
      [...this.searchBuffer].every((char) => char === this.searchBuffer[0]);
    const query = isRepeatedChar
      ? (this.searchBuffer[0] as string)
      : this.searchBuffer;
    const startAfter = isRepeatedChar ? currentIndex : this.searchAnchorIndex;

    for (let offset = 1; offset <= items.length; offset++) {
      const index = (startAfter + offset + items.length) % items.length;
      const text = this.itemToString(items[index] as T).toLowerCase();
      if (text.startsWith(query)) {
        if (this.isOpen) {
          this.highlightedIndex = index;
        } else {
          this.selectItem(items[index] as T);
        }
        return;
      }
    }
  }

  @action
  handleItemClick(item: T) {
    if (this.args.disabled || this.args.readOnly) return;
    this.selectItem(item);
  }

  @action
  setHighlighted(index: number) {
    this.highlightedIndex = index;
  }

  @action
  handleFocus() {
    this.isFocused = true;
  }

  @action
  handleBlur() {
    this.isFocused = false;
    // Only the field button is ever focusable, so a blur means focus moved
    // somewhere else entirely (another field, Tab, or a click outside) -
    // `preventMenuMouseDown` below stops a click on a menu item from
    // triggering this in the first place.
    this.close();
  }

  @action
  preventMenuMouseDown(event: MouseEvent) {
    // Keeps focus on the field button when clicking an item, the same way
    // downshift does - otherwise the button would blur (and the menu would
    // close, see `handleBlur`) before the item's own click handler runs.
    event.preventDefault();
  }

  <template>
    <div class={{this.wrapperClasses}} ...attributes>
      <label
        id={{this.labelId}}
        class='cds--label
          {{if @disabled "cds--label--disabled"}}
          {{if @hideLabel "cds--visually-hidden"}}'
      >{{@titleText}}</label>
      <div class={{this.boxClasses}} data-invalid={{if this.isInvalid 'true'}}>
        {{#if this.isInvalid}}
          <WarningFilled @size='16' @svgClass='cds--list-box__invalid-icon' />
        {{else if this.isWarn}}
          <WarningAltFilled
            @size='16'
            @svgClass='cds--list-box__invalid-icon cds--list-box__invalid-icon--warning'
          />
        {{/if}}
        <button
          type='button'
          id={{this.id}}
          class='cds--list-box__field'
          title={{this.triggerText}}
          role='combobox'
          aria-haspopup='listbox'
          aria-expanded={{if this.isOpen 'true' 'false'}}
          aria-controls={{this.menuId}}
          aria-activedescendant={{this.activeDescendant}}
          aria-labelledby='{{this.labelId}} {{this.id}}'
          aria-describedby={{if this.hasDescription this.descriptionId}}
          aria-disabled={{if @readOnly 'true'}}
          disabled={{@disabled}}
          {{on 'click' this.handleTriggerClick}}
          {{on 'keydown' this.handleTriggerKeydown}}
          {{on 'focus' this.handleFocus}}
          {{on 'blur' this.handleBlur}}
        >
          <span class='cds--list-box__label'>{{this.triggerText}}</span>
          <div
            class='cds--list-box__menu-icon
              {{if this.isOpen "cds--list-box__menu-icon--open"}}'
          >
            <ChevronDown @size='16' @svgClass='cds--list-box__menu-icon__svg' />
          </div>
        </button>
        {{#if @decorator}}
          <div class='cds--list-box__inner-wrapper--decorator'>
            <@decorator />
          </div>
        {{/if}}
        {{! template-lint-disable no-invalid-interactive }}
        {{! template-lint-disable no-pointer-down-event-binding }}
        <ul
          id={{this.menuId}}
          role='listbox'
          class='cds--list-box__menu'
          aria-labelledby={{this.id}}
          {{on 'mousedown' this.preventMenuMouseDown}}
        >
          {{#each @items as |item index|}}
            {{! template-lint-disable require-presentational-children }}
            <li
              id={{this.itemId index}}
              role='option'
              class='cds--list-box__menu-item
                {{if (eq item this.selectedItem) "cds--list-box__menu-item--active"}}
                {{if (eq index this.highlightedIndex) "cds--list-box__menu-item--highlighted"}}'
              aria-selected={{if (eq item this.selectedItem) 'true' 'false'}}
              title={{this.itemToString item}}
              {{on 'click' (fn this.handleItemClick item)}}
              {{on 'mouseenter' (fn this.setHighlighted index)}}
            >
              <div class='cds--list-box__menu-item__option'>
                {{#if (has-block)}}
                  {{yield item}}
                {{else}}
                  {{this.itemToString item}}
                {{/if}}
                <span aria-hidden='true'>
                  <Checkmark
                    @size='16'
                    @svgClass='cds--list-box__menu-item__selected-icon'
                  />
                </span>
              </div>
            </li>
          {{/each}}
        </ul>
      </div>
      {{#if this.isInvalid}}
        <div id={{this.descriptionId}} class='cds--form-requirement'>{{@invalidText}}</div>
      {{else if this.isWarn}}
        <div id={{this.descriptionId}} class='cds--form-requirement'>{{@warnText}}</div>
      {{else if this.showHelperText}}
        <div
          id={{this.descriptionId}}
          class='cds--form__helper-text {{if @disabled "cds--form__helper-text--disabled"}}'
        >{{@helperText}}</div>
      {{/if}}
    </div>
  </template>
}
