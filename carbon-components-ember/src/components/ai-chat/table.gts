/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as Search } from '../search.gts';
import { default as Pagination } from '../pagination.gts';
import { default as Button } from '../button.gts';
import { default as Tooltip } from '../tooltip.gts';
import { default as Download } from '../icons/download.ts';
import { stringifyCSV } from './-csv.ts';
import type { ComponentLike } from '@glint/template';

export type AiChatTableCell = {
  text: string;
  /** Optional rich content rendered instead of `text`. */
  component?: ComponentLike;
};

export type AiChatTableRow = {
  cells: AiChatTableCell[];
};

type Slice = {
  page: number;
  itemsPerPage: number;
  start: number;
  end: number;
};

export type Args = {
  tableTitle?: string;
  tableDescription?: string;
  headers?: AiChatTableCell[];
  rows?: AiChatTableRow[];
  loading?: boolean;
  filterPlaceholderText?: string;
  previousPageText?: string;
  nextPageText?: string;
  /**
   * Text for the pagination's "items per page" label. Accepted for parity
   * with upstream, but not wired: the shared `Pagination` component this
   * addon already has hardcodes that label rather than accepting an
   * override, and changing `Pagination` itself is out of scope here.
   */
  itemsPerPageText?: string;
  downloadLabelText?: string;
  /** BCP 47 locale used for sorting column values via `Intl.Collator`. */
  locale?: string;
  /**
   * Initial page size. Upstream calculates this from the rendered
   * component's width (10 above ~400px, 5 below); this port skips that
   * DOM-measurement heuristic and simply defaults to `5`.
   */
  defaultPageSize?: number;
  /** Accepted for parity; not wired, see `itemsPerPageText` above. */
  getPaginationSupplementalText?: (info: { count: number }) => string;
  /** Accepted for parity; not wired, see `itemsPerPageText` above. */
  getPaginationStatusText?: (info: {
    start: number;
    end: number;
    count: number;
  }) => string;
};

export interface AiChatTableSignature {
  Element: HTMLDivElement;
  Args: Args;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50];

/**
 * Sortable, filterable, paginated data table for Carbon AI Chat, with a
 * CSV download action.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-table`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/table).
 * Upstream is always internally-controlled (no `@onChange`-style callback
 * exists for sort/filter/page state, confirmed via the published
 * `custom-elements.json` manifest), so this port keeps all of that state
 * internal too rather than inventing controlled props upstream doesn't
 * have.
 *
 * Reuses this addon's own `Search`/`Pagination`/`Button` components rather
 * than upstream's DOM-attribute `data-hidden` row-hiding trick, which only
 * exists because upstream renders through Carbon Web Components' own
 * `cds-table`/`cds-pagination` custom elements.
 *
 * Upstream also accepts a `data-rounded` attribute (set by an outer shell)
 * that clips/rounds the table's own corners via `overflow: hidden`. Not
 * exposed here for the same reason `AiChatCard` doesn't expose it either —
 * nothing in this port provides that outer shell context.
 */
export default class AiChatTable extends Component<AiChatTableSignature> {
  @tracked filterTerm = '';
  @tracked sortColumnIndex: number | null = null;
  @tracked sortDirection: 'ascending' | 'descending' = 'ascending';
  @tracked rowsPerPageChanged = false;
  @tracked currentSlice: Slice = {
    page: 1,
    itemsPerPage: this.args.defaultPageSize ?? 5,
    start: 0,
    end: this.args.defaultPageSize ?? 5,
  };

  // The shared `Pagination` component's own initial `itemsPerPage` (10)
  // is a hardcoded field default, not derived from `@state` - its
  // `didInsert`-triggered first `pageChanged()` call always reports that
  // default rather than the value we seeded above. Override just that
  // one initial report back to `@defaultPageSize`; every later call is a
  // real, user-driven page/size change and is trusted as-is.
  //
  // `Pagination` is only rendered while `showPagination` is true, and that
  // can flip back to `false` and then `true` again purely from search
  // filtering (independent of any real page-size change), remounting a
  // brand-new `Pagination` instance that fires its own fresh initial
  // report. Reset the guard on unmount (not on the next mount - a child
  // component's `didInsert` fires before a parent/sibling modifier's, so
  // resetting on mount would run too late to catch that instance's own
  // initial report) so each mount gets exactly one correction.
  initialPageSizeApplied = false;

  @action
  resetPageSizeGuard() {
    this.initialPageSizeApplied = false;
  }

  get headers() {
    return this.args.headers ?? [];
  }

  get rows() {
    return this.args.rows ?? [];
  }

  get filteredRows() {
    const term = this.filterTerm.trim().toLowerCase();
    if (!term) {
      return this.rows;
    }
    return this.rows.filter((row) =>
      row.cells.some((cell) => cell.text.toLowerCase().includes(term)),
    );
  }

  get sortedRows() {
    const index = this.sortColumnIndex;
    if (index === null) {
      return this.filteredRows;
    }
    const collator = new Intl.Collator(this.args.locale ?? 'en');
    const direction = this.sortDirection === 'ascending' ? 1 : -1;
    return [...this.filteredRows].sort(
      (a, b) =>
        direction *
        collator.compare(a.cells[index]?.text ?? '', b.cells[index]?.text ?? ''),
    );
  }

  get pagedRows() {
    return this.sortedRows.slice(this.currentSlice.start, this.currentSlice.end);
  }

  get itemsPerPageOptions() {
    const total = this.rows.length;
    const options = PAGE_SIZE_OPTIONS.filter((size) => size < total);
    return total > 0 ? [...options, total] : options;
  }

  get showPagination() {
    return (
      this.filteredRows.length > this.currentSlice.itemsPerPage ||
      this.rowsPerPageChanged
    );
  }

  get skeletonRows() {
    // Matches upstream's `tableSkeletonTemplate`, which always renders a
    // fixed 2-column skeleton regardless of the real header count.
    return Array.from({ length: this.currentSlice.itemsPerPage }, (_, i) => i);
  }

  @action
  search(term?: string) {
    this.filterTerm = term ?? '';
    this.currentSlice = {
      ...this.currentSlice,
      page: 1,
      start: 0,
      end: this.currentSlice.itemsPerPage,
    };
  }

  @action
  changePage(slice: Slice) {
    if (!this.initialPageSizeApplied) {
      this.initialPageSizeApplied = true;
      const desired = this.args.defaultPageSize ?? 5;
      if (slice.itemsPerPage !== desired) {
        this.currentSlice = { page: 1, itemsPerPage: desired, start: 0, end: desired };
        return;
      }
    }
    if (slice.itemsPerPage !== this.currentSlice.itemsPerPage) {
      this.rowsPerPageChanged = true;
    }
    this.currentSlice = slice;
  }

  @action
  sortBy(index: number) {
    if (this.sortColumnIndex === index) {
      this.sortDirection =
        this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    } else {
      this.sortColumnIndex = index;
      this.sortDirection = 'ascending';
    }
  }

  @action
  download() {
    const table = [
      this.headers.map((cell) => cell.text),
      ...this.rows.map((row) => row.cells.map((cell) => cell.text)),
    ];
    const csvContent = stringifyCSV(table);
    const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    link.setAttribute('download', 'table-data.csv');
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  <template>
    <div class='cds-aichat-table-container' ...attributes>
      {{#if @loading}}
        <div class='cds--data-table-container cds--skeleton' data-loading>
          <table class='cds--data-table'>
            <tbody>
              {{#each this.skeletonRows}}
                <tr>
                  <td><div class='cds--skeleton__text'></div></td>
                  <td><div class='cds--skeleton__text'></div></td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
      {{else}}
        <div class='cds--data-table-container'>
          {{#if @tableTitle}}
            <div class='cds--data-table-header'>
              <h4 class='cds--data-table-header__title'>{{@tableTitle}}</h4>
              {{#if @tableDescription}}
                <p class='cds--data-table-header__description'>
                  {{@tableDescription}}
                </p>
              {{/if}}
            </div>
          {{/if}}
          <div class='cds--table-toolbar'>
            <div class='cds--toolbar-content'>
              <Search
                @labelText={{@filterPlaceholderText}}
                @placeholder={{@filterPlaceholderText}}
                @onChange={{this.search}}
                @onClear={{this.search}}
                @expandable={{false}}
              />
              <Tooltip @label={{@downloadLabelText}}>
                <Button @ghost={{true}} @iconOnly={{true}} @onClick={{this.download}}>
                  <Download
                    @size={{16}}
                    @fill='currentColor'
                    @svgClass='cds-aichat-table__download-icon'
                  />
                </Button>
              </Tooltip>
            </div>
          </div>
          <table class='cds--data-table cds--data-table--sort'>
            <thead>
              <tr>
                {{#each this.headers as |header index|}}
                  <th
                    aria-sort={{if
                      (eq this.sortColumnIndex index)
                      this.sortDirection
                      'none'
                    }}
                  >
                    <button
                      type='button'
                      class='cds--table-sort'
                      {{on 'click' (fn this.sortBy index)}}
                    >
                      <span class='cds--table-sort__flex'>
                        {{#if header.component}}
                          <header.component />
                        {{else}}
                          {{header.text}}
                        {{/if}}
                      </span>
                    </button>
                  </th>
                {{/each}}
              </tr>
            </thead>
            <tbody>
              {{#each this.pagedRows as |row|}}
                <tr>
                  {{#each row.cells as |cell|}}
                    <td>
                      {{#if cell.component}}
                        <cell.component />
                      {{else}}
                        {{cell.text}}
                      {{/if}}
                    </td>
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
          {{#if this.showPagination}}
            {{!-- Pagination's own template has no ...attributes, so a
              modifier attached directly to its invocation is silently
              dropped - wrap it so willDestroy actually fires on unmount. --}}
            <div {{willDestroy this.resetPageSizeGuard}}>
              <Pagination
                @length={{this.filteredRows.length}}
                @state={{this.currentSlice}}
                @onPageChanged={{this.changePage}}
                @itemsPerPageOptions={{this.itemsPerPageOptions}}
                @backwardText={{@previousPageText}}
                @forwardText={{@nextPageText}}
              />
            </div>
          {{/if}}
        </div>
      {{/if}}
    </div>
  </template>
}
