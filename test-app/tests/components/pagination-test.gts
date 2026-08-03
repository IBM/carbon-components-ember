import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import Pagination from 'carbon-components-ember/components/pagination';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

const noop = () => null;

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
    assert.strictEqual(tooltipContents[0]?.textContent?.trim(), 'Previous page');
    assert.strictEqual(tooltipContents[1]?.textContent?.trim(), 'Next page');
  });

  test('@backwardText/@forwardText customize the aria-label and tooltip content', async function (assert) {
    await render(
      <template>
        <Pagination
          @length={{25}}
          @onPageChanged={{noop}}
          @backwardText='Prior'
          @forwardText='Later'
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
          @backwardTextTooltipPosition='left'
          @forwardTextTooltipPosition='right'
        />
      </template>,
    );

    const tooltips = document.querySelectorAll('.cds--tooltip');
    assert.dom(tooltips[0] as HTMLElement).hasClass('cds--popover--left');
    assert.dom(tooltips[1] as HTMLElement).hasClass('cds--popover--right');
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

  test('@disabled disables the navigation buttons', async function (assert) {
    await render(
      <template>
        <Pagination
          @length={{25}}
          @onPageChanged={{noop}}
          @disabled={{true}}
        />
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
        type='button'
        data-custom-page-select
        {{! template-lint-disable require-button-type }}
        aria-label={{@pageSelectLabelText}}
        {{on 'click' (fn @onSetPage 3)}}
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
    assert.dom('[data-custom-page-select]').hasText('1/11');
    assert
      .dom('.cds--pagination__right .cds--select__item-count')
      .doesNotExist();

    await click('[data-custom-page-select]');

    assert.dom('[data-custom-page-select]').hasText('3/11');
  });
});
