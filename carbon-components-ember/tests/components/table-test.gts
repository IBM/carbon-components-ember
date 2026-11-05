import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled, waitUntil } from '@ember/test-helpers';
import style from 'ember-style-modifier';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import { trackedObject } from '@ember/reactive/collections';
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

  module('experimentalAutoAlign', () => {
    const LONG = 'A load balancer whose name wraps in a narrow column';

    test('a body cell that wraps top-aligns the body, and a header label that wraps the header', async function (assert) {
      await render(
        <template>
          <div {{style width="160px"}}>
            <Table @experimentalAutoAlign={{true}} data-test-wrapping-body>
              <TableHead>
                <TableRow><TableHeader>Name</TableHeader></TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>{{LONG}}</TableCell></TableRow>
              </TableBody>
            </Table>
            <Table @experimentalAutoAlign={{true}} data-test-wrapping-header>
              <TableHead>
                <TableRow><TableHeader
                    @isSortable={{true}}
                  >{{LONG}}</TableHeader></TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Ada</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </template>,
      );
      await waitUntil(
        () =>
          document.querySelector(
            '[data-test-wrapping-body].cds--data-table--top-aligned-body',
          ) &&
          document.querySelector(
            '[data-test-wrapping-header].cds--data-table--top-aligned-header',
          ),
      );

      assert
        .dom('[data-test-wrapping-body]')
        .hasClass('cds--data-table--top-aligned-body')
        .doesNotHaveClass('cds--data-table--top-aligned-header');
      assert
        .dom('[data-test-wrapping-header]')
        .hasClass('cds--data-table--top-aligned-header')
        .doesNotHaveClass('cds--data-table--top-aligned-body');
    });

    test('a table whose cells fit, or without the argument, is not top-aligned', async function (assert) {
      await render(
        <template>
          <Table @experimentalAutoAlign={{true}} data-test-fits>
            <TableHead>
              <TableRow><TableHeader>Name</TableHeader></TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>Ada</TableCell></TableRow>
            </TableBody>
          </Table>
          <div {{style width="160px"}}>
            <Table data-test-off>
              <TableBody>
                <TableRow><TableCell>{{LONG}}</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </template>,
      );

      assert
        .dom('[data-test-fits]')
        .doesNotHaveClass('cds--data-table--top-aligned-body')
        .doesNotHaveClass('cds--data-table--top-aligned-header');
      assert
        .dom('[data-test-off]')
        .doesNotHaveClass('cds--data-table--top-aligned-body');
    });

    test('it measures again when the table resizes, and when the argument is turned off', async function (assert) {
      const state = trackedObject({ width: '600px', enabled: true });
      await render(
        <template>
          <div {{style width=state.width}}>
            <Table @experimentalAutoAlign={{state.enabled}} data-test-table>
              <TableBody>
                <TableRow><TableCell>{{LONG}}</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </template>,
      );

      assert
        .dom('[data-test-table]')
        .doesNotHaveClass('cds--data-table--top-aligned-body');

      state.width = '160px';
      await waitUntil(() =>
        document
          .querySelector('[data-test-table]')
          ?.classList.contains('cds--data-table--top-aligned-body'),
      );
      assert
        .dom('[data-test-table]')
        .hasClass('cds--data-table--top-aligned-body');

      state.enabled = false;
      await settled();
      assert
        .dom('[data-test-table]')
        .doesNotHaveClass('cds--data-table--top-aligned-body');
    });
  });

  module('TableHeader decorator', () => {
    test('the decorator block yields a mini AI label and adds the decorator classes', async function (assert) {
      await render(
        <template>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader data-test-plain>
                  <:default>Name</:default>
                  <:decorator as |AILabel|><AILabel /></:decorator>
                </TableHeader>
                <TableHeader @isSortable={{true}}>
                  <:default>Role</:default>
                  <:decorator as |AILabel|><AILabel /></:decorator>
                </TableHeader>
                <TableHeader>Plain</TableHeader>
              </TableRow>
            </TableHead>
          </Table>
        </template>,
      );

      assert
        .dom('th:nth-child(1) .cds--table-header-label')
        .hasClass('cds--table-header-label--decorator')
        .hasClass('cds--table-header-label--ai-label');
      assert
        .dom(
          'th:nth-child(1) .cds--table-header-label--decorator-inner .cds--ai-label__button--mini',
        )
        .exists();
      assert
        .dom('th:nth-child(2)')
        .hasClass('cds--table-sort__header--decorator')
        .hasClass('cds--table-sort__header--ai-label');
      assert
        .dom(
          'th:nth-child(2) > .cds--table-header-label--decorator-inner .cds--ai-label__button--mini',
        )
        .exists();
      assert
        .dom('th:nth-child(2) .cds--table-sort')
        .hasText('Role', 'the label is not read from the decorator');
      assert
        .dom('th:nth-child(3) .cds--table-header-label')
        .doesNotHaveClass('cds--table-header-label--decorator');
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
