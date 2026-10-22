import Select from './select.gts';
import Tooltip from './tooltip.gts';
import { modifier } from 'ember-modifier';
import { concat } from '@ember/helper';
import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { cached, tracked } from '@glimmer/tracking';
import { afterRender } from '../utils/after-render.ts';
import { guidFor } from '@ember/object/internals';
import ChevronLeft from './icons/chevron-left.ts';
import ChevronRight from './icons/chevron-right.ts';
import type { ComponentLike } from '@glint/template';
import './pagination.scss';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

type Slice = {
  page: number;
  itemsPerPage: number;
  start: number;
  end: number;
};

type State = {
  page: number;
  itemsPerPage: number;
};

export interface PaginationSignature {
  Element: HTMLDivElement;
  Args: {
    disabled?: boolean;
    isLoading?: boolean;
    length: number;
    onPageChanged: (currentSlice: Slice) => void;
    state?: State;
    itemsPerPageOptions?: (number | string)[];
    /** Defaults to `'md'`. */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * The description for the backward icon, also used as its tooltip content.
     * Defaults to `'Previous page'`.
     */
    backwardText?: string;
    /**
     * The tooltip position for the backward button. Defaults to `'top'`.
     */
    backwardTextTooltipPosition?: TooltipPosition;
    /**
     * The description for the forward icon, also used as its tooltip content.
     * Defaults to `'Next page'`.
     */
    forwardText?: string;
    /**
     * The tooltip position for the forward button. Defaults to `'top'`.
     */
    forwardTextTooltipPosition?: TooltipPosition;
    /**
     * Provide a custom component to render in place of the default page-select
     * control. Receives `@currentPage`, `@totalPages`, `@currentPageSize`,
     * `@pageSelectLabelText` and `@onSetPage`.
     */
    renderPageSelect?: ComponentLike<{
      Args: {
        currentPage: number;
        totalPages: number;
        currentPageSize: number;
        pageSelectLabelText: string;
        onSetPage: (page: number) => void;
      };
    }>;
  };
}

export default class Pagination extends Component<PaginationSignature> {
  @tracked currentPage: number;
  @tracked itemsPerPage: number;

  constructor(owner: Owner, args: PaginationSignature['Args']) {
    super(owner, args);
    // Seeded from the initial `@state`; later changes are applied by
    // `syncState`.
    this.currentPage = args.state?.page ?? 1;
    this.itemsPerPage = args.state?.itemsPerPage ?? 10;
  }

  get backwardText() {
    return this.args.backwardText ?? 'Previous page';
  }

  get forwardText() {
    return this.args.forwardText ?? 'Next page';
  }

  // `@itemsPerPageOptions` accepts strings too, but the selected value is
  // always the numeric `itemsPerPage`, so normalize the options to match.
  @cached
  get itemsPerPageOptions(): number[] {
    return (this.args.itemsPerPageOptions ?? [10, 20, 30, 40, 50, 100]).map(
      Number,
    );
  }

  get pageSelectLabelText() {
    return `Page ${this.currentPage} of ${this.pages} ${
      this.pages === 1 ? 'page' : 'pages'
    }`;
  }

  get pages() {
    return Math.max(1, Math.ceil(this.args.length / Number(this.itemsPerPage)));
  }

  get currentSlice(): Slice {
    const ipp = this.itemsPerPage;
    return {
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      start: (this.currentPage - 1) * ipp,
      end: (this.currentPage - 1) * ipp + Number(ipp),
    };
  }

  setState = (state?: State) => {
    if (!state) return;
    this.currentPage = state.page;
    this.itemsPerPage = state.itemsPerPage;
    this.lengthChanged();
  };

  setItemsPerPage = (items: number) => {
    this.itemsPerPage = items;
    this.pageChanged();
  };

  setCurrentPage = (p: number) => {
    this.currentPage = p;
    this.pageChanged();
  };

  // As in Carbon React, a new page size starts from the first page.
  changeItemsPerPage = (event: Event & { target: HTMLSelectElement }) => {
    this.currentPage = 1;
    this.setItemsPerPage(Number(event.target.value));
  };

  changePage = (event: Event & { target: HTMLSelectElement }) =>
    this.setCurrentPage(Number(event.target.value));

  pageBack = () => {
    this.currentPage -= 1;
    this.pageChanged();
  };

  pageForward = () => {
    this.currentPage += 1;
    this.pageChanged();
  };

  pageChanged = () => {
    afterRender(this, () => {
      this.args.onPageChanged(this.currentSlice);
    });
  };

  lengthChanged = () => {
    if (this.currentPage > this.pages) {
      this.currentPage = this.pages;
      this.pageChanged();
    }
  };

  notifyInitialPage = modifier(() => {
    this.pageChanged();
  });

  // Re-runs when `@state` or `@length` change, as it reads both. Applying
  // them is scheduled: reading this component's own page here would re-run
  // it on every page change and reset the page to the (stale) `@state`.
  syncedInitialState = false;

  syncedState?: State;

  syncState = modifier(
    (
      _element: HTMLElement,
      [state, length]: [state: State | undefined, length: number],
    ) => {
      // `lengthChanged` reads it; destructuring it is what tracks it.
      void length;
      const stateChanged = state !== this.syncedState;
      this.syncedState = state;
      if (!this.syncedInitialState) {
        this.syncedInitialState = true;
        return;
      }
      afterRender(this, () => {
        if (stateChanged && state) {
          this.setState(state);
        } else {
          this.lengthChanged();
        }
      });
    },
  );

  get guid() {
    return guidFor(this);
  }

  <template>
    <div
      class="cds--pagination
        {{concat 'cds--pagination--' (or @size 'md')}}
        cds--ember-pagination
        {{if @isLoading 'cds--skeleton'}}"
      data-pagination
      {{this.notifyInitialPage}}
      {{this.syncState @state @length}}
      ...attributes
    >
      {{#if @isLoading}}
        <div class="cds--skeleton__text"></div>
      {{else}}
        <div class="cds--pagination__left">
          <label
            id="cds-pagination-select-{{this.guid}}-count-label"
            class="cds--pagination__text"
            for="cds-pagination-select-{{this.guid}}"
          >
            Items per page:
          </label>
          <Select
            @id="cds-pagination-select-{{this.guid}}"
            @className="cds--select__item-count"
            @labelText=""
            @hideLabel={{true}}
            @noLabel={{true}}
            @inline={{true}}
            @disabled={{@disabled}}
            @value={{this.itemsPerPage}}
            @onChange={{this.changeItemsPerPage}}
            as |SelectItem|
          >
            {{#each this.itemsPerPageOptions as |size|}}
              <SelectItem @value={{size}} @text="{{size}}" />
            {{/each}}
          </Select>
          <span class="cds--pagination__text cds--pagination__items-count">
            <span data-displayed-item-range>
              {{this.currentSlice.start}}
              -
              {{this.currentSlice.end}}
            </span>
            of
            <span data-total-items>
              {{@length}}
            </span>
            items
          </span>
        </div>
        <div class="cds--pagination__right">
          {{#if @renderPageSelect}}
            <@renderPageSelect
              @currentPage={{this.currentPage}}
              @totalPages={{this.pages}}
              @currentPageSize={{this.itemsPerPage}}
              @pageSelectLabelText={{this.pageSelectLabelText}}
              @onSetPage={{this.setCurrentPage}}
            />
          {{else}}
            <Select
              @id="cds-pagination-select-{{this.guid}}-right"
              @className="cds--select__page-number"
              @labelText={{this.pageSelectLabelText}}
              @inline={{true}}
              @hideLabel={{true}}
              @disabled={{@disabled}}
              @value={{this.currentPage}}
              @onChange={{this.changePage}}
              as |SelectItem|
            >
              {{#each (range 1 this.pages true) as |page|}}
                <SelectItem @value={{page}} @text="{{page}}" />
              {{/each}}
            </Select>
          {{/if}}
          <span class="cds--pagination__text">
            {{this.currentPage}}
            of
            {{this.pages}}
            pages
          </span>
          <div class="cds--pagination__control-buttons">
            <Tooltip
              @align={{or @backwardTextTooltipPosition "top"}}
              @label={{this.backwardText}}
            >
              <button
                disabled={{or (eq this.currentPage 1) @disabled}}
                class="cds--btn--icon-only cds--pagination__button cds--pagination__button--backward cds--btn cds--btn--md cds--btn--ghost"
                tabindex="0"
                data-page-backward
                aria-label={{this.backwardText}}
                type="button"
                {{on "click" this.pageBack}}
              >
                <ChevronLeft />
              </button>
            </Tooltip>
            <Tooltip
              @align={{or @forwardTextTooltipPosition "top"}}
              @label={{this.forwardText}}
            >
              <button
                disabled={{or (eq this.currentPage this.pages) @disabled}}
                class="cds--btn--icon-only cds--pagination__button cds--pagination__button--forward cds--btn cds--btn--md cds--btn--ghost"
                tabindex="0"
                data-page-forward
                aria-label={{this.forwardText}}
                type="button"
                {{on "click" this.pageForward}}
              >
                <ChevronRight />
              </button>
            </Tooltip>
          </div>
        </div>
      {{/if}}
    </div>
  </template>
}

function range(min: number, max: number, inclusive: boolean) {
  return [...Array(max + (inclusive ? 1 : 0)).keys()].slice(min);
}
