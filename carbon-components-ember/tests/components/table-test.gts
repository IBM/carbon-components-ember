import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import Table from '#src/components/table/table.gts';
import TableBody from '#src/components/table/table-body.gts';
import TableCell from '#src/components/table/table-cell.gts';
import TableContainer from '#src/components/table/table-container.gts';
import TableHead from '#src/components/table/table-head.gts';
import TableHeader, {
  sortStates,
} from '#src/components/table/table-header.gts';
import TableRow from '#src/components/table/table-row.gts';

module('Integration | Component | Table', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders a table in its wrapper, large by default', async function (assert) {
    await render(
      <template>
        <Table data-test-table>
          <TableHead>
            <TableRow><TableHeader>Name</TableHeader></TableRow>
          </TableHead>
          <TableBody>
            <TableRow><TableCell>Ada</TableCell></TableRow>
          </TableBody>
        </Table>
      </template>,
    );

    assert
      .dom('.cds--data-table-content > table[data-test-table]')
      .hasClass('cds--data-table')
      .hasClass('cds--data-table--lg');
    assert.dom('thead th').hasAttribute('scope', 'col').hasText('Name');
    assert.dom('tbody').hasAria('live', 'polite');
    assert.dom('tbody td').hasText('Ada');
  });

  test('size, zebra, static width, sorting and visible overflow menus add their classes', async function (assert) {
    await render(
      <template>
        <Table
          @size="sm"
          @useZebraStyles={{true}}
          @useStaticWidth={{true}}
          @isSortable={{true}}
          @overflowMenuOnHover={{false}}
          class="mine"
        />
      </template>,
    );

    assert
      .dom('table')
      .hasClass('cds--data-table--sm')
      .doesNotHaveClass('cds--data-table--lg')
      .hasClass('cds--data-table--zebra')
      .hasClass('cds--data-table--static')
      .hasClass('cds--data-table--sort')
      .hasClass('cds--data-table--visible-overflow-menu')
      .hasClass('mine');
  });

  test('stickyHeader wraps the table in a section and adds its class', async function (assert) {
    await render(<template><Table @stickyHeader={{true}} /></template>);

    assert
      .dom(
        'section.cds--data-table_inner-container > .cds--data-table-content > table',
      )
      .hasClass('cds--data-table--sticky-header');
  });

  test('a selected row has its class, and a cell the AI column class', async function (assert) {
    await render(
      <template>
        <table>
          <tbody>
            <TableRow @isSelected={{true}} data-test-row>
              <TableCell @hasAILabelHeader={{true}}>Ada</TableCell>
            </TableRow>
          </tbody>
        </table>
      </template>,
    );

    assert.dom('[data-test-row]').hasClass('cds--data-table--selected');
    assert.dom('td').hasClass('cds--table-cell--column-slug');
  });

  test('a header takes scope and colSpan, and renders nothing for an empty label', async function (assert) {
    await render(
      <template>
        <table>
          <thead>
            <tr>
              <TableHeader
                @scope="row"
                @colSpan={{3}}
                @id="h1"
              >Name</TableHeader>
              <TableHeader data-test-empty />
            </tr>
          </thead>
        </table>
      </template>,
    );

    assert.dom('#h1').hasAttribute('scope', 'row').hasAttribute('colspan', '3');
    assert.dom('#h1 .cds--table-header-label').hasText('Name');
    assert.dom('[data-test-empty]').hasAttribute('scope', 'col');
    assert.dom('[data-test-empty] *').doesNotExist();
  });

  module('sortable TableHeader', () => {
    class Sort {
      @tracked direction: 'NONE' | 'ASC' | 'DESC' = sortStates.NONE;
      clicks = 0;
      onClick = () => {
        this.clicks++;
        this.direction =
          this.direction === sortStates.NONE
            ? sortStates.ASC
            : this.direction === sortStates.ASC
              ? sortStates.DESC
              : sortStates.NONE;
      };
    }

    test('it renders a button with both sort icons, and a click reaches the caller', async function (assert) {
      const sort = new Sort();
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableHeader
                  @isSortable={{true}}
                  @isSortHeader={{true}}
                  @sortDirection={{sort.direction}}
                  {{on "click" sort.onClick}}
                >Name</TableHeader>
              </tr>
            </thead>
          </table>
        </template>,
      );

      assert.dom('th.cds--table-sort__header').hasAria('sort', 'none');
      assert
        .dom('th button.cds--table-sort')
        .hasAttribute('type', 'button')
        .doesNotHaveClass('cds--table-sort--active');
      assert.dom('button .cds--table-header-label').hasText('Name');
      assert.dom('button svg.cds--table-sort__icon').exists();
      assert.dom('button svg.cds--table-sort__icon-unsorted').exists();

      await click('button');
      assert.strictEqual(sort.clicks, 1);
      assert.dom('th').hasAria('sort', 'ascending');
      assert.dom('button').hasClass('cds--table-sort--active');
      assert.dom('button').doesNotHaveClass('cds--table-sort--descending');

      await click('button');
      assert.dom('th').hasAria('sort', 'descending');
      assert.dom('button').hasClass('cds--table-sort--descending');

      await click('button');
      assert.dom('th').hasAria('sort', 'none');
      assert.dom('button').doesNotHaveClass('cds--table-sort--active');
    });

    test('the button is described by what a click does', async function (this: RenderingTestContext, assert) {
      const sort = new Sort();
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableHeader
                  @isSortable={{true}}
                  @isSortHeader={{true}}
                  @sortDirection={{sort.direction}}
                  {{on "click" sort.onClick}}
                >Name</TableHeader>
                <TableHeader @isSortable={{true}}>Role</TableHeader>
              </tr>
            </thead>
          </table>
        </template>,
      );

      const describedBy = (header: number) => {
        const button = this.element.querySelectorAll('button')[header]!;
        return this.element.querySelector(
          `#${button.getAttribute('aria-describedby')}`,
        )!;
      };

      assert
        .dom(describedBy(0))
        .hasText('Click to sort rows by Name header in ascending order');
      assert
        .dom(describedBy(1))
        .hasText('Click to sort rows by Role header in ascending order');
      await click('button');
      assert
        .dom(describedBy(0))
        .hasText('Click to sort rows by Name header in descending order');
      await click('button');
      assert.dom(describedBy(0)).hasText('Click to unsort rows by Name header');
    });

    test('translateWithId translates the description', async function (assert) {
      const headers: string[] = [];
      const translate = (
        messageId: string,
        { header, sortDirection }: { header: string; sortDirection?: string },
      ) => {
        headers.push(header);
        return `${messageId}: ${header} ${sortDirection ?? 'unsorted'}`;
      };
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableHeader
                  @isSortable={{true}}
                  @sortDirection="ASC"
                  @translateWithId={{translate}}
                >
                  Name
                </TableHeader>
              </tr>
            </thead>
          </table>
        </template>,
      );

      assert
        .dom('.cds--table-sort__description')
        .hasText('carbon.table.header.icon.description: Name ASC');
      assert.strictEqual(headers.at(-1), 'Name', 'the label is trimmed');
    });

    test('@className styles the cell and the button', async function (assert) {
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableHeader
                  @className="name-column"
                  @isSortable={{true}}
                  class="name-button"
                >Name</TableHeader>
                <TableHeader @className="role-column">Role</TableHeader>
              </tr>
            </thead>
          </table>
        </template>,
      );

      assert.dom('th:first-child').hasClass('name-column');
      assert.dom('th:first-child').doesNotHaveClass('name-button');
      assert.dom('button').hasClass('name-column');
      assert.dom('button').hasClass('name-button');
      assert.dom('th:last-child').hasClass('role-column');
    });
  });

  module('TableContainer', () => {
    test('it renders the title and description, which name the table', async function (assert) {
      await render(
        <template>
          <TableContainer
            @title="Team"
            @description="Who works here"
            data-test-container
            as |Table|
          >
            <Table />
          </TableContainer>
        </template>,
      );

      assert
        .dom('section.cds--data-table-container[data-test-container]')
        .exists();
      assert
        .dom('.cds--data-table-header__title')
        .hasTagName('h2')
        .hasText('Team');
      assert
        .dom('.cds--data-table-header__description')
        .hasText('Who works here');

      const title = document.querySelector('.cds--data-table-header__title')!;
      const description = document.querySelector(
        '.cds--data-table-header__description',
      )!;
      assert.dom('table').hasAria('labelledby', title.id);
      assert.dom('table').hasAria('describedby', description.id);
    });

    test('it has no header, and the table no names, without a title, description or decorator', async function (assert) {
      await render(
        <template>
          <TableContainer as |Table|><Table /></TableContainer>
        </template>,
      );

      assert.dom('.cds--data-table-header').doesNotExist();
      assert.dom('table').doesNotHaveAttribute('aria-labelledby');
      assert.dom('table').doesNotHaveAttribute('aria-describedby');
    });

    test('stickyHeader, useStaticWidth and aiEnabled add their classes', async function (assert) {
      await render(
        <template>
          <TableContainer
            @stickyHeader={{true}}
            @useStaticWidth={{true}}
            @aiEnabled={{true}}
          />
        </template>,
      );

      assert
        .dom('.cds--data-table-container')
        .hasClass('cds--data-table--max-width')
        .hasClass('cds--data-table-container--static')
        .hasClass('cds--data-table-container--ai-enabled');
    });

    test('the decorator block goes beside the title', async function (assert) {
      await render(
        <template>
          <TableContainer @title="Team">
            <:decorator><span data-test-decorator>AI</span></:decorator>
          </TableContainer>
          <TableContainer data-test-standalone>
            <:decorator>AI</:decorator>
          </TableContainer>
        </template>,
      );

      assert
        .dom(
          '.cds--data-table-header__with-decorator .cds--data-table-header__decorator [data-test-decorator]',
        )
        .exists();
      assert
        .dom(
          '[data-test-standalone] .cds--data-table-header__with-decorator--standalone',
        )
        .exists();
      assert
        .dom('[data-test-standalone] .cds--data-table-header__content')
        .doesNotExist();
    });
  });
});
