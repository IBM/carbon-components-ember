/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Select from './select.gts';
import Button from './button.gts';
import { modifier } from 'ember-modifier';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { afterRender } from '../utils/after-render.ts';
import captureElement from '../modifiers/capture-element.ts';
import CaretLeft from './icons/caret-left.ts';
import CaretRight from './icons/caret-right.ts';
import type { ComponentLike } from '@glint/template';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

const DEFAULT_PAGE_SIZE = 10;

export interface PaginationPageSize {
  text: string;
  value: number;
}

export interface PaginationChange {
  page: number;
  pageSize: number;
}

export interface PaginationSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * The description for the backward icon, also used as its tooltip.
     * Defaults to `'Previous page'`.
     */
    backwardText?: string;
    /** The tooltip position for the backward button. Defaults to `'top'`. */
    backwardTextTooltipPosition?: TooltipPosition;
    /**
     * `true` if the backward/forward buttons, as well as the page select
     * elements, should be disabled.
     */
    disabled?: boolean;
    /**
     * The description for the forward icon, also used as its tooltip.
     * Defaults to `'Next page'`.
     */
    forwardText?: string;
    /** The tooltip position for the forward button. Defaults to `'top'`. */
    forwardTextTooltipPosition?: TooltipPosition;
    /** The unique ID of this component instance. */
    id?: string | number;
    /** `true` if the current page should be the last page. */
    isLastPage?: boolean;
    /**
     * Shows where the current page is, in a manner of the range of items.
     * Defaults to "1–10 of 100 items".
     */
    itemRangeText?: (min: number, max: number, total: number) => string;
    /**
     * A variant of `itemRangeText`, used if the total number of items is
     * unknown. Defaults to "1–10 items".
     */
    itemText?: (min: number, max: number) => string;
    /** The text indicating the number of items per page. */
    itemsPerPageText?: string;
    /**
     * Called with the new `{ page, pageSize }` when the user changes either.
     */
    onChange?: (data: PaginationChange) => void;
    /**
     * The current page. Follows this argument whenever it changes, and the
     * user's changes in between. Defaults to `1`.
     */
    page?: number;
    /** `true` if the select box to change the page should be disabled. */
    pageInputDisabled?: boolean;
    /** Accepted as in Carbon React, which doesn't use it. */
    pageNumberText?: string;
    /**
     * The text after the page select. Defaults to "of 10 pages".
     */
    pageRangeText?: (current: number, total: number) => string;
    /**
     * The label for the page select. Defaults to "Page of 10 pages".
     */
    pageSelectLabelText?: (total: number) => string;
    /**
     * Replaces the page select. A component that renders nothing hides it,
     * and the range then names the page ("1 of 11 pages"). Receives `@currentPage`, `@totalPages`,
     * `@currentPageSize`, `@pageSelectLabelText` and `@onSetPage`.
     */
    renderPageSelect?: ComponentLike<{
      Args: {
        currentPage: number;
        totalPages: number;
        currentPageSize: number;
        pageSelectLabelText: string;
        onSetPage: (page: number | string) => void;
      };
    }>;
    /**
     * The number of items on a page. Follows this argument whenever it
     * changes, and the user's changes in between. Defaults to the first of
     * `@pageSizes`, or `10`.
     */
    pageSize?: number;
    /** `true` if the select box to change the items per page should be disabled. */
    pageSizeInputDisabled?: boolean;
    /**
     * The choices for `@pageSize`. Without them, there is no select for the
     * page size.
     */
    pageSizes?: (number | PaginationPageSize)[];
    /**
     * The text showing the current page when the total is unknown. Defaults to "page 1".
     */
    pageText?: (page: number, pagesUnknown?: boolean) => string;
    /**
     * `true` when the total number of pages is unknown. Hides the page
     * select.
     */
    pagesUnknown?: boolean;
    /** Defaults to `'md'`. */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /** The total number of items. */
    totalItems?: number;
  };
}

function resolvePageSize(
  pageSizes: PaginationPageSize[] | undefined,
  pageSize: number | undefined,
) {
  if (!pageSizes) {
    const resolved = pageSize ?? DEFAULT_PAGE_SIZE;
    return resolved > 0 ? resolved : DEFAULT_PAGE_SIZE;
  }
  return pageSize !== undefined &&
    pageSizes.some((size) => size.value === pageSize)
    ? pageSize
    : pageSizes[0]!.value;
}

export default class Pagination extends Component<PaginationSignature> {
  // The user's choice stands until the argument it was made against changes,
  // as React's state does when its effect syncs it to the prop.
  @tracked pageChoice?: number;
  @tracked pageSizeChoice?: number;

  seen?: {
    page: number | undefined;
    pageSize: number | undefined;
    sizes: PaginationPageSize[] | undefined;
    sizesKey: string;
  };

  @tracked customSelectEmpty = false;

  rangeElement?: HTMLElement;

  backwardButton?: HTMLElement;
  forwardButton?: HTMLElement;

  get guid() {
    return this.args.id !== undefined ? String(this.args.id) : guidFor(this);
  }

  @cached
  get pageSizes(): PaginationPageSize[] | undefined {
    const sizes = this.args.pageSizes;
    if (!sizes?.length) return undefined;
    return sizes.map((size) =>
      typeof size === 'object' ? size : { text: String(size), value: size },
    );
  }

  get page() {
    return this.pageChoice ?? this.args.page ?? 1;
  }

  get pageSize() {
    return resolvePageSize(
      this.pageSizes,
      this.pageSizeChoice ?? this.args.pageSize,
    );
  }

  get totalPages() {
    const { totalItems } = this.args;
    return totalItems ? Math.max(Math.ceil(totalItems / this.pageSize), 1) : 1;
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get backDisabled() {
    return !!this.args.disabled || this.page === 1;
  }

  // React's class follows this, which leaves `isLastPage` out.
  get forwardNoIndex() {
    return (
      !!this.args.disabled ||
      (this.page === this.totalPages && !this.args.pagesUnknown)
    );
  }

  get forwardDisabled() {
    return this.forwardNoIndex || !!this.args.isLastPage;
  }

  get pageSelectLabelText() {
    const total = this.totalPages;
    return (
      this.args.pageSelectLabelText ??
      ((t: number) => `Page of ${t} ${t === 1 ? 'page' : 'pages'}`)
    )(total);
  }

  get itemsText() {
    const { totalItems, pagesUnknown } = this.args;
    const { page, pageSize } = this;
    const itemText =
      this.args.itemText ?? ((min, max) => `${min}–${max} items`);
    const itemRangeText =
      this.args.itemRangeText ??
      ((min, max, total) => `${min}–${max} of ${total} items`);
    if (pagesUnknown || !totalItems) {
      return totalItems === 0
        ? itemRangeText(0, 0, 0)
        : itemText(pageSize * (page - 1) + 1, page * pageSize);
    }
    return itemRangeText(
      Math.min(pageSize * (page - 1) + 1, totalItems),
      Math.min(page * pageSize, totalItems),
      totalItems,
    );
  }

  get pageText() {
    return (this.args.pageText ?? ((page: number) => `page ${page}`))(
      this.page,
      this.args.pagesUnknown,
    );
  }

  get pageRangeText() {
    const text = (
      this.args.pageRangeText ??
      ((_current: number, total: number) =>
        `of ${total} ${total === 1 ? 'page' : 'pages'}`)
    )(this.page, this.totalPages);
    // As in React, a custom page select that renders nothing leaves the
    // range to say which page it is.
    return this.args.renderPageSelect && this.customSelectEmpty
      ? `${this.page} ${text}`
      : text;
  }

  setPage(page: number) {
    this.pageChoice = page;
  }

  setPageSize(pageSize: number) {
    this.pageSizeChoice = pageSize;
  }

  focusLater(button: 'backwardButton' | 'forwardButton') {
    afterRender(this, () => {
      const element = this[button];
      if (element && !(element as HTMLButtonElement).disabled) {
        element.focus();
      }
    });
  }

  changePageSize = (event: Event & { target: HTMLSelectElement }) => {
    const pageSize = Number(event.target.value);
    this.setPage(1);
    this.setPageSize(pageSize);
    this.args.onChange?.({ page: 1, pageSize });
  };

  changePage = (event: Event & { target: HTMLSelectElement }) => {
    const page = Number(event.target.value);
    const { totalItems } = this.args;
    if (page > 0 && totalItems && page <= this.totalPages) {
      this.setPage(page);
      this.args.onChange?.({ page, pageSize: this.pageSize });
    }
  };

  setPageFromCustomSelect = (nextPage: number | string) => {
    if (this.args.disabled || this.args.pageInputDisabled) return;
    const numeric = Number(nextPage);
    if (!Number.isInteger(numeric)) return;
    const page = Math.min(Math.max(numeric, 1), this.totalPages);
    if (page === this.page) return;
    this.setPage(page);
    this.args.onChange?.({ page, pageSize: this.pageSize });
  };

  pageBack = () => {
    const page = this.page - 1;
    this.setPage(page);
    if (page === 1) this.focusLater('forwardButton');
    this.args.onChange?.({ page, pageSize: this.pageSize });
  };

  pageForward = () => {
    const page = this.page + 1;
    this.setPage(page);
    if (page === this.totalPages) this.focusLater('backwardButton');
    this.args.onChange?.({ page, pageSize: this.pageSize });
  };

  // Drops the user's choice once its argument changes, and, as React does,
  // goes back to page 1 and reports it when new `pageSizes` drop the current
  // page size.
  syncArgs = modifier(
    (
      _element: HTMLElement,
      [page, pageSize, sizes]: [
        number | undefined,
        number | undefined,
        PaginationPageSize[] | undefined,
      ],
    ) => {
      const seen = this.seen;
      const sizesKey = JSON.stringify(sizes ?? null);
      this.seen = { page, pageSize, sizes, sizesKey };
      if (!seen) return;
      afterRender(this, () => {
        if (seen.page !== page) this.pageChoice = undefined;
        if (seen.pageSize !== pageSize) this.pageSizeChoice = undefined;
        if (seen.sizesKey !== sizesKey) this.sizesChanged(seen.sizes, sizes);
      });
    },
  );

  sizesChanged(
    previous: PaginationPageSize[] | undefined,
    sizes: PaginationPageSize[] | undefined,
  ) {
    // As in Carbon React, no sizes means `@pageSize` or 10 again.
    if (!sizes) {
      this.pageSizeChoice = undefined;
      return;
    }
    const { pageSize: argPageSize } = this.args;
    const before = resolvePageSize(
      previous,
      this.pageSizeChoice ?? argPageSize,
    );
    const page = this.page;
    const hadSize = sizes.some((size) => size.value === before);
    const nextPage = hadSize ? page : 1;
    const nextPageSize = resolvePageSize(sizes, argPageSize ?? before);
    if (!hadSize) this.setPage(nextPage);
    if (nextPageSize !== before) this.setPageSize(nextPageSize);
    const controlled =
      argPageSize !== undefined &&
      sizes.some((size) => size.value === argPageSize);
    if (!controlled && (nextPage !== page || nextPageSize !== before)) {
      this.args.onChange?.({ page: nextPage, pageSize: nextPageSize });
    }
  }

  // Whether `@renderPageSelect` rendered nothing, which React knows from its
  // function returning null.
  watchCustomSelect = modifier(
    (
      container: HTMLElement,
      [custom, pagesUnknown, page, totalPages, pageSize, labelText]: [
        unknown,
        boolean | undefined,
        number,
        number,
        number,
        string,
      ],
    ) => {
      // Everything the custom select is given can change what it renders.
      void [page, totalPages, pageSize, labelText];
      afterRender(this, () => {
        const range = this.rangeElement;
        let empty = !!custom && !pagesUnknown && !!range;
        for (
          let node = container.firstChild;
          empty && node && node !== range;
          node = node.nextSibling
        ) {
          if (node.nodeType === Node.ELEMENT_NODE) empty = false;
          else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
            empty = false;
        }
        this.customSelectEmpty = empty;
      });
    },
  );

  captureRange = (element: HTMLElement) => {
    this.rangeElement = element;
  };

  captureBackward = (element: HTMLElement) => {
    this.backwardButton = element;
  };

  captureForward = (element: HTMLElement) => {
    this.forwardButton = element;
  };

  <template>
    <div
      class="cds--pagination cds--pagination--{{or @size 'md'}}
        cds--layout--size-{{or @size 'md'}}"
      {{this.syncArgs @page @pageSize this.pageSizes}}
      ...attributes
    >
      <div
        class="cds--pagination__left
          {{unless this.pageSizes 'cds--pagination__left--no-sizer'}}"
      >
        {{#if this.pageSizes}}
          <label
            id="cds-pagination-select-{{this.guid}}-count-label"
            class="cds--pagination__text"
            for="cds-pagination-select-{{this.guid}}"
          >
            {{~or @itemsPerPageText "Items per page:"~}}
          </label>
          <Select
            @id="cds-pagination-select-{{this.guid}}"
            @className="cds--select__item-count"
            @labelText=""
            @hideLabel={{true}}
            @noLabel={{true}}
            @inline={{true}}
            @disabled={{or @pageSizeInputDisabled @disabled}}
            @value={{this.pageSize}}
            @onChange={{this.changePageSize}}
            as |SelectItem|
          >
            {{#each this.pageSizes as |size|}}
              <SelectItem @value={{size.value}} @text={{size.text}} />
            {{/each}}
          </Select>
        {{/if}}
        <span class="cds--pagination__text cds--pagination__items-count">
          {{~this.itemsText~}}
        </span>
      </div>
      <div
        class="cds--pagination__right
          {{if
            (if @pagesUnknown false @renderPageSelect)
            'cds--pagination__right--no-content'
          }}"
        {{this.watchCustomSelect
          @renderPageSelect
          @pagesUnknown
          this.page
          this.totalPages
          this.pageSize
          this.pageSelectLabelText
        }}
      >
        {{#if @pagesUnknown}}
          <span
            class="cds--pagination__text cds--pagination__page-text cds--pagination__unknown-pages-text"
          >
            {{~this.pageText~}}
          </span>
        {{else}}
          {{#if @renderPageSelect}}
            <@renderPageSelect
              @currentPage={{this.page}}
              @totalPages={{this.totalPages}}
              @currentPageSize={{this.pageSize}}
              @pageSelectLabelText={{this.pageSelectLabelText}}
              @onSetPage={{this.setPageFromCustomSelect}}
            />
          {{else}}
            <Select
              @id="cds-pagination-select-{{this.guid}}-right"
              @className="cds--select__page-number"
              @labelText={{this.pageSelectLabelText}}
              @inline={{true}}
              @hideLabel={{true}}
              @disabled={{or @pageInputDisabled @disabled}}
              @value={{this.page}}
              @onChange={{this.changePage}}
              as |SelectItem|
            >
              {{#each this.pageNumbers as |number|}}
                <SelectItem @value={{number}} @text="{{number}}" />
              {{/each}}
            </Select>
          {{/if}}
          <span
            class="cds--pagination__text"
            {{captureElement this.captureRange}}
          >
            {{~this.pageRangeText~}}
          </span>
        {{/if}}
        <div class="cds--pagination__control-buttons">
          <Button
            @kind="ghost"
            @hasIconOnly={{true}}
            @iconDescription={{or @backwardText "Previous page"}}
            @tooltipPosition={{or @backwardTextTooltipPosition "top"}}
            @disabled={{this.backDisabled}}
            @renderIcon={{CaretLeft}}
            class="cds--pagination__button cds--pagination__button--backward
              {{if this.backDisabled 'cds--pagination__button--no-index'}}"
            aria-label={{or @backwardText "Previous page"}}
            {{captureElement this.captureBackward}}
            {{on "click" this.pageBack}}
          />
          <Button
            @kind="ghost"
            @hasIconOnly={{true}}
            @iconDescription={{or @forwardText "Next page"}}
            @tooltipPosition={{or @forwardTextTooltipPosition "top"}}
            @disabled={{this.forwardDisabled}}
            @renderIcon={{CaretRight}}
            class="cds--pagination__button cds--pagination__button--forward
              {{if this.forwardNoIndex 'cds--pagination__button--no-index'}}"
            aria-label={{or @forwardText "Next page"}}
            {{captureElement this.captureForward}}
            {{on "click" this.pageForward}}
          />
        </div>
      </div>
    </div>
  </template>
}
