import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  focus,
  render,
  triggerKeyEvent,
} from '@ember/test-helpers';
import StructuredListBody from '#src/components/structured-list/structured-list-body.gts';
import StructuredListCell from '#src/components/structured-list/structured-list-cell.gts';
import StructuredListHead from '#src/components/structured-list/structured-list-head.gts';
import StructuredListWrapper from '#src/components/structured-list/structured-list-wrapper.gts';

module('Integration | Component | StructuredList', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders rows and columns, named "Structured list section" by default', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper as |StructuredListRow|>
          <StructuredListHead>
            <StructuredListRow @head={{true}}>
              <StructuredListCell @head={{true}}>ColumnA</StructuredListCell>
              <StructuredListCell @head={{true}}>ColumnB</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell>Row 1</StructuredListCell>
              <StructuredListCell>Row 1</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
        <StructuredListWrapper aria-label="Services" data-test-named />
      </template>,
    );

    assert
      .dom('.cds--structured-list')
      .hasAttribute('role', 'table')
      .hasAria('label', 'Structured list section');
    assert.dom('[data-test-named]').hasAria('label', 'Services');
    assert.dom('.cds--structured-list-thead').hasAttribute('role', 'rowgroup');
    assert.dom('.cds--structured-list-tbody').hasAttribute('role', 'rowgroup');
    assert.dom('.cds--structured-list-th').exists({ count: 2 });
    assert.dom('.cds--structured-list-td').exists({ count: 2 });
    assert.dom('.cds--structured-list-row--header-row').exists({ count: 1 });
  });

  test('isCondensed and isFlush add their classes, and isFlush does nothing with selection', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper
          @isCondensed={{true}}
          @isFlush={{true}}
          data-test-flush
        />
        <StructuredListWrapper
          @isFlush={{true}}
          @selection={{true}}
          data-test-selection
        />
      </template>,
    );

    assert
      .dom('[data-test-flush]')
      .hasClass('cds--structured-list--condensed')
      .hasClass('cds--structured-list--flush');
    assert
      .dom('[data-test-selection]')
      .hasClass('cds--structured-list--selection')
      .doesNotHaveClass('cds--structured-list--flush');
  });

  test('a click on a row selects it, and its input tells which', async function (assert) {
    const chosen: string[] = [];
    const choose = (event: Event) =>
      chosen.push((event.target as HTMLInputElement).value);
    await render(
      <template>
        <StructuredListWrapper @selection={{true}} as |StructuredListRow|>
          <StructuredListBody>
            <StructuredListRow @id="row-1" as |StructuredListInput|>
              <StructuredListInput {{on "change" choose}} />
              <StructuredListCell>Row 1</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow @id="row-2" as |StructuredListInput|>
              <StructuredListInput {{on "change" choose}} />
              <StructuredListCell>Row 2</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    assert.dom('.cds--structured-list-row--selected').doesNotExist();

    await click('[value="row-2"]');
    assert.dom('[value="row-2"]').isChecked();
    assert.deepEqual(chosen, ['row-2']);
    assert.dom('.cds--structured-list-row--selected').exists({ count: 1 });

    await click(
      '.cds--structured-list-row:first-child .cds--structured-list-td',
    );
    assert.dom('[value="row-1"]').isChecked();
    assert.dom('[value="row-2"]').isNotChecked();
  });

  test('each input has its own id and name, as in Carbon React, unless given others', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper @selection={{true}} as |StructuredListRow|>
          <StructuredListBody>
            <StructuredListRow @id="row-1" as |StructuredListInput|>
              <StructuredListInput />
            </StructuredListRow>
            <StructuredListRow @id="row-2" as |StructuredListInput|>
              <StructuredListInput />
            </StructuredListRow>
            <StructuredListRow @id="row-3" as |StructuredListInput|>
              <StructuredListInput id="mine" name="other" title="Row 3" />
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    const [first, second] = Array.from(
      document.querySelectorAll<HTMLInputElement>('[value^="row-"]'),
    );
    assert.notStrictEqual(first?.name, second?.name, 'Tab visits every row');
    assert.notStrictEqual(first?.id, second?.id);
    assert
      .dom('[value="row-1"]')
      .hasAttribute('type', 'radio')
      .hasAttribute('tabindex', '0')
      .hasClass('cds--structured-list-input')
      .hasClass('cds--visually-hidden');
    assert
      .dom('[value="row-3"]')
      .hasAttribute('id', 'mine')
      .hasAttribute('name', 'other')
      .hasAttribute('title', 'Row 3');
  });

  test('selection rows keep to cells, with a radio icon, and the header names the selection column', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper
          @selection={{true}}
          @selectedInitialRow="row-2"
          as |StructuredListRow|
        >
          <StructuredListHead>
            <StructuredListRow @head={{true}} @selection={{true}}>
              <StructuredListCell @head={{true}}>Name</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow
              @id="row-1"
              @selection={{true}}
              as |StructuredListInput|
            >
              <StructuredListInput aria-label="Row 1" />
              <StructuredListCell>Row 1</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow
              @id="row-2"
              @selection={{true}}
              as |StructuredListInput|
            >
              <StructuredListInput aria-label="Row 2" />
              <StructuredListCell>Row 2</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    assert
      .dom('[role="row"] > [role="columnheader"]:first-child')
      .hasText('Selection');
    assert.dom('[role="row"] > [role="cell"] > input[value="row-1"]').exists();
    assert.dom('[role="row"] > input').doesNotExist();
    assert.dom('[value="row-2"]').isChecked();
    assert
      .dom('.cds--structured-list-row--selected .cds--structured-list__icon')
      .exists({ count: 1 });
    assert.dom('.cds--structured-list__icon').exists({ count: 2 });
  });

  test('without selection, a row shows focus while focus is in it', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper as |StructuredListRow|>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell>
                <a href="#">Link</a>
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    const row = '.cds--structured-list-tbody .cds--structured-list-row';
    assert.dom(row).doesNotHaveAttribute('tabindex');
    await focus('a');
    assert
      .dom(row)
      .doesNotHaveClass('cds--structured-list-row--focused-within');
    await blur('a');

    await click(row);
    assert
      .dom(row)
      .doesNotHaveClass(
        'cds--structured-list-row--focused-within',
        'a click shows focus only with selection',
      );
  });

  test('with selection, the focused row shows it while no other row is selected, until a click outside', async function (assert) {
    await render(
      <template>
        <button type="button" data-test-outside>Outside</button>
        <StructuredListWrapper @selection={{true}} as |StructuredListRow|>
          <StructuredListBody>
            <StructuredListRow
              @id="row-1"
              @selection={{true}}
              data-test-row="1"
              as |StructuredListInput|
            >
              <StructuredListInput aria-label="Row 1" />
              <StructuredListCell>Row 1</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow
              @id="row-2"
              @selection={{true}}
              data-test-row="2"
              as |StructuredListInput|
            >
              <StructuredListInput aria-label="Row 2" />
              <StructuredListCell>Row 2</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    const focused = 'cds--structured-list-row--focused-within';
    await focus('[value="row-2"]');
    assert.dom('[data-test-row="2"]').hasClass(focused, 'none selected yet');
    await blur('[value="row-2"]');
    assert.dom('[data-test-row="2"]').doesNotHaveClass(focused);

    await click('[data-test-row="1"]');
    assert.dom('[data-test-row="1"]').hasClass(focused);
    await focus('[value="row-2"]');
    assert
      .dom('[data-test-row="2"]')
      .doesNotHaveClass(focused, 'another row is selected');

    await click('[data-test-row="1"] .cds--structured-list-td');
    await click('[data-test-outside]');
    assert.dom('[data-test-row="1"]').doesNotHaveClass(focused);
  });

  test("a row's click and keydown reach the caller through its attributes", async function (assert) {
    const events: string[] = [];
    const record = (event: Event) => events.push(event.type);
    await render(
      <template>
        <StructuredListWrapper as |StructuredListRow|>
          <StructuredListBody>
            <StructuredListRow {{on "click" record}} {{on "keydown" record}}>
              <StructuredListCell>Row 1</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    await click('.cds--structured-list-row');
    await triggerKeyEvent('.cds--structured-list-row', 'keydown', 'Enter');
    assert.deepEqual(events, ['click', 'keydown']);
  });

  test('cells match Carbon React: noWrap, and a span heading or a div cell with dir auto', async function (assert) {
    await render(
      <template>
        <StructuredListWrapper as |StructuredListRow|>
          <StructuredListHead>
            <StructuredListRow @head={{true}}>
              <StructuredListCell @head={{true}}>ColumnA</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell @noWrap={{true}}>Row 1</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </template>,
    );

    assert
      .dom('span.cds--structured-list-th')
      .hasAttribute('role', 'columnheader')
      .hasAttribute('dir', 'auto');
    assert
      .dom('div.cds--structured-list-td')
      .hasAttribute('role', 'cell')
      .hasAttribute('dir', 'auto')
      .hasClass('cds--structured-list-content--nowrap');
  });
});
