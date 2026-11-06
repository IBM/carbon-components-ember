/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import Search from '../search.gts';
import { afterRender } from '../../utils/after-render.ts';
import type { SearchSignature } from '../search.gts';
import type { TableToolbarSignature } from './table-toolbar.gts';

export type TableToolbarSearchTranslationId =
  | 'carbon.table.toolbar.search.label'
  | 'carbon.table.toolbar.search.placeholder';

/** Expands or collapses the search, as the handlers `@onFocus` and `@onBlur` replace do. */
export type TableToolbarSearchHandleExpand = (
  event: Event,
  newValue?: boolean,
) => void;

export interface TableToolbarSearchSignature {
  Element: SearchSignature['Element'];
  Args: {
    /** The input's `autocomplete`. Defaults to `off`. */
    autoComplete?: SearchSignature['Args']['autoComplete'];
    /** Classes for the search's wrapper. `class` and other attributes go on the `<input>`. */
    className?: string;
    /** Names the clear button. Defaults to "Clear search input". */
    closeButtonLabelText?: SearchSignature['Args']['closeButtonLabelText'];
    /** Starts the search expanded, when `@expanded` isn't set. */
    defaultExpanded?: boolean;
    /** The field's initial value. Calls `@onChange` with it once, as Carbon React does. */
    defaultValue?: string;
    /** Disables the search. */
    disabled?: boolean;
    /** Whether the search is expanded. When set, it is yours to keep: update it from `@onExpand`. */
    expanded?: boolean;
    /** The input's id. Defaults to a generated one. */
    id?: string;
    /** The input's label. Defaults to "Filter table". */
    labelText?: string;
    /** Replaces collapsing the search when it loses focus without a value. */
    onBlur?: (
      event: FocusEvent,
      handleExpand: TableToolbarSearchHandleExpand,
    ) => void;
    /**
     * Called with the `input` event and the field's value as it changes, and
     * with `''` and `@defaultValue` once at first.
     */
    onChange?: (
      event: '' | (Event & { target: HTMLInputElement }),
      value?: string,
    ) => void;
    /** Called once the field is cleared. */
    onClear?: () => void;
    /** Called when the search expands or collapses, with whether it now expands. */
    onExpand?: (event: Event, newExpand: boolean) => void;
    /** Replaces expanding the search when it gains focus. */
    onFocus?: (
      event: FocusEvent,
      handleExpand: TableToolbarSearchHandleExpand,
    ) => void;
    /** Keeps the search open, rather than expanding on focus. */
    persistent?: boolean;
    /** The input's placeholder. Defaults to "Filter table". */
    placeholder?: string;
    /** More classes for the search's wrapper. */
    searchContainerClass?: string;
    /** The search's size. Defaults to the toolbar's. */
    size?: SearchSignature['Args']['size'];
    /**
     * The size of the `TableToolbar` it is in, used without `@size`. Set by
     * the `TableToolbarContent` that yields it.
     */
    toolbarSize?: TableToolbarSignature['Args']['size'];
    /** Returns the text for each message. */
    translateWithId?: (id: TableToolbarSearchTranslationId) => string;
    /** The input's `type`. Defaults to `search`. */
    type?: SearchSignature['Args']['type'];
    /** The field's value. A new one replaces what was typed. */
    value?: SearchSignature['Args']['value'];
  };
}

const defaultTranslations: Record<TableToolbarSearchTranslationId, string> = {
  'carbon.table.toolbar.search.label': 'Filter table',
  'carbon.table.toolbar.search.placeholder': 'Filter table',
};

/**
 * The filter field of a `TableToolbar`, as Carbon React's `TableToolbarSearch`:
 * a search that expands when focused, unless `@persistent`.
 */
export default class TableToolbarSearch extends Component<TableToolbarSearchSignature> {
  @tracked private expandedState: boolean;
  @tracked private value: string;
  private uniqueId = `table-toolbar-search-${guidFor(this)}`;

  constructor(
    owner: ConstructorParameters<typeof Component>[0],
    args: TableToolbarSearchSignature['Args'],
  ) {
    super(owner, args);
    this.expandedState = Boolean(args.defaultExpanded || args.defaultValue);
    this.value = args.defaultValue ?? '';
    // After the render, as the callback may set state the render read.
    if (args.defaultValue) {
      afterRender(this, () => this.args.onChange?.('', args.defaultValue));
    }
  }

  get expanded() {
    return this.args.expanded ?? this.expandedState;
  }

  get size() {
    return this.args.size ?? this.args.toolbarSize;
  }

  get classes() {
    const { args } = this;
    return [
      args.className,
      args.searchContainerClass,
      args.disabled && 'cds--toolbar-search-container-disabled',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private t(id: TableToolbarSearchTranslationId) {
    return (this.args.translateWithId ?? ((i) => defaultTranslations[i]))(id);
  }

  get labelText() {
    return this.args.labelText || this.t('carbon.table.toolbar.search.label');
  }

  get placeholder() {
    return (
      this.args.placeholder || this.t('carbon.table.toolbar.search.placeholder')
    );
  }

  handleExpand: TableToolbarSearchHandleExpand = (
    event,
    newValue = !this.expanded,
  ) => {
    if (this.args.disabled) return;
    if (this.args.expanded === undefined && !this.args.persistent) {
      this.expandedState = newValue;
    }
    this.args.onExpand?.(event, newValue);
  };

  handleChange = (event: Event & { target: HTMLInputElement }) => {
    this.value = event.target.value;
    this.args.onChange?.(event, event.target.value);
  };

  handleFocus = (event: FocusEvent) => {
    if (this.args.onFocus) this.args.onFocus(event, this.handleExpand);
    else this.handleExpand(event, true);
  };

  handleBlur = (event: FocusEvent) => {
    if (this.args.onBlur) this.args.onBlur(event, this.handleExpand);
    else if (!this.value) this.handleExpand(event, false);
  };

  <template>
    <Search
      @autoComplete={{@autoComplete}}
      @className={{this.classes}}
      @closeButtonLabelText={{@closeButtonLabelText}}
      @defaultValue={{@defaultValue}}
      @disabled={{@disabled}}
      @expandable={{if @persistent false true}}
      @id={{if @id @id this.uniqueId}}
      @isExpanded={{this.expanded}}
      @labelText={{this.labelText}}
      @onChange={{this.handleChange}}
      @onClear={{@onClear}}
      @placeholder={{this.placeholder}}
      @size={{this.size}}
      @type={{@type}}
      @value={{@value}}
      tabindex="0"
      {{on "focus" this.handleFocus}}
      {{on "blur" this.handleBlur}}
      ...attributes
    />
  </template>
}
