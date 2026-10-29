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
import Checkmark from './icons/checkmark.ts';
import WarningFilled from './icons/warning-filled.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import AILabel from './ai-label.gts';
import ListBox from './-private/list-box/list-box.gts';
import type { ListBoxSize } from './-private/list-box/list-box.gts';
import ListBoxMenu from './-private/list-box/list-box-menu.gts';
import ListBoxMenuItem from './-private/list-box/list-box-menu-item.gts';
import ListBoxSelection from './-private/list-box/list-box-selection.gts';
import ListBoxTrigger from './-private/list-box/list-box-trigger.gts';
import {
  positionMenu,
  scrollToHighlighted,
} from './-private/list-box/menu-modifiers.ts';
import {
  defaultItemToString,
  enabledIndex,
  isItemDisabled,
  nextEnabledIndex,
} from './-private/list-box/items.ts';
import { afterRender } from '../utils/after-render.ts';
import type { WithBoundArgs } from '@glint/template';
import type {
  FieldValidationArgs,
  FieldHelperArgs,
} from './-private/field.gts';

export interface ComboBoxChange<T> {
  /**
   * The selected item, or null when the selection was cleared. With
   * `@allowCustomValue`, the text typed when it matches no item.
   */
  selectedItem: T | null;
  /**
   * The input's text. Sent with the changes `@allowCustomValue` makes from
   * what was typed, and when `@selectedItem` changes from outside.
   */
  inputValue?: string;
}

export interface ComboBoxSignature<T> {
  Element: HTMLInputElement;
  Args: FieldValidationArgs &
    FieldHelperArgs & {
      /**
       * Classes for the wrapper, as Carbon React's `className`. `class` and the
       * other attributes go on the `<input>`.
       */
      className?: string;
      /**
       * The id of the input. The label, menu and items derive theirs from it,
       * so pass it as `@id`: an `id` attribute is ignored. Auto-generated when
       * omitted.
       */
      id?: string;
      /**
       * The items to choose from. They can be any value: `@itemToString` turns
       * one into its text.
       */
      items: T[];
      /**
       * Turns an item into the text shown for it, in the input and the menu.
       * Defaults to a string or number item itself, or an object's string
       * `label`. Items with `disabled: true` can't be chosen.
       */
      itemToString?: (item: T) => string;
      /**
       * The field's label. Without it, the input is labelled "Choose an item";
       * set `aria-label` on the component to change that.
       */
      titleText?: string;
      /** Text shown in the input while it's empty. */
      placeholder?: string;
      /**
       * The selected item, for full control of the selection: pair it with
       * `@onChange`. Wins over internal state whenever it's defined.
       */
      selectedItem?: T | null;
      /**
       * The item selected at first, for the uncontrolled case. Later changes
       * are ignored.
       */
      initialSelectedItem?: T;
      /**
       * Called when the selection changes, whether the user changed it or
       * `@selectedItem` did.
       */
      onChange?: (data: ComboBoxChange<T>) => void;
      /**
       * Called with the input's text whenever it changes, to load the items
       * that match it, say.
       */
      onInputChange?: (inputText: string) => void;
      /** Called when the button that opens and closes the menu is clicked. */
      onToggleClick?: (event: MouseEvent) => void;
      /**
       * Whether to list an item for the text typed. Defaults to listing every
       * item. Ignored with `@typeahead`.
       */
      shouldFilterItem?: (input: {
        item: T;
        itemToString: (item: T) => string;
        inputValue: string;
      }) => boolean;
      /**
       * Keep text that matches no item as the value, rather than clearing it
       * when the field loses focus.
       */
      allowCustomValue?: boolean;
      /**
       * **Experimental:** list only the items that start with the text typed,
       * and complete it with the first one; Tab accepts it.
       */
      typeahead?: boolean;
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
      /** Specify if the control should be disabled, or not. */
      disabled?: boolean;
    };
  Blocks: {
    /**
     * Renders each item in the menu. Defaults to its text; the input always
     * shows `@itemToString`'s.
     */
    default: [item: T];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * field. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/**
 * `ComboBox` is a text input that filters a listbox of items, for choosing
 * from a long list or typing a value. Like Carbon React's, it's built on the
 * internal ListBox parts and follows downshift's `useCombobox` keyboard
 * model: focus stays in the input while the arrow keys move the highlight
 * (`aria-activedescendant`), and Enter or Tab chooses the highlighted item.
 * Attributes on the component, `class` included, go to the input.
 *
 * ```gjs
 * import { ComboBox } from 'carbon-components-ember/components';
 *
 * <template>
 *   <ComboBox
 *     @titleText='Fruit'
 *     @items={{array 'Apple' 'Banana' 'Cherry'}}
 *     @onChange={{this.handleChange}}
 *   />
 * </template>
 * ```
 */
export default class ComboBox<T> extends Component<ComboBoxSignature<T>> {
  @tracked isOpen = false;
  @tracked highlightedIndex = -1;
  @tracked isFocused = false;
  @tracked internalSelectedItem: T | null;
  // Text the input shows instead of the selection's, until the selection
  // changes: what was typed, or what a blur kept.
  @tracked edit: { text: string; selection: T | null } | null = null;
  // With @typeahead, the rest of the first item starting with the text
  // typed, shown selected after it.
  @tracked suggestion = '';

  guid = guidFor(this);

  #input?: HTMLInputElement;
  // The selection this field last reported, so @selectedItem changing to
  // anything else is reported too, as Carbon React does.
  #knownSelection: T | null;
  #reportedInput?: string;
  #committedCustomValue = '';
  #pointerPressed = false;

  constructor(owner: Owner, args: ComboBoxSignature<T>['Args']) {
    super(owner, args);
    this.internalSelectedItem = args.initialSelectedItem ?? null;
    this.#knownSelection =
      args.selectedItem !== undefined
        ? args.selectedItem
        : this.internalSelectedItem;
  }

  get id() {
    return this.args.id ?? `combo-box-${this.guid}`;
  }

  get labelId() {
    return `${this.id}-label`;
  }

  get menuId() {
    return `${this.id}-menu`;
  }

  get toggleId() {
    return `${this.id}-toggle-button`;
  }

  get helperId() {
    return `combobox-helper-text-${this.guid}`;
  }

  get warnId() {
    return `combobox-warn-text-${this.guid}`;
  }

  get invalidId() {
    return `combobox-invalid-text-${this.guid}`;
  }

  itemId = (index: number): string => `${this.menuId}-item-${index}`;

  get selectedItem(): T | null {
    return this.args.selectedItem !== undefined
      ? this.args.selectedItem
      : this.internalSelectedItem;
  }

  get inputValue(): string {
    const { edit } = this;
    return edit && edit.selection === this.selectedItem
      ? edit.text
      : this.label(this.selectedItem);
  }

  @cached
  get filteredItems(): T[] {
    const { items, typeahead, shouldFilterItem } = this.args;
    const inputValue = this.inputValue;
    if (typeahead) {
      const typed = inputValue.toLowerCase();
      return items.filter((item) =>
        this.label(item).toLowerCase().startsWith(typed),
      );
    }
    if (!shouldFilterItem) return items;
    return items.filter((item) =>
      shouldFilterItem({ item, itemToString: this.label, inputValue }),
    );
  }

  get direction() {
    return this.args.direction ?? 'bottom';
  }

  get floatsMenu() {
    return Boolean(this.args.autoAlign && this.isOpen);
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
    return Boolean(this.args.helperText) && !this.isInvalid && !this.isWarn;
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

  // ComboBox's own classes; ListBox adds the list-box ones.
  get comboBoxClasses() {
    const classes = ['cds--combo-box'];
    if (this.args.invalid && this.isFocused) {
      classes.push('cds--combo-box--invalid--focused');
    }
    if (this.args.direction === 'top') classes.push('cds--list-box--up');
    if (this.isWarn) classes.push('cds--combo-box--warning');
    if (this.args.readOnly) classes.push('cds--combo-box--readonly');
    if (this.args.autoAlign) classes.push('cds--autoalign');
    return classes.join(' ');
  }

  get inputClasses() {
    const classes = ['cds--text-input'];
    if (!this.inputValue) classes.push('cds--text-input--empty');
    if (this.isFocused) classes.push('cds--combo-box--input--focus');
    return classes.join(' ');
  }

  label = (item: T | null): string => {
    if (item === null) return '';
    return (this.args.itemToString ?? defaultItemToString)(item);
  };

  close() {
    this.isOpen = false;
    this.highlightedIndex = -1;
  }

  // As downshift, the highlight starts on the selected item, or with the
  // arrow keys, on the first or last item.
  #open(offset: number) {
    this.isOpen = true;
    const items = this.filteredItems;
    const last = items.length - 1;
    if (this.selectedItem !== null) {
      this.highlightedIndex = items.indexOf(this.selectedItem);
    } else if (offset < 0 && last >= 0 && !isItemDisabled(items[last])) {
      this.highlightedIndex = last;
    } else if (offset > 0 && last >= 0 && !isItemDisabled(items[0])) {
      this.highlightedIndex = 0;
    } else {
      this.highlightedIndex = -1;
    }
  }

  // As Carbon React's toggle: closing drops text that matches no item,
  // unless custom values are allowed.
  #toggle() {
    if (!this.isOpen) {
      this.#open(0);
      return;
    }
    this.close();
    if (!this.args.allowCustomValue && !this.#matchesItem(this.inputValue)) {
      this.#showText(this.label(this.selectedItem));
    }
  }

  // The input shows `text` until the selection changes.
  #showText(text: string) {
    this.edit = { text, selection: this.selectedItem };
    this.suggestion = '';
  }

  #setSelection(item: T | null) {
    this.#knownSelection = item;
    if (this.args.selectedItem === undefined) this.internalSelectedItem = item;
  }

  // Selects `item`, or clears the selection with null, showing its text,
  // and reports the change.
  #select(item: T | null) {
    const changed = item !== this.selectedItem;
    this.#setSelection(item);
    this.#showText(this.label(item));
    if (changed) this.args.onChange?.({ selectedItem: item });
  }

  #matchesItem(text: string) {
    return (
      Boolean(text) && this.args.items.some((item) => this.label(item) === text)
    );
  }

  // The first enabled item containing `text`, which typing highlights.
  #indexToHighlight(text: string) {
    if (!text) return -1;
    const typed = text.toLowerCase();
    return this.filteredItems.findIndex(
      (item) =>
        !isItemDisabled(item) && this.label(item).toLowerCase().includes(typed),
    );
  }

  #suggest(previous: string, text: string) {
    if (!text || text === previous || text.length < previous.length) return '';
    const typed = text.toLowerCase();
    const match = this.args.items.find(
      (item) =>
        !isItemDisabled(item) &&
        this.label(item).toLowerCase().startsWith(typed),
    );
    return match === undefined ? '' : this.label(match).slice(text.length);
  }

  handleInput = (event: Event) => {
    const text = (event.target as HTMLInputElement).value;
    const previous = this.inputValue;
    const clearsCustomValue =
      this.args.allowCustomValue &&
      this.#committedCustomValue !== '' &&
      previous === this.#committedCustomValue &&
      text === '';
    this.#showText(text);
    this.isOpen = true;
    this.highlightedIndex = this.#indexToHighlight(text);
    if (this.args.typeahead) this.suggestion = this.#suggest(previous, text);
    if (clearsCustomValue) {
      this.#committedCustomValue = '';
      this.#setSelection(null);
      this.#showText('');
      this.args.onChange?.({ selectedItem: null, inputValue: '' });
    }
  };

  handleInputClick = (event: MouseEvent) => {
    if (this.args.readOnly) {
      event.preventDefault();
      return;
    }
    if (this.isOpen) {
      this.close();
    } else {
      this.#open(0);
    }
  };

  handleKeydown = (event: KeyboardEvent) => {
    // Keys that build or confirm an IME composition (Japanese, say) belong
    // to it; as downshift, Enter then doesn't choose. Safari's last keydown
    // of a composition is only marked by keyCode.
    if (event.isComposing || event.keyCode === 229) return;
    if (this.args.readOnly) {
      // As in Carbon React, only Tab works on a read-only field.
      if (event.key !== 'Tab') event.preventDefault();
      return;
    }
    switch (event.key) {
      case ' ':
        // A space typed mustn't also toggle an enclosing control.
        event.stopPropagation();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        this.#arrow(event.key === 'ArrowDown' ? 1 : -1, event.altKey);
        break;
      case 'PageDown':
      case 'PageUp':
        if (this.isOpen) {
          event.preventDefault();
          this.highlightedIndex = nextEnabledIndex(
            this.filteredItems,
            this.highlightedIndex,
            event.key === 'PageDown' ? 10 : -10,
          );
        }
        break;
      case 'Home':
      case 'End':
        this.#homeOrEnd(event);
        break;
      case 'Escape':
        this.#escape(event);
        break;
      case 'Enter':
        this.#enter(event);
        break;
      case 'Tab':
        this.#completeTypeahead();
        break;
    }
  };

  #arrow(offset: number, altKey: boolean) {
    if (altKey) {
      // Alt+Down opens the menu without moving the highlight; Alt+Up
      // closes it.
      if (offset > 0 ? !this.isOpen : this.isOpen) this.#toggle();
      return;
    }
    const items = this.filteredItems;
    if (this.isOpen) {
      this.highlightedIndex = nextEnabledIndex(
        items,
        this.highlightedIndex,
        offset,
      );
    } else {
      this.#open(offset);
    }
    if (this.highlightedIndex < 0)
      this.highlightedIndex = enabledIndex(items, 0);
  }

  // Moves the caret, and in the open menu, the highlight to the first or
  // last item.
  #homeOrEnd(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const toStart = event.key === 'Home';
    if (event.code !== (toStart ? 'Numpad7' : 'Numpad1')) {
      const caret = toStart ? 0 : input.value.length;
      input.setSelectionRange(caret, caret);
    }
    if (!this.isOpen) return;
    event.preventDefault();
    const items = this.filteredItems;
    this.highlightedIndex = toStart
      ? enabledIndex(items, 0)
      : enabledIndex(items, items.length - 1, true);
  }

  #escape(event: KeyboardEvent) {
    if (this.isOpen) {
      event.preventDefault();
      if (this.inputValue) {
        this.#toggle();
      } else {
        this.close();
      }
    } else if (this.inputValue || this.selectedItem !== null) {
      // As downshift, Escape clears a closed field.
      event.preventDefault();
      this.#select(null);
    }
  }

  #enter(event: KeyboardEvent) {
    const text = this.inputValue;
    const highlighted = this.filteredItems[this.highlightedIndex];
    if (!text || this.args.allowCustomValue) {
      if (!this.isOpen) {
        // Opens the menu. An empty field also loses its selection.
        if (!text) this.#select(null);
        this.#open(0);
        if (!text) this.highlightedIndex = -1;
        return;
      }
      event.preventDefault();
      this.close();
      if (highlighted !== undefined) {
        this.#select(highlighted);
      } else if (text) {
        this.#committedCustomValue = text;
        this.args.onChange?.({ selectedItem: null, inputValue: text });
      } else {
        this.#select(null);
      }
      return;
    }
    if (!this.isOpen) return;
    event.preventDefault();
    const match =
      highlighted !== undefined && !isItemDisabled(highlighted)
        ? highlighted
        : this.filteredItems[this.#indexToHighlight(text)];
    if (match !== undefined) {
      this.close();
      this.#select(match);
    } else if (this.selectedItem !== null) {
      // Text that matches no item clears the selection, and stays.
      this.close();
      this.#setSelection(null);
      this.#showText(text);
      this.args.onChange?.({ selectedItem: null });
    }
    // Otherwise the menu stays open.
  }

  #completeTypeahead() {
    if (!this.args.typeahead || !this.isOpen) return;
    const typed = this.inputValue.toLowerCase();
    const match = this.args.items.find(
      (item) =>
        !isItemDisabled(item) &&
        this.label(item).toLowerCase().startsWith(typed),
    );
    if (match === undefined) return;
    this.close();
    this.#select(match);
  }

  handleBlur = (event: FocusEvent) => {
    const leftEmpty = (event.target as HTMLInputElement).value === '';
    if (this.isOpen) {
      // As downshift, leaving with the keyboard chooses the highlighted
      // item; a press elsewhere, or the window losing focus, doesn't.
      const windowBlurred =
        event.relatedTarget === null &&
        document.activeElement !== document.body;
      this.#closeOnBlur(!this.#pointerPressed && !windowBlurred, leftEmpty);
    }
    // As in Carbon React, a field left empty loses its selection.
    if (leftEmpty && this.selectedItem !== null) this.#select(null);
  };

  #closeOnBlur(selectHighlighted: boolean, leftEmpty: boolean) {
    const text = this.inputValue;
    const highlighted = selectHighlighted
      ? this.filteredItems[this.highlightedIndex]
      : undefined;
    const selection =
      highlighted !== undefined ? highlighted : this.selectedItem;
    this.close();
    if (this.args.allowCustomValue) {
      const { items } = this.args;
      const next =
        selection !== null &&
        this.label(selection) === text &&
        items.includes(selection)
          ? selection
          : text === ''
            ? null
            : (items.find((item) => this.label(item) === text) ??
              (text as unknown as T));
      if (next !== this.selectedItem) {
        this.#setSelection(next);
        this.#committedCustomValue =
          next !== null && !items.includes(next) ? text : '';
        this.args.onChange?.({ selectedItem: next, inputValue: text });
      }
      this.#showText(text);
      return;
    }
    if (!leftEmpty && text && selection !== null) {
      // The selection's text replaces what was typed.
      this.#select(selection);
    } else if (!this.#matchesItem(text)) {
      this.#showText(this.label(this.selectedItem));
    }
  }

  handleToggleClick = (event: MouseEvent) => {
    this.args.onToggleClick?.(event);
    this.#toggle();
    this.#input?.focus();
  };

  handleItemClick = (item: T) => {
    if (isItemDisabled(item)) return;
    this.close();
    this.#select(item);
  };

  clearSelection = () => {
    this.close();
    this.#committedCustomValue = '';
    this.#setSelection(null);
    this.#showText('');
    this.args.onChange?.({ selectedItem: null });
    this.#input?.focus();
  };

  // Keeps focus in the input when the menu, its button or the clear button
  // is pressed, as downshift does.
  keepFocus = (event: MouseEvent) => {
    event.preventDefault();
  };

  handleFocusIn = () => {
    this.isFocused = true;
  };

  handleFocusOut = () => {
    this.isFocused = false;
  };

  // Shows the typeahead suggestion after the text typed, and reports the
  // text changing after the render, as Carbon React's effects do.
  syncInput = modifier(
    (
      input: HTMLInputElement,
      [value, suggestion]: [value: string, suggestion: string],
    ) => {
      this.#input = input;
      if (suggestion) {
        input.value = value + suggestion;
        input.setSelectionRange(value.length, value.length + suggestion.length);
      }
      if (this.#reportedInput === undefined) {
        this.#reportedInput = value;
      } else if (value !== this.#reportedInput) {
        this.#reportedInput = value;
        afterRender(this, () => this.args.onInputChange?.(value));
      }
    },
  );

  // Reports @selectedItem changing from outside when that changes the text,
  // as Carbon React does, so a new but equal item isn't reported.
  syncSelection = modifier(
    (
      _input: HTMLInputElement,
      [selected]: [selected: T | null | undefined],
    ) => {
      if (selected === undefined || selected === this.#knownSelection) return;
      const previous = this.#knownSelection;
      const { edit } = this;
      const shown =
        edit && edit.selection === previous ? edit.text : this.label(previous);
      this.#knownSelection = selected;
      const text = this.label(selected);
      if (text === shown) return;
      afterRender(this, () =>
        this.args.onChange?.({ selectedItem: selected, inputValue: text }),
      );
    },
  );

  // While the menu is open, notes whether a press, rather than the
  // keyboard, is what moves focus away.
  trackPointer = modifier(() => {
    const pressed = () => {
      this.#pointerPressed = true;
    };
    const typed = () => {
      this.#pointerPressed = false;
    };
    document.addEventListener('pointerdown', pressed, true);
    document.addEventListener('mousedown', pressed, true);
    document.addEventListener('keydown', typed, true);
    return () => {
      document.removeEventListener('pointerdown', pressed, true);
      document.removeEventListener('mousedown', pressed, true);
      document.removeEventListener('keydown', typed, true);
      this.#pointerPressed = false;
    };
  });

  <template>
    <div
      class="cds--list-box__wrapper
        {{if (has-block 'decorator') 'cds--list-box__wrapper--decorator'}}
        {{@className}}"
    >
      {{#if @titleText}}
        <label
          id={{this.labelId}}
          for={{this.id}}
          class="cds--label {{if @disabled 'cds--label--disabled'}}"
        >{{@titleText}}</label>
      {{/if}}
      <ListBox
        class={{this.comboBoxClasses}}
        @size={{@size}}
        @disabled={{@disabled}}
        @isOpen={{this.isOpen}}
        @invalid={{this.isInvalid}}
        @invalidText={{@invalidText}}
        @invalidTextId={{this.invalidId}}
        @warn={{this.isWarn}}
        @warnText={{@warnText}}
        @warnTextId={{this.warnId}}
        {{on "focusin" this.handleFocusIn}}
        {{on "focusout" this.handleFocusOut}}
      >
        <div class="cds--list-box__field">
          <input
            class={{this.inputClasses}}
            type="text"
            tabindex="0"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded={{if this.isOpen "true" "false"}}
            aria-controls={{this.menuId}}
            aria-activedescendant={{this.activeDescendant}}
            aria-labelledby={{if @titleText this.labelId}}
            aria-label={{unless @titleText "Choose an item"}}
            autocomplete="off"
            title={{this.inputValue}}
            placeholder={{@placeholder}}
            value={{this.inputValue}}
            ...attributes
            id={{this.id}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-describedby={{this.describedBy}}
            {{on "input" this.handleInput}}
            {{on "keydown" this.handleKeydown}}
            {{on "click" this.handleInputClick}}
            {{on "blur" this.handleBlur}}
            {{this.syncSelection @selectedItem}}
            {{this.syncInput this.inputValue this.suggestion}}
            {{(if this.isOpen this.trackPointer)}}
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
              @clearSelection={{this.clearSelection}}
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
            disabled={{or @disabled @readOnly}}
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
          aria-label={{unless @titleText "Choose an item"}}
          {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding -- keeps focus in the input, see keepFocus }}
          {{on "mousedown" this.keepFocus}}
          {{scrollToHighlighted this.highlightedIndex}}
          {{(if this.floatsMenu positionMenu) placement=this.direction}}
        >
          {{#if this.isOpen}}
            {{#each this.filteredItems as |item index|}}
              <ListBoxMenuItem
                id={{this.itemId index}}
                {{! eslint-disable-next-line ember/template-require-context-role -- ListBoxMenu is the role="listbox" }}
                role="option"
                aria-selected={{if (eq item this.selectedItem) "true" "false"}}
                @disabled={{isItemDisabled item}}
                @isActive={{eq item this.selectedItem}}
                @isHighlighted={{eq index this.highlightedIndex}}
                @title={{this.label item}}
                {{on "click" (fn this.handleItemClick item)}}
              >
                {{#if (has-block)}}
                  {{yield item}}
                {{else}}
                  {{this.label item}}
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
