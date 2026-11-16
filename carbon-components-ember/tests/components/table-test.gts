import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  render,
  settled,
  triggerEvent,
  waitUntil,
} from '@ember/test-helpers';
import style from 'ember-style-modifier';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import { trackedObject } from '@ember/reactive/collections';
import Table from '#src/components/table/table.gts';
import TableBody from '#src/components/table/table-body.gts';
import TableCell from '#src/components/table/table-cell.gts';
import TableContainer from '#src/components/table/table-container.gts';
import TableDecoratorRow from '#src/components/table/table-decorator-row.gts';
import TableExpandHeader from '#src/components/table/table-expand-header.gts';
import TableExpandRow from '#src/components/table/table-expand-row.gts';
import TableExpandedRow from '#src/components/table/table-expanded-row.gts';
import TableHead from '#src/components/table/table-head.gts';
import TableHeader, {
  sortStates,
} from '#src/components/table/table-header.gts';
import TableRow from '#src/components/table/table-row.gts';
import TableSelectAll from '#src/components/table/table-select-all.gts';
import TableSelectRow from '#src/components/table/table-select-row.gts';

const noop = () => {};

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

    test('tables measure again once fonts load, each on its own', async function (assert) {
      // Both tables wait on the fonts in the same render.
      Object.defineProperty(document, 'fonts', {
        configurable: true,
        value: { status: 'loading', ready: Promise.resolve() },
      });

      try {
        await render(
          <template>
            <Table @experimentalAutoAlign={{true}} />
            <Table @experimentalAutoAlign={{true}} />
          </template>,
        );
        assert.dom('table').exists({ count: 2 });
      } finally {
        Reflect.deleteProperty(document, 'fonts');
      }
    });

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

  module('TableSelectAll', () => {
    test('it renders a header cell with a checkbox named by default, and passes attributes to the th', async function (assert) {
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableSelectAll
                  @id="all"
                  @name="all"
                  @onSelect={{noop}}
                  class="mine"
                  data-test-th
                />
              </tr>
            </thead>
          </table>
        </template>,
      );

      assert
        .dom('[data-test-th]')
        .hasTagName('th')
        .hasClass('cds--table-column-checkbox')
        .hasClass('mine')
        .hasAttribute('scope', 'col')
        .hasAria('live', 'off');
      assert.dom('th input').hasAttribute('id', 'all');
      assert.dom('th label').hasText('Select all rows in the table');
    });

    test('ariaLabel, checked, disabled and indeterminate reach the checkbox', async function (assert) {
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableSelectAll
                  @id="all"
                  @name="all"
                  @onSelect={{noop}}
                  @ariaLabel="Every row"
                  @checked={{true}}
                  @disabled={{true}}
                />
                <TableSelectAll
                  @id="some"
                  @name="some"
                  @onSelect={{noop}}
                  @indeterminate={{true}}
                />
              </tr>
            </thead>
          </table>
        </template>,
      );

      assert.dom('#all').isChecked().isDisabled();
      assert.dom('label[for="all"]').hasText('Every row');
      assert.true((find('#some') as HTMLInputElement).indeterminate);
    });

    test('a click calls onSelect with the click event', async function (assert) {
      const types: string[] = [];
      const onSelect = (event: MouseEvent) => types.push(event.type);
      await render(
        <template>
          <table>
            <thead>
              <tr>
                <TableSelectAll @id="all" @name="all" @onSelect={{onSelect}} />
              </tr>
            </thead>
          </table>
        </template>,
      );

      await click('#all');

      assert.deepEqual(types, ['click']);
    });
  });

  module('TableSelectRow', () => {
    test('it renders a cell with a checkbox, and passes attributes to the td', async function (assert) {
      await render(
        <template>
          <table>
            <tbody>
              <tr>
                <TableSelectRow
                  @id="r1"
                  @onSelect={{noop}}
                  @ariaLabel="Select Ada"
                  class="mine"
                  data-test-td
                />
              </tr>
            </tbody>
          </table>
        </template>,
      );

      assert
        .dom('[data-test-td]')
        .hasTagName('td')
        .hasClass('cds--table-column-checkbox')
        .hasClass('mine')
        .doesNotHaveClass('cds--table-column-radio')
        .hasAria('live', 'off');
      assert
        .dom('td .cds--checkbox--inline input[type="checkbox"]')
        .hasAttribute('id', 'r1');
      assert.dom('td label').hasText('Select Ada');
      assert.notStrictEqual(
        (find('input') as HTMLInputElement).name,
        '',
        'the name defaults to a unique one',
      );
    });

    test('a checkbox reports clicks and changes', async function (assert) {
      const calls: unknown[] = [];
      const onSelect = (event: MouseEvent) => calls.push(event.type);
      const onChange = (checked: boolean, name: string, event: Event) =>
        calls.push([checked, name, event.type]);
      await render(
        <template>
          <table>
            <tbody>
              <tr>
                <TableSelectRow
                  @id="r1"
                  @name="rows"
                  @onSelect={{onSelect}}
                  @onChange={{onChange}}
                />
              </tr>
            </tbody>
          </table>
        </template>,
      );

      await click('#r1');

      assert.deepEqual(calls, ['click', [true, 'r1', 'change']]);
    });

    test('radio renders a radio button that reports clicks and changes', async function (assert) {
      const calls: unknown[] = [];
      const onSelect = (event: MouseEvent) => calls.push(event.type);
      const onChange = (checked: boolean, name: string, event: Event) =>
        calls.push([checked, name, event.type]);
      await render(
        <template>
          <table>
            <tbody>
              <tr>
                <TableSelectRow
                  @id="r1"
                  @name="rows"
                  @radio={{true}}
                  @ariaLabel="Select Ada"
                  @onSelect={{onSelect}}
                  @onChange={{onChange}}
                  data-test-td
                />
              </tr>
            </tbody>
          </table>
        </template>,
      );

      assert
        .dom('[data-test-td]')
        .hasClass('cds--table-column-checkbox')
        .hasClass('cds--table-column-radio');
      assert.dom('input[type="radio"]').hasAttribute('name', 'rows');
      assert.dom('td label').hasText('Select Ada');

      await click('#r1');

      assert.deepEqual(calls, ['click', [true, 'rows', 'change']]);
    });

    test('checked and disabled reach the control', async function (assert) {
      await render(
        <template>
          <table>
            <tbody>
              <tr>
                <TableSelectRow
                  @id="r1"
                  @onSelect={{noop}}
                  @checked={{true}}
                  @disabled={{true}}
                />
                <TableSelectRow
                  @id="r2"
                  @onSelect={{noop}}
                  @radio={{true}}
                  @checked={{true}}
                  @disabled={{true}}
                />
              </tr>
            </tbody>
          </table>
        </template>,
      );

      assert.dom('#r1').isChecked().isDisabled();
      assert.dom('#r2').isChecked().isDisabled();
    });
  });
});

module('Integration | Component | Table expansion', (hooks) => {
  setupRenderingTest(hooks);

  test('an expand row renders its button, and reports clicks', async function (assert) {
    const events: Event[] = [];
    const onExpand = (event: Event) => events.push(event);
    await render(
      <template>
        <Table>
          <TableBody>
            <TableExpandRow
              @onExpand={{onExpand}}
              @isExpanded={{true}}
              @isSelected={{true}}
              @ariaLabel="Expand Ada"
              @ariaControls="details"
              @expandIconDescription="Expand"
              data-test-row
            >
              <TableCell>Ada</TableCell>
            </TableExpandRow>
          </TableBody>
        </Table>
      </template>,
    );

    assert
      .dom('[data-test-row]')
      .hasClass('cds--parent-row')
      .hasClass('cds--expandable-row')
      .hasClass('cds--data-table--selected')
      .hasAttribute('data-parent-row', 'true');
    assert
      .dom('td.cds--table-expand')
      .hasAttribute('headers', 'expand')
      .hasAttribute('data-previous-value', 'collapsed');
    assert
      .dom('button.cds--table-expand__button')
      .hasAttribute('title', 'Expand')
      .hasAttribute('aria-label', 'Expand Ada')
      .hasAttribute('aria-controls', 'details')
      .hasAttribute('aria-expanded', 'true');

    await click('button');
    assert.strictEqual(events.length, 1);
  });

  test('a collapsed row says so, and an unset one leaves aria-expanded off', async function (assert) {
    await render(
      <template>
        <Table>
          <TableBody>
            <TableExpandRow @onExpand={{noop}} @isExpanded={{false}} />
            <TableExpandRow @onExpand={{noop}} @expandHeader="toggle" />
          </TableBody>
        </Table>
      </template>,
    );

    assert.dom('tr:first-child button').hasAttribute('aria-expanded', 'false');
    assert.dom('tr:first-child').doesNotHaveClass('cds--expandable-row');
    assert.dom('tr:last-child button').doesNotHaveAttribute('aria-expanded');
    assert.dom('tr:last-child td').hasAttribute('headers', 'toggle');
  });

  test('an expand row with a decorator block renders the AI label cell first', async function (assert) {
    await render(
      <template>
        <Table>
          <TableBody>
            <TableExpandRow @onExpand={{noop}} data-test-row>
              <:decorator as |AILabel|><AILabel @ariaLabel="AI" /></:decorator>
              <:default><TableCell>Ada</TableCell></:default>
            </TableExpandRow>
          </TableBody>
        </Table>
      </template>,
    );

    assert
      .dom('[data-test-row]')
      .hasClass('cds--data-table--slug-row')
      .hasClass('cds--data-table--ai-label-row');
    assert
      .dom('[data-test-row] > :first-child')
      .hasClass('cds--table-column-decorator')
      .hasClass('cds--table-column-decorator--active');
    assert
      .dom(
        '[data-test-row] .cds--table-column-decorator .cds--ai-label__button--mini',
      )
      .exists();
  });

  test('a decorator row is active only with a decorator', async function (assert) {
    await render(
      <template>
        <table><tbody><tr>
              <TableDecoratorRow data-test-empty />
              <TableDecoratorRow data-test-full>
                <:decorator as |AILabel|><AILabel
                    @ariaLabel="AI"
                  /></:decorator>
              </TableDecoratorRow>
            </tr></tbody></table>
      </template>,
    );

    assert
      .dom('[data-test-empty]')
      .hasClass('cds--table-column-decorator')
      .doesNotHaveClass('cds--table-column-decorator--active');
    assert
      .dom('[data-test-full]')
      .hasClass('cds--table-column-decorator--active');
    assert.dom('[data-test-full] .cds--ai-label').exists();
  });

  test('the expand header has its id, and a button only when enabled', async function (assert) {
    const events: Event[] = [];
    const onExpand = (event: Event) => events.push(event);
    await render(
      <template>
        <table>
          <thead><tr>
              <TableExpandHeader data-test-plain />
              <TableExpandHeader
                @enableToggle={{true}}
                @isExpanded={{true}}
                @onExpand={{onExpand}}
                @ariaLabel="Collapse all"
                @id="all"
                data-test-toggle
              />
            </tr></thead>
        </table>
      </template>,
    );

    assert
      .dom('[data-test-plain]')
      .hasClass('cds--table-expand')
      .hasAttribute('scope', 'col')
      .hasAttribute('id', 'expand')
      .doesNotHaveAttribute('data-previous-value');
    assert.dom('[data-test-plain] button').doesNotExist();
    assert
      .dom('[data-test-toggle]')
      .hasAttribute('id', 'all')
      .hasAttribute('data-previous-value', 'collapsed');
    assert
      .dom('[data-test-toggle] button')
      .hasAttribute('aria-label', 'Collapse all')
      .hasAttribute('aria-expanded', 'true');

    await click('[data-test-toggle] button');
    assert.strictEqual(events.length, 1);
  });

  test('an expanded row spans its columns, and hovering it marks the row above', async function (assert) {
    await render(
      <template>
        <Table>
          <TableBody>
            <TableExpandRow @onExpand={{noop}} data-test-parent />
            <TableExpandedRow @colSpan={{3}} data-test-child class="mine">
              Details
            </TableExpandedRow>
          </TableBody>
        </Table>
      </template>,
    );

    assert
      .dom('[data-test-child]')
      .hasClass('cds--expandable-row')
      .hasClass('mine')
      .hasAttribute('data-child-row', 'true');
    assert.dom('[data-test-child] td').hasAttribute('colspan', '3');
    assert
      .dom('[data-test-child] .cds--child-row-inner-container')
      .hasText('Details');

    await triggerEvent('[data-test-child]', 'mouseenter');
    assert.dom('[data-test-parent]').hasClass('cds--expandable-row--hover');
    await triggerEvent('[data-test-child]', 'mouseleave');
    assert
      .dom('[data-test-parent]')
      .doesNotHaveClass('cds--expandable-row--hover');
  });
});
