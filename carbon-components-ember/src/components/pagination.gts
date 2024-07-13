import { default as Select } from './select.gts';
import { default as Icon } from './icon.gts';
import { default as defaultTo } from '../helpers/default-to.ts';
import { default as range } from 'ember-composable-helpers/helpers/range';
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
/** @documenter yuidoc */

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

type Args = {
  disabled?: boolean;
  isLoading?: boolean;
  length: number;
  onPageChanged: (currentSlice: Slice) => void;
  state?: State;
  itemsPerPageOptions?: (number | string)[];
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
  });

  get defaultArgs() {
    return this.args;
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

  <template>
    <div
      class='cds--pagination
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
            id='select-id-pagination-count-label'
            class='cds--pagination__text'
            for='select-id-pagination-count'
          >
            Items per page:
          </label>
          <div class='cds--select cds--select--inline cds--select__item-count'>
            <Select
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
          <Select
            @multiple={{false}}
            @disabled={{@disabled}}
            @searchEnabled={{false}}
            @options={{range 1 this.pages true}}
            @onSelect={{this.setCurrentPage}}
            @selected={{this.currentPage}}
          />
          <label
            id='select-id-pagination-page-label'
            class='cds--pagination__text'
            for='select-id-pagination-page'
          >
            {{this.currentPage}}
            of
            {{this.pages}}
            pages
          </label>
          <button
            disabled={{or (eq this.currentPage 1) @disabled}}
            class='cds--btn--icon-only cds--pagination__button cds--pagination__button--backward cds--btn cds--btn--md cds--btn--ghost'
            tabindex='0'
            data-page-backward
            aria-label='previous page'
            type='button'
            {{on 'click' this.pageBack}}
          >
            <Icon
              @btnClass='cds--pagination__nav-arrow'
              @icon='chevron--left'
            />
          </button>
          <button
            disabled={{or (eq this.currentPage this.pages) @disabled}}
            class='cds--btn--icon-only cds--pagination__button cds--pagination__button--forward cds--btn cds--btn--md cds--btn--ghost'
            tabindex='0'
            data-page-forward
            aria-label='next page'
            type='button'
            {{on 'click' this.pageForward}}
          >
            <Icon
              @btnClass='cds--pagination__nav-arrow'
              @icon='chevron--right'
            />
          </button>
        </div>
      {{/if}}
    </div>
  </template>
}
