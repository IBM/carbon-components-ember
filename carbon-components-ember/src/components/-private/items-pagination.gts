/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { afterRender } from '../../utils/after-render.ts';
import Pagination from '../pagination.gts';
import PaginationSkeleton from '../pagination-skeleton.gts';
import type { PaginationChange, PaginationSignature } from '../pagination.gts';

const DEFAULT_PAGE_SIZES = [10, 20, 30, 40, 50, 100];

/** The items a page shows, as the range of an array to `slice()`. */
export interface ItemsSlice {
  page: number;
  itemsPerPage: number;
  start: number;
  end?: number | undefined;
}

export interface ItemsPaginationSignature {
  Element: HTMLDivElement;
  Args: Omit<
    PaginationSignature['Args'],
    'page' | 'pageSize' | 'onChange' | 'totalItems'
  > & {
    /** Renders a skeleton instead. */
    isLoading?: boolean;
    /** How many items there are to page through. */
    totalItems: number;
    /** The slice the page shows. */
    slice?: ItemsSlice | undefined;
    /** Called with the first slice, and with each one after a change. */
    onSliceChange: (slice: ItemsSlice) => void;
  };
}

/**
 * A Pagination for a component that shows a slice of its items (DataTable,
 * List): it reports the first slice once it renders, and again when the
 * items no longer reach the current page.
 */
export default class ItemsPagination extends Component<ItemsPaginationSignature> {
  get pageSizes() {
    return this.args.pageSizes ?? DEFAULT_PAGE_SIZES;
  }

  get defaultPageSize() {
    const first = this.pageSizes[0];
    return (typeof first === 'object' ? first.value : first) ?? 10;
  }

  get page() {
    return this.args.slice?.page || 1;
  }

  get pageSize() {
    return this.args.slice?.itemsPerPage || this.defaultPageSize;
  }

  emit(page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    this.args.onSliceChange({
      page,
      itemsPerPage: pageSize,
      start,
      end: start + pageSize,
    });
  }

  change = ({ page, pageSize }: PaginationChange) => {
    this.emit(page, pageSize);
  };

  sync = modifier(
    (
      _element: HTMLElement,
      [totalItems, slice]: [number, ItemsSlice | undefined],
    ) => {
      afterRender(this, () => {
        if (!slice?.itemsPerPage) {
          this.emit(1, this.defaultPageSize);
          return;
        }
        const pages = Math.max(Math.ceil(totalItems / slice.itemsPerPage), 1);
        if (slice.page > pages) this.emit(pages, slice.itemsPerPage);
      });
    },
  );

  <template>
    {{#if @isLoading}}
      <PaginationSkeleton {{this.sync @totalItems @slice}} ...attributes />
    {{else}}
      <Pagination
        @totalItems={{@totalItems}}
        @page={{this.page}}
        @pageSize={{this.pageSize}}
        @pageSizes={{this.pageSizes}}
        @onChange={{this.change}}
        @backwardText={{@backwardText}}
        @backwardTextTooltipPosition={{@backwardTextTooltipPosition}}
        @disabled={{@disabled}}
        @forwardText={{@forwardText}}
        @forwardTextTooltipPosition={{@forwardTextTooltipPosition}}
        @id={{@id}}
        @isLastPage={{@isLastPage}}
        @itemRangeText={{@itemRangeText}}
        @itemText={{@itemText}}
        @itemsPerPageText={{@itemsPerPageText}}
        @pageInputDisabled={{@pageInputDisabled}}
        @pageNumberText={{@pageNumberText}}
        @pageRangeText={{@pageRangeText}}
        @pageSelectLabelText={{@pageSelectLabelText}}
        @renderPageSelect={{@renderPageSelect}}
        @pageSizeInputDisabled={{@pageSizeInputDisabled}}
        @pageText={{@pageText}}
        @pagesUnknown={{@pagesUnknown}}
        @size={{@size}}
        {{this.sync @totalItems @slice}}
        ...attributes
      />
    {{/if}}
  </template>
}
