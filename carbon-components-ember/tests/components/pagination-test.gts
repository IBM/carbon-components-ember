import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, select, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Pagination from '#src/components/pagination.gts';
import type { TOC } from '@ember/component/template-only';
import { trackedObject } from '@ember/reactive/collections';
import caretLeft from '@carbon/icons/es/caret--left/32';
import caretRight from '@carbon/icons/es/caret--right/32';

const noop = () => null;
const pathOf = (icon: typeof caretLeft) => String(icon.content[0]?.attrs['d']);

module('Integration | Component | Pagination', (hooks) => {
  setupRenderingTest(hooks);

  test('should render with default items per page and page count', async function (assert) {
    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{noop}} />
      </template>,
    );

    assert.dom('[data-pagination]').exists();
    assert.dom('[data-total-items]').hasText('25');
    assert.dom('[data-displayed-item-range]').hasText('0 - 10');
  });

  test("its arrows are Carbon React's carets", async function (assert) {
    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{noop}} />
      </template>,
    );

    assert
      .dom('[data-page-backward] svg path')
      .hasAttribute('d', pathOf(caretLeft));
    assert
      .dom('[data-page-forward] svg path')
      .hasAttribute('d', pathOf(caretRight));
  });

  test('backward/forward buttons default to "Previous page"/"Next page" as aria-label and tooltip content', async function (assert) {
    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{noop}} />
      </template>,
    );

    assert
      .dom('[data-page-backward]')
      .hasAttribute('aria-label', 'Previous page');
    assert.dom('[data-page-forward]').hasAttribute('aria-label', 'Next page');

    const tooltipContents = document.querySelectorAll('.cds--tooltip-content');
    assert.strictEqual(
      tooltipContents[0]?.textContent?.trim(),
      'Previous page',
    );
    assert.strictEqual(tooltipContents[1]?.textContent?.trim(), 'Next page');
  });

  test('@backwardText/@forwardText customize the aria-label and tooltip content', async function (assert) {
    await render(
      <template>
        <Pagination
          @length={{25}}
          @onPageChanged={{noop}}
          @backwardText="Prior"
          @forwardText="Later"
        />
      </template>,
    );

    assert.dom('[data-page-backward]').hasAttribute('aria-label', 'Prior');
    assert.dom('[data-page-forward]').hasAttribute('aria-label', 'Later');

    const tooltipContents = document.querySelectorAll('.cds--tooltip-content');
    assert.strictEqual(tooltipContents[0]?.textContent?.trim(), 'Prior');
    assert.strictEqual(tooltipContents[1]?.textContent?.trim(), 'Later');
  });

  test('@backwardTextTooltipPosition/@forwardTextTooltipPosition set the tooltip alignment', async function (assert) {
    await render(
      <template>
        <Pagination
          @length={{25}}
          @onPageChanged={{noop}}
          @backwardTextTooltipPosition="left"
          @forwardTextTooltipPosition="right"
        />
      </template>,
    );

    const tooltips = document.querySelectorAll('.cds--tooltip');
    assert.dom(tooltips[0]).hasClass('cds--popover--left');
    assert.dom(tooltips[1]).hasClass('cds--popover--right');
  });

  test('clicking forward/backward changes the current page', async function (assert) {
    const onPageChanged = (slice: { page: number }) => {
      assert.step(`page-${slice.page}`);
    };

    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{onPageChanged}} />
      </template>,
    );

    assert.dom('[data-page-backward]').isDisabled();

    await click('[data-page-forward]');

    assert.dom('[data-displayed-item-range]').hasText('10 - 20');
    assert.dom('[data-page-backward]').isNotDisabled();

    await click('[data-page-backward]');

    assert.dom('[data-displayed-item-range]').hasText('0 - 10');
    assert.verifySteps(['page-1', 'page-2', 'page-1']);
  });

  test('a length that divides evenly has no extra empty page', async function (assert) {
    await render(
      <template>
        <Pagination @length={{20}} @onPageChanged={{noop}} />
      </template>,
    );

    assert.dom('[data-page-forward]').isNotDisabled();
    await click('[data-page-forward]');
    assert.dom('[data-displayed-item-range]').hasText('10 - 20');
    assert
      .dom('[data-page-forward]')
      .isDisabled('20 items at 10 per page are 2 pages, not 3');
  });

  test('pages forward when @state is fed back from @onPageChanged', async function (assert) {
    // DataTable's setup: the parent keeps the slice and passes it back.
    const state = trackedObject({ slice: { page: 1, itemsPerPage: 10 } });
    const onPageChanged = (slice: { page: number; itemsPerPage: number }) => {
      state.slice = { page: slice.page, itemsPerPage: slice.itemsPerPage };
    };

    await render(
      <template>
        <Pagination
          @length={{25}}
          @state={{state.slice}}
          @onPageChanged={{onPageChanged}}
        />
      </template>,
    );

    await click('[data-page-forward]');
    assert.dom('[data-displayed-item-range]').hasText('10 - 20');
    assert.strictEqual(state.slice.page, 2);

    await click('[data-page-forward]');
    assert.dom('[data-displayed-item-range]').hasText('20 - 30');
    assert.strictEqual(state.slice.page, 3);
  });

  test('its selects are named by their labels', async function (assert) {
    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{noop}} />
      </template>,
    );

    const names = Array.from(document.querySelectorAll('select')).map(
      (select) =>
        document
          .querySelector(`label[for="${select.id}"]`)
          ?.textContent?.replace(/\s+/g, ' ')
          .trim(),
    );
    assert.deepEqual(names, ['Items per page:', 'Page 1 of 3 pages']);
  });

  test('the selects change the page size and the page', async function (assert) {
    const onPageChanged = (slice: { page: number; itemsPerPage: number }) => {
      assert.step(`page-${slice.page}-of-${slice.itemsPerPage}`);
    };

    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{onPageChanged}} />
      </template>,
    );

    assert.dom('.cds--select__item-count select').hasValue('10');
    assert.dom('.cds--select__page-number select').hasValue('1');
    assert.dom('.cds--select__page-number option').exists({ count: 3 });

    await select('.cds--select__page-number select', '3');
    assert.dom('[data-displayed-item-range]').hasText('20 - 30');

    await select('.cds--select__item-count select', '20');
    assert.dom('.cds--select__page-number option').exists({ count: 2 });
    assert.dom('.cds--select__page-number select').hasValue('1');
    assert.dom('[data-displayed-item-range]').hasText('0 - 20');
    assert.verifySteps(['page-1-of-10', 'page-3-of-10', 'page-1-of-20']);
  });

  test('starts from the initial @state', async function (assert) {
    const state = { page: 2, itemsPerPage: 5 };

    await render(
      <template>
        <Pagination @length={{25}} @state={{state}} @onPageChanged={{noop}} />
      </template>,
    );

    assert.dom('[data-displayed-item-range]').hasText('5 - 10');
  });

  test('a shorter @length brings the page back within range', async function (assert) {
    const length = tracked(30);

    await render(
      <template>
        <Pagination @length={{length.value}} @onPageChanged={{noop}} />
      </template>,
    );

    await click('[data-page-forward]');
    await click('[data-page-forward]');
    assert.dom('[data-displayed-item-range]').hasText('20 - 30');

    length.value = 10;
    await settled();
    assert.dom('[data-displayed-item-range]').hasText('0 - 10');
  });

  test('a shorter @length leaves an unchanged @state alone', async function (assert) {
    const state = { page: 2, itemsPerPage: 5 };
    const length = tracked(25);

    await render(
      <template>
        <Pagination
          @length={{length.value}}
          @state={{state}}
          @onPageChanged={{noop}}
        />
      </template>,
    );

    await click('[data-page-forward]');
    await click('[data-page-forward]');
    assert.dom('[data-displayed-item-range]').hasText('15 - 20');

    // 12 items make 3 pages: the last one, not @state's page 2.
    length.value = 12;
    await settled();
    assert.dom('[data-displayed-item-range]').hasText('10 - 15');
  });

  test('@disabled disables the navigation buttons', async function (assert) {
    await render(
      <template>
        <Pagination @length={{25}} @onPageChanged={{noop}} @disabled={{true}} />
      </template>,
    );

    assert.dom('[data-page-forward]').isDisabled();
    assert.dom('[data-page-backward]').isDisabled();
  });

  test('@renderPageSelect renders a custom page-selection control instead of the default select', async function (assert) {
    const CustomPageSelect: TOC<{
      Args: {
        currentPage: number;
        totalPages: number;
        currentPageSize: number;
        pageSelectLabelText: string;
        onSetPage: (page: number) => void;
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

    await render(
      <template>
        <Pagination
          @length={{100}}
          @onPageChanged={{noop}}
          @renderPageSelect={{CustomPageSelect}}
        />
      </template>,
    );

    assert.dom('[data-custom-page-select]').exists();
    assert.dom('[data-custom-page-select]').hasText('1/10');
    assert.dom('.cds--pagination__right .cds--select').doesNotExist();

    await click('[data-custom-page-select]');

    assert.dom('[data-custom-page-select]').hasText('3/10');
  });
});
