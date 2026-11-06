import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, select, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Pagination from '#src/components/pagination.gts';
import type { PaginationChange } from '#src/components/pagination.gts';
import type { TOC } from '@ember/component/template-only';
import caretLeft from '@carbon/icons/es/caret--left/32';
import caretRight from '@carbon/icons/es/caret--right/32';

const pathOf = (icon: typeof caretLeft) => String(icon.content[0]?.attrs['d']);
const back = '.cds--pagination__button--backward';
const forward = '.cds--pagination__button--forward';
const items = '.cds--pagination__items-count';
const pageSizes = [10, 20, 30];

module('Integration | Component | Pagination', (hooks) => {
  setupRenderingTest(hooks);

  test('renders Carbon React defaults without page sizes', async function (assert) {
    await render(<template><Pagination @totalItems={{25}} /></template>);

    assert.dom('.cds--pagination').hasClass('cds--pagination--md');
    assert.dom('.cds--pagination').hasClass('cds--layout--size-md');
    assert
      .dom('.cds--pagination__left')
      .hasClass('cds--pagination__left--no-sizer');
    assert.dom('.cds--select__item-count').doesNotExist();
    assert.dom(items).hasText('1–10 of 25 items');
    assert
      .dom('.cds--pagination__right > .cds--pagination__text')
      .hasText('of 3 pages');
  });

  test("its arrows are Carbon React's carets", async function (assert) {
    await render(<template><Pagination @totalItems={{25}} /></template>);

    assert.dom(`${back} svg path`).hasAttribute('d', pathOf(caretLeft));
    assert.dom(`${forward} svg path`).hasAttribute('d', pathOf(caretRight));
  });

  test('buttons default to "Previous page" and "Next page"', async function (assert) {
    await render(<template><Pagination @totalItems={{25}} /></template>);

    assert.dom(back).hasAttribute('aria-label', 'Previous page');
    assert.dom(forward).hasAttribute('aria-label', 'Next page');
    const tooltips = document.querySelectorAll('.cds--tooltip-content');
    assert.strictEqual(tooltips[0]?.textContent?.trim(), 'Previous page');
    assert.strictEqual(tooltips[1]?.textContent?.trim(), 'Next page');
  });

  test('the texts and tooltip positions can be set', async function (assert) {
    await render(
      <template>
        <Pagination
          @totalItems={{25}}
          @pageSizes={{pageSizes}}
          @backwardText="Prior"
          @forwardText="Later"
          @itemsPerPageText="Rows:"
          @backwardTextTooltipPosition="left"
          @forwardTextTooltipPosition="right"
        />
      </template>,
    );

    assert.dom(back).hasAttribute('aria-label', 'Prior');
    assert.dom(forward).hasAttribute('aria-label', 'Later');
    assert.dom('.cds--pagination__left label').hasText('Rows:');
    const tooltips = document.querySelectorAll('.cds--tooltip');
    assert.dom(tooltips[0]).hasClass('cds--popover--left');
    assert.dom(tooltips[1]).hasClass('cds--popover--right');
  });

  test('the range texts can be replaced', async function (assert) {
    const itemRangeText = (min: number, max: number, total: number) =>
      `${min} to ${max} (${total})`;
    const pageRangeText = (current: number, total: number) =>
      `/ ${total} (${current})`;
    await render(
      <template>
        <Pagination
          @totalItems={{25}}
          @itemRangeText={{itemRangeText}}
          @pageRangeText={{pageRangeText}}
        />
      </template>,
    );

    assert.dom(items).hasText('1 to 10 (25)');
    assert
      .dom('.cds--pagination__right > .cds--pagination__text')
      .hasText('/ 3 (1)');
  });

  test('the selects are named by their labels', async function (assert) {
    await render(
      <template>
        <Pagination @totalItems={{25}} @pageSizes={{pageSizes}} />
      </template>,
    );

    const names = Array.from(document.querySelectorAll('select')).map((el) =>
      document
        .querySelector(`label[for="${el.id}"]`)
        ?.textContent?.replace(/\s+/g, ' ')
        .trim(),
    );
    assert.deepEqual(names, ['Items per page:', 'Page of 3 pages']);
  });

  test('pageSizes take numbers or { text, value }', async function (assert) {
    const sizes = [5, { text: 'Ten', value: 10 }];
    await render(
      <template>
        <Pagination @totalItems={{25}} @pageSizes={{sizes}} @pageSize={{10}} />
      </template>,
    );

    const options = Array.from(
      document.querySelectorAll('.cds--select__item-count option'),
    ).map((option) => [
      option.textContent?.trim(),
      (option as HTMLOptionElement).value,
    ]);
    assert.deepEqual(options, [
      ['5', '5'],
      ['Ten', '10'],
    ]);
    assert.dom('.cds--select__item-count select').hasValue('10');
  });

  test('the page size is the first of pageSizes unless it is one of them', async function (assert) {
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @pageSize={{7}}
        />
      </template>,
    );

    assert.dom('.cds--select__item-count select').hasValue('10');
    assert.dom(items).hasText('1–10 of 100 items');
  });

  test('uncontrolled: the buttons page and report { page, pageSize }', async function (assert) {
    const changes: PaginationChange[] = [];
    const onChange = (change: PaginationChange) => changes.push(change);
    await render(
      <template>
        <Pagination
          @totalItems={{25}}
          @pageSize={{10}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom(back).isDisabled();
    await click(forward);
    assert.dom(items).hasText('11–20 of 25 items');
    assert.dom(back).isNotDisabled();
    await click(forward);
    assert.dom(items).hasText('21–25 of 25 items');
    assert.dom(forward).isDisabled('the last page');
    await click(back);
    assert.deepEqual(changes, [
      { page: 2, pageSize: 10 },
      { page: 3, pageSize: 10 },
      { page: 2, pageSize: 10 },
    ]);
  });

  test('the page select changes the page', async function (assert) {
    const changes: PaginationChange[] = [];
    const onChange = (change: PaginationChange) => changes.push(change);
    await render(
      <template>
        <Pagination @totalItems={{25}} @onChange={{onChange}} />
      </template>,
    );

    assert.dom('.cds--select__page-number option').exists({ count: 3 });
    await select('.cds--select__page-number select', '3');
    assert.dom(items).hasText('21–25 of 25 items');
    assert.deepEqual(changes, [{ page: 3, pageSize: 10 }]);
  });

  test('a new page size goes back to page 1', async function (assert) {
    const changes: PaginationChange[] = [];
    const onChange = (change: PaginationChange) => changes.push(change);
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @page={{3}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom(items).hasText('21–30 of 100 items');
    await select('.cds--select__item-count select', '20');
    assert.dom('.cds--select__page-number select').hasValue('1');
    assert.dom(items).hasText('1–20 of 100 items');
    assert.deepEqual(changes, [{ page: 1, pageSize: 20 }]);
  });

  test('controlled: @page and @pageSize follow their arguments', async function (assert) {
    const page = tracked(1);
    const pageSize = tracked(10);
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @page={{page.value}}
          @pageSize={{pageSize.value}}
        />
      </template>,
    );

    page.value = 4;
    pageSize.value = 20;
    await settled();
    assert.dom('.cds--select__item-count select').hasValue('20');
    assert.dom(items).hasText('61–80 of 100 items');

    // The user moves on; the next change of the argument wins again.
    await click(back);
    assert.dom(items).hasText('41–60 of 100 items');
    page.value = 1;
    await settled();
    assert.dom(items).hasText('1–20 of 100 items');
  });

  test('controlled: a parent that feeds the change back', async function (assert) {
    const page = tracked(1);
    const onChange = (change: PaginationChange) => {
      page.value = change.page;
    };
    await render(
      <template>
        <Pagination
          @totalItems={{25}}
          @page={{page.value}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await click(forward);
    assert.strictEqual(page.value, 2);
    assert.dom(items).hasText('11–20 of 25 items');
    page.value = 1;
    await settled();
    assert.dom(items).hasText('1–10 of 25 items');
  });

  test('isLastPage disables the forward button', async function (assert) {
    await render(
      <template>
        <Pagination @totalItems={{100}} @isLastPage={{true}} />
      </template>,
    );

    assert.dom(forward).isDisabled();
    assert.dom(back).isDisabled();
  });

  test('pagesUnknown shows the page, with no totals or page select', async function (assert) {
    const changes: PaginationChange[] = [];
    const onChange = (change: PaginationChange) => changes.push(change);
    const isLastPage = tracked(false);
    await render(
      <template>
        <Pagination
          @pagesUnknown={{true}}
          @pageSizes={{pageSizes}}
          @isLastPage={{isLastPage.value}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom(items).hasText('1–10 items');
    assert.dom('.cds--pagination__unknown-pages-text').hasText('page 1');
    assert.dom('.cds--select__page-number').doesNotExist();
    assert.dom(forward).isNotDisabled('there may be more');

    await click(forward);
    await click(forward);
    assert.dom(items).hasText('21–30 items');
    assert.dom('.cds--pagination__unknown-pages-text').hasText('page 3');
    assert.deepEqual(changes, [
      { page: 2, pageSize: 10 },
      { page: 3, pageSize: 10 },
    ]);

    isLastPage.value = true;
    await settled();
    assert.dom(forward).isDisabled();
    assert.dom(back).isNotDisabled();
  });

  test('pagesUnknown with totalItems of 0 shows the empty range', async function (assert) {
    await render(
      <template>
        <Pagination @pagesUnknown={{true}} @totalItems={{0}} />
      </template>,
    );

    assert.dom(items).hasText('0–0 of 0 items');
  });

  test('@disabled and the input flags disable the controls', async function (assert) {
    const disabled = tracked(true);
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @page={{2}}
          @disabled={{disabled.value}}
        />
      </template>,
    );

    assert.dom(forward).isDisabled();
    assert.dom(back).isDisabled();
    assert.dom('.cds--select__item-count select').isDisabled();
    assert.dom('.cds--select__page-number select').isDisabled();
    disabled.value = false;
    await settled();
    assert.dom(forward).isNotDisabled();
    assert.dom('.cds--select__item-count select').isNotDisabled();
  });

  test('pageInputDisabled and pageSizeInputDisabled disable their selects', async function (assert) {
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @pageInputDisabled={{true}}
        />
        <Pagination
          @totalItems={{100}}
          @pageSizes={{pageSizes}}
          @pageSizeInputDisabled={{true}}
        />
      </template>,
    );

    const selects = document.querySelectorAll('select');
    assert.dom(selects[0]).isNotDisabled();
    assert.dom(selects[1]).isDisabled();
    assert.dom(selects[2]).isDisabled();
    assert.dom(selects[3]).isNotDisabled();
  });

  test('@size sets the size classes', async function (assert) {
    await render(
      <template><Pagination @totalItems={{10}} @size="xs" /></template>,
    );

    assert.dom('.cds--pagination').hasClass('cds--pagination--xs');
    assert.dom('.cds--pagination').hasClass('cds--layout--size-xs');
  });

  test('@renderPageSelect replaces the page select', async function (assert) {
    const CustomPageSelect: TOC<{
      Args: {
        currentPage: number;
        totalPages: number;
        currentPageSize: number;
        pageSelectLabelText: string;
        onSetPage: (page: number | string) => void;
      };
    }> = <template>
      <button
        type="button"
        data-custom-page-select
        aria-label={{@pageSelectLabelText}}
        {{on "click" (fn @onSetPage 3)}}
      >
        {{@currentPage}}/{{@totalPages}}
      </button>
    </template>;

    const changes: PaginationChange[] = [];
    const onChange = (change: PaginationChange) => changes.push(change);
    await render(
      <template>
        <Pagination
          @totalItems={{100}}
          @renderPageSelect={{CustomPageSelect}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom('[data-custom-page-select]').hasText('1/10');
    assert.dom('.cds--select__page-number').doesNotExist();
    assert
      .dom('.cds--pagination__right')
      .hasClass('cds--pagination__right--no-content');
    await click('[data-custom-page-select]');
    assert.dom('[data-custom-page-select]').hasText('3/10');
    assert.deepEqual(changes, [{ page: 3, pageSize: 10 }]);
  });
});
