/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import ArrowUp from '../icons/arrow-up.ts';
import ArrowsVertical from '../icons/arrows-vertical.ts';
import captureElement from '../../modifiers/capture-element.ts';
import { afterRender } from '../../utils/after-render.ts';

/** The directions a table can be sorted in, as Carbon React's `sortStates`. */
export const sortStates = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortState = (typeof sortStates)[keyof typeof sortStates];

export interface TableHeaderTranslateArgs {
  /** The header's label. */
  header: string;
  sortDirection?: SortState;
  isSortHeader?: boolean;
  sortStates: typeof sortStates;
}

export interface TableHeaderSignature {
  Element: HTMLTableCellElement | HTMLButtonElement;
  Args: {
    /** How many columns the header spans. */
    colSpan?: number;
    /** The `id` of the `<th>`. */
    id?: string;
    /** Whether the table is sorted by this header. */
    isSortHeader?: boolean;
    /**
     * Lets users sort by this header. The header renders a button, which
     * takes the attributes and modifiers, such as `{{on "click"}}`.
     */
    isSortable?: boolean;
    /** The `<th>`'s `scope`. Defaults to `col`. */
    scope?: string;
    /** The direction the table is sorted in, when this is the sort header. */
    sortDirection?: SortState;
    /**
     * Translates the sort button's description. It gets
     * `carbon.table.header.icon.description` and what that description names.
     */
    translateWithId?: (
      messageId: string,
      args: TableHeaderTranslateArgs,
    ) => string;
  };
  Blocks: {
    /** The header's label. */
    default: [];
  };
}

const ARIA_SORT = {
  NONE: 'none',
  ASC: 'ascending',
  DESC: 'descending',
} as const;

function defaultTranslateWithId(
  _messageId: string,
  { header, sortDirection, isSortHeader }: TableHeaderTranslateArgs,
) {
  if (isSortHeader) {
    if (sortDirection === sortStates.NONE) {
      return `Click to sort rows by ${header} header in ascending order`;
    }
    if (sortDirection === sortStates.ASC) {
      return `Click to sort rows by ${header} header in descending order`;
    }
    return `Click to unsort rows by ${header} header`;
  }
  return `Click to sort rows by ${header} header in ascending order`;
}

/**
 * A column header of a `TableHead`'s `TableRow`, as Carbon React's
 * `TableHeader`. A sortable one renders a button with the sort icons; keep
 * the sort state and handle the click yourself.
 */
export default class TableHeader extends Component<TableHeaderSignature> {
  @tracked label = '';

  descriptionId = `table-sort-${guidFor(this)}`;

  // The label is the block's text, read once it renders.
  setLabel = (element: HTMLElement) => {
    afterRender(this, () => {
      this.label = element.textContent ?? '';
    });
  };

  get scope() {
    return this.args.scope ?? 'col';
  }

  get isActive() {
    return Boolean(
      this.args.isSortHeader && this.args.sortDirection !== sortStates.NONE,
    );
  }

  get isDescending() {
    return Boolean(
      this.args.isSortHeader && this.args.sortDirection === sortStates.DESC,
    );
  }

  get ariaSort() {
    const { isSortHeader, sortDirection } = this.args;
    return !isSortHeader || !sortDirection ? 'none' : ARIA_SORT[sortDirection];
  }

  get sortDescription() {
    const translate = this.args.translateWithId ?? defaultTranslateWithId;
    return translate('carbon.table.header.icon.description', {
      header: this.label,
      sortDirection: this.args.sortDirection,
      isSortHeader: this.args.isSortHeader,
      sortStates,
    });
  }

  <template>
    {{#if @isSortable}}
      <th
        id={{@id}}
        aria-sort={{this.ariaSort}}
        class="cds--table-sort__header"
        colspan={{@colSpan}}
        scope={{this.scope}}
      >
        <div
          class="cds--table-sort__description"
          id={{this.descriptionId}}
        >{{this.sortDescription}}</div>
        <button
          type="button"
          aria-describedby={{this.descriptionId}}
          class="cds--table-sort
            {{if this.isActive 'cds--table-sort--active'}}
            {{if this.isDescending 'cds--table-sort--descending'}}"
          ...attributes
        >
          <span class="cds--table-sort__flex">
            <div
              class="cds--table-header-label"
              {{captureElement this.setLabel}}
            >
              {{yield}}
            </div>
            <ArrowUp @size="20" @svgClass="cds--table-sort__icon" />
            <ArrowsVertical
              @size="20"
              @svgClass="cds--table-sort__icon-unsorted"
            />
          </span>
        </button>
      </th>
    {{else}}
      <th id={{@id}} colspan={{@colSpan}} scope={{this.scope}} ...attributes>
        {{#if (has-block)}}
          <div class="cds--table-header-label">
            {{yield}}
            <div class="cds--table-header-label--decorator-inner"></div>
          </div>
        {{/if}}
      </th>
    {{/if}}
  </template>
}
