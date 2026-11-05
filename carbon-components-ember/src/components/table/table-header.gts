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
import AILabel from '../ai-label.gts';
import type { WithBoundArgs } from '@glint/template';

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
    /**
     * Classes for the `<th>`, and for a sortable header's button, as Carbon
     * React's `className`. `class` goes where the attributes go.
     */
    className?: string;
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
    /**
     * The header's label. A sortable header reads its text for the sort
     * description once, when it renders.
     */
    default: [];
    /**
     * **Experimental:** the column's AI label, shown after the header's
     * label. Yields an `AILabel` already sized for the header. The header
     * takes Carbon's AI column styles, so put only an AI label here.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
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

  // The label is the block's text, read once it renders: a label that
  // changes later keeps the sort description it had.
  setLabel = (element: HTMLElement) => {
    afterRender(this, () => {
      this.label = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
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
        class="{{@className}}
          cds--table-sort__header
          {{if
            (has-block 'decorator')
            'cds--table-sort__header--ai-label cds--table-sort__header--decorator'
          }}"
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
          class="{{@className}}
            cds--table-sort
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
        {{#if (has-block "decorator")}}
          <div class="cds--table-header-label--decorator-inner">
            {{yield (component AILabel size="mini") to="decorator"}}
          </div>
        {{/if}}
      </th>
    {{else}}
      <th
        id={{@id}}
        class={{@className}}
        colspan={{@colSpan}}
        scope={{this.scope}}
        ...attributes
      >
        {{#if (has-block)}}
          <div
            class="cds--table-header-label
              {{if
                (has-block 'decorator')
                'cds--table-header-label--slug cds--table-header-label--ai-label cds--table-header-label--decorator'
              }}"
          >
            {{yield}}
            <div class="cds--table-header-label--decorator-inner">
              {{#if (has-block "decorator")}}
                {{yield (component AILabel size="mini") to="decorator"}}
              {{/if}}
            </div>
          </div>
        {{/if}}
      </th>
    {{/if}}
  </template>
}
