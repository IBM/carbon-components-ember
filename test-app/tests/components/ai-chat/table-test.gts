import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, waitUntil, find } from '@ember/test-helpers';
import AiChatTable, {
  type AiChatTableRow,
  type AiChatTableCell,
} from 'carbon-components-ember/components/ai-chat/table';

const headers: AiChatTableCell[] = [{ text: 'Name' }, { text: 'Status' }];

function rowsOf(count: number): AiChatTableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    cells: [{ text: `Row ${i + 1}` }, { text: i % 2 === 0 ? 'Active' : 'Inactive' }],
  }));
}

module('Integration | Component | ai-chat/AiChatTable', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the headers and rows', async function (assert) {
    const rows = rowsOf(3);

    await render(
      <template>
        <AiChatTable @tableTitle='My table' @headers={{headers}} @rows={{rows}} />
      </template>,
    );

    assert.dom('.cds--data-table-header__title').hasText('My table');
    assert.dom('thead th').exists({ count: 2 });
    assert.dom('tbody tr').exists({ count: 3 });
    assert.dom('tbody tr:first-child td:first-child').hasText('Row 1');
  });

  test('it renders a loading skeleton and no table when @loading is true', async function (assert) {
    const rows = rowsOf(3);

    await render(
      <template>
        <AiChatTable @headers={{headers}} @rows={{rows}} @loading={{true}} />
      </template>,
    );

    assert.dom('[data-loading]').exists();
    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('.cds--search').doesNotExist();
  });

  test('it filters rows by any cell text', async function (assert) {
    const rows = rowsOf(3);

    await render(
      <template><AiChatTable @headers={{headers}} @rows={{rows}} /></template>,
    );

    await fillIn('input.cds--search-input', 'Row 2');

    assert.dom('tbody tr').exists({ count: 1 });
    assert.dom('tbody tr:first-child td:first-child').hasText('Row 2');
  });

  test('it clears the filter when the search field is cleared via its close button', async function (assert) {
    const rows = rowsOf(3);

    await render(
      <template><AiChatTable @headers={{headers}} @rows={{rows}} /></template>,
    );

    await fillIn('input.cds--search-input', 'Row 2');
    assert.dom('tbody tr').exists({ count: 1 });

    await click('.cds--search-close');

    assert.dom('input.cds--search-input').hasValue('');
    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('it sorts rows when a column header is clicked', async function (assert) {
    const rows: AiChatTableRow[] = [
      { cells: [{ text: 'Charlie' }, { text: 'Active' }] },
      { cells: [{ text: 'Alice' }, { text: 'Active' }] },
      { cells: [{ text: 'Bob' }, { text: 'Active' }] },
    ];

    await render(
      <template><AiChatTable @headers={{headers}} @rows={{rows}} /></template>,
    );

    await click('thead th:first-child button');

    assert.dom('tbody tr:nth-child(1) td:first-child').hasText('Alice');
    assert.dom('tbody tr:nth-child(2) td:first-child').hasText('Bob');
    assert.dom('tbody tr:nth-child(3) td:first-child').hasText('Charlie');

    await click('thead th:first-child button');

    assert.dom('tbody tr:nth-child(1) td:first-child').hasText('Charlie');
  });

  test('it hides pagination when there are no more rows than the page size', async function (assert) {
    const rows = rowsOf(3);

    await render(
      <template>
        <AiChatTable @headers={{headers}} @rows={{rows}} @defaultPageSize={{5}} />
      </template>,
    );

    assert.dom('.cds--pagination').doesNotExist();
  });

  test('it shows pagination and paginates when there are more rows than the page size', async function (assert) {
    const rows = rowsOf(8);

    await render(
      <template>
        <AiChatTable @headers={{headers}} @rows={{rows}} @defaultPageSize={{5}} />
      </template>,
    );

    assert.dom('.cds--pagination').exists();
    assert.dom('tbody tr').exists({ count: 5 });
  });

  test('it keeps the default page size after pagination unmounts and remounts due to filtering', async function (assert) {
    const rows = rowsOf(8);

    await render(
      <template>
        <AiChatTable @headers={{headers}} @rows={{rows}} @defaultPageSize={{5}} />
      </template>,
    );

    assert.dom('.cds--pagination').exists('pagination shown for 8 rows at page size 5');
    assert.dom('tbody tr').exists({ count: 5 });

    // Narrow the filter to 2 matches, dropping Pagination from the DOM.
    await fillIn('input.cds--search-input', 'Row 2');
    assert.dom('.cds--pagination').doesNotExist();

    // Clearing brings back a brand-new Pagination instance, which must not
    // discard @defaultPageSize in favor of Pagination's own hardcoded
    // initial itemsPerPage of 10.
    await fillIn('input.cds--search-input', '');

    assert.dom('.cds--pagination').exists();
    assert.dom('tbody tr').exists({ count: 5 });
  });

  test('it triggers a CSV download of the full, unfiltered table when the download button is clicked', async function (assert) {
    const rows: AiChatTableRow[] = [
      { cells: [{ text: 'Ann, Bob' }, { text: 'Active' }] },
    ];
    let capturedHref: string | undefined;
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      capturedHref = this.getAttribute('href') ?? undefined;
    };

    try {
      await render(
        <template>
          <AiChatTable
            @headers={{headers}}
            @rows={{rows}}
            @downloadLabelText='Download'
          />
        </template>,
      );

      await click('.cds-aichat-table-container .cds--btn');

      assert.ok(capturedHref, 'a download link was clicked');
      const csv = decodeURIComponent(capturedHref!.split(',').slice(1).join(','));
      // Leading `sep=,` line forces Excel to parse with a comma delimiter
      // regardless of the OS/Excel locale's own list separator - see
      // `download()`'s comment for why this isn't part of `stringifyCSV`
      // itself.
      assert.strictEqual(csv, 'sep=,\nName,Status\n"Ann, Bob",Active\n');
    } finally {
      HTMLAnchorElement.prototype.click = originalClick;
    }
  });

  test('it opts the download icon out of the default icon margin', async function (assert) {
    const rows = rowsOf(3);

    await render(<template><AiChatTable @headers={{headers}} @rows={{rows}} /></template>);
    await waitUntil(() => find('.cds-aichat-table-container .cds--btn svg'));

    assert
      .dom('.cds-aichat-table-container .cds--btn svg')
      .hasClass('cds-aichat-table__download-icon');
  });
});
