import { default as Select } from './select.gts';
import { default as Tooltip } from './tooltip.gts';
import { default as defaultTo } from '../helpers/default-to.ts';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
import { default as didUpdate } from '@ember/render-modifiers/modifiers/did-update';
import { array, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { default as or } from 'ember-truth-helpers/helpers/or';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { defaultArgs } from '../utils/decorators.ts';
import { stylesheet } from 'astroturf';
import { runTask } from 'ember-lifeline';
import { guidFor } from '@ember/object/internals';
import { ChevronLeft, ChevronRight } from '../icons.ts';
import type { ComponentLike } from '@glint/template';
/** @documenter yuidoc */

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

export type Args = {
  disabled?: boolean;
  isLoading?: boolean;
  length: number;
  onPageChanged: (currentSlice: Slice) => void;
  state?: State;
  itemsPerPageOptions?: (number | string)[];
  /**
   * The description for the backward icon, also used as its tooltip content.
   */
  backwardText?: string;
  /**
   * The tooltip position for the backward button.
   */
  backwardTextTooltipPosition?: TooltipPosition;
  /**
   * The description for the forward icon, also used as its tooltip content.
   */
  forwardText?: string;
  /**
   * The tooltip position for the forward button.
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

export default class CarbonPagination extends Component<Args> {
  @tracked currentPage = 1;
  @tracked itemsPerPage = 10;

  args: Args = defaultArgs(this, {
    disabled: false,
    length: 1,
    onPageChanged: () => null,
    state: undefined,
    itemsPerPageOptions: undefined,
    backwardText: 'Previous page',
    backwardTextTooltipPosition: 'top',
    forwardText: 'Next page',
    forwardTextTooltipPosition: 'top',
    renderPageSelect: undefined,
  });

  get defaultArgs() {
    return this.args;
  }

  get pageSelectLabelText() {
    return `Page ${this.currentPage} of ${this.pages} ${
      this.pages === 1 ? 'page' : 'pages'
    }`;
  }

  get pages() {
    return parseInt((this.args.length / this.itemsPerPage).toString()) + 1;
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

  @action
  setState(state?: State) {
    if (!state) return;
    this.currentPage = state.page;
    this.itemsPerPage = state.itemsPerPage;
    this.lengthChanged();
  }

  @action
  setItemsPerPage(items: number) {
    this.itemsPerPage = items;
    this.pageChanged();
  }

  @action
  setCurrentPage(p: number) {
    this.currentPage = p;
    this.pageChanged();
  }

  @action
  pageBack() {
    this.currentPage -= 1;
    this.pageChanged();
  }

  @action
  pageForward() {
    this.currentPage += 1;
    this.pageChanged();
  }

  @action
  pageChanged() {
    runTask(this, () => {
      this.args.onPageChanged(this.currentSlice);
    });
  }

  @action
  lengthChanged() {
    if (this.currentPage > this.pages) {
      this.currentPage = this.pages;
      this.pageChanged();
    }
  }

  styles = stylesheet`
    .namespace {
      width: 100%;
      .ember-power-select-selected-item {
        background-color: transparent;
        color: #161616;
        border-bottom: none;
        padding-left: 0.5rem;
        padding-right: 1.625rem;
      }

      .ember-power-select-trigger {
        border: none;
      }
    }
  ` as { namespace: string };

  get guid() {
    return guidFor(this);
  }

  <template>
    <div
      class='cds--pagination cds--pagination--md
        {{this.styles.namespace}}
        {{if @isLoading "cds--skeleton"}}'
      data-pagination
      {{didInsert this.pageChanged}}
      {{didUpdate (fn this.setState @state) @state}}
    >
      {{#if @isLoading}}
        <div class='cds--skeleton__text'></div>
      {{else}}
        <div class='cds--pagination__left'>
          <label
            id='select-{{this.guid}}-pagination-count-label'
            class='cds--pagination__text'
            for='select-{{this.guid}}-pagination-count'
          >
            Items per page:
          </label>
          <div class="cds--form-item cds--select__item-count">
            <Select
              @inline={{true}}
              @disabled={{@disabled}}
              @searchEnabled={{false}}
              @options={{defaultTo
              this.defaultArgs.itemsPerPageOptions
              (array 10 20 30 40 50 100)
            }}
              @onSelect={{this.setItemsPerPage}}
              @selected={{this.itemsPerPage}}
            />
          </div>
          <span class='cds--pagination__text'>
            <span data-displayed-item-range>
              {{this.currentSlice.start}}
              -
              {{this.currentSlice.end}}
            </span>
            of
            <span data-total-items>
              {{this.defaultArgs.length}}
            </span>
            items
          </span>
        </div>
        <div class='cds--pagination__right'>
          {{#if @renderPageSelect}}
            <@renderPageSelect
              @currentPage={{this.currentPage}}
              @totalPages={{this.pages}}
              @currentPageSize={{this.itemsPerPage}}
              @pageSelectLabelText={{this.pageSelectLabelText}}
              @onSetPage={{this.setCurrentPage}}
            />
          {{else}}
            <div class="cds--form-item cds--select__item-count">
              <Select
                @inline={{true}}
                @multiple={{false}}
                @disabled={{@disabled}}
                @searchEnabled={{false}}
                @options={{range 1 this.pages true}}
                @onSelect={{this.setCurrentPage}}
                @selected={{this.currentPage}}
              />
            </div>
          {{/if}}
          <label
            id='select-{{this.guid}}-pagination-page-label'
            class='cds--pagination__text'
            for='select-{{this.guid}}-pagination-page'
          >
            {{this.currentPage}}
            of
            {{this.pages}}
            pages
          </label>
          <div class='cds--pagination__control-buttons'>
            <Tooltip
              @align={{this.defaultArgs.backwardTextTooltipPosition}}
              @label={{this.defaultArgs.backwardText}}
            >
              <button
                disabled={{or (eq this.currentPage 1) @disabled}}
                class='cds--btn--icon-only cds--pagination__button cds--pagination__button--backward cds--btn cds--btn--md cds--btn--ghost'
                tabindex='0'
                data-page-backward
                aria-label={{this.defaultArgs.backwardText}}
                type='button'
                {{on 'click' this.pageBack}}
              >
                <ChevronLeft @btnClass='cds--pagination__nav-arrow' />
              </button>
            </Tooltip>
            <Tooltip
              @align={{this.defaultArgs.forwardTextTooltipPosition}}
              @label={{this.defaultArgs.forwardText}}
            >
              <button
                disabled={{or (eq this.currentPage this.pages) @disabled}}
                class='cds--btn--icon-only cds--pagination__button cds--pagination__button--forward cds--btn cds--btn--md cds--btn--ghost'
                tabindex='0'
                data-page-forward
                aria-label={{this.defaultArgs.forwardText}}
                type='button'
                {{on 'click' this.pageForward}}
              >
                <ChevronRight @btnClass="cds--pagination__nav-arrow" />
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
