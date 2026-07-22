import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { array } from '@ember/helper';
import StructuredList from 'carbon-components-ember/components/structured-list';

module('Integration | Component | StructuredList', (hooks) => {
  setupRenderingTest(hooks);

  test('should render rows and columns', async function (assert) {
    await render(
      <template>
        <StructuredList as |SL|>
          <SL.Head>
            <SL.Row @head={{true}}>
              <SL.Cell @head={{true}}>ColumnA</SL.Cell>
              <SL.Cell @head={{true}}>ColumnB</SL.Cell>
            </SL.Row>
          </SL.Head>
          <SL.Body>
            <SL.Row>
              <SL.Cell>Row 1</SL.Cell>
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('.cds--structured-list').exists();
    assert.dom('.cds--structured-list').hasAttribute('role', 'table');
    assert
      .dom('.cds--structured-list')
      .hasAttribute('aria-label', 'Structured list section');
    assert.dom('.cds--structured-list-thead').exists();
    assert.dom('.cds--structured-list-tbody').exists();
    assert.dom('.cds--structured-list-th').exists({ count: 2 });
    assert.dom('.cds--structured-list-td').exists({ count: 2 });
    assert
      .dom('.cds--structured-list-row--header-row')
      .exists({ count: 1 });
  });

  test('should apply isCondensed and isFlush modifier classes', async function (assert) {
    await render(
      <template>
        <StructuredList @isCondensed={{true}} @isFlush={{true}} as |SL|>
          <SL.Body>
            <SL.Row><SL.Cell>Row 1</SL.Cell></SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('.cds--structured-list--condensed').exists();
    assert.dom('.cds--structured-list--flush').exists();
  });

  test('isFlush has no effect when selection is enabled', async function (assert) {
    await render(
      <template>
        <StructuredList @isFlush={{true}} @selection={{true}} as |SL|>
          <SL.Body>
            <SL.Row><SL.Cell>Row 1</SL.Cell></SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('.cds--structured-list--flush').doesNotExist();
    assert.dom('.cds--structured-list--selection').exists();
  });

  test('clicking a row selects it in a selection list', async function (assert) {
    await render(
      <template>
        <StructuredList @selection={{true}} as |SL|>
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert
      .dom('.cds--structured-list-row--selected')
      .doesNotExist('no row selected initially');

    await click('[value="row-2"]');

    assert.dom('.cds--structured-list-row--selected').exists({ count: 1 });
    assert.dom('[value="row-2"]').isChecked();
  });

  test('selectedInitialRow pre-selects a row', async function (assert) {
    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @selectedInitialRow='row-2'
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('[value="row-2"]').isChecked();
    assert.dom('.cds--structured-list-row--selected').exists({ count: 1 });
  });

  test('onSelectionChange is called with the selected row id', async function (assert) {
    const selections: string[] = [];
    const onSelectionChange = (id: string) => selections.push(id);

    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @onSelectionChange={{onSelectionChange}}
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    await click('[value="row-2"]');

    assert.deepEqual(selections, ['row-2']);
  });

  test('@selectedRow lets a consumer fully control selection alongside onSelectionChange', async function (assert) {
    class State {
      @tracked selectedRow = 'row-1';
    }
    const state = new State();
    const onSelectionChange = (id: string) => (state.selectedRow = id);

    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @selectedRow={{state.selectedRow}}
          @onSelectionChange={{onSelectionChange}}
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('[value="row-1"]').isChecked('starts at the controlled value');

    await click('[value="row-2"]');

    assert.strictEqual(
      state.selectedRow,
      'row-2',
      'onSelectionChange updated the external state',
    );
    assert
      .dom('[value="row-2"]')
      .isChecked('the controlled @selectedRow reflects the update');
    assert.dom('[value="row-1"]').isNotChecked();
  });

  test('multiSelection allows selecting more than one row', async function (assert) {
    await render(
      <template>
        <StructuredList @selection={{true}} @multiSelection={{true}} as |SL|>
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    await click('[value="row-1"]');
    await click('[value="row-2"]');

    assert.dom('.cds--structured-list-row--selected').exists({ count: 2 });
    assert.dom('[value="row-1"]').isChecked();
    assert.dom('[value="row-2"]').isChecked();

    await click('[value="row-1"]');

    assert.dom('.cds--structured-list-row--selected').exists({ count: 1 });
    assert.dom('[value="row-1"]').isNotChecked('clicking again deselects it');
    assert.dom('[value="row-2"]').isChecked();
  });

  test('selectedInitialRows pre-selects multiple rows', async function (assert) {
    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @multiSelection={{true}}
          @selectedInitialRows={{array 'row-1' 'row-2'}}
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-3' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 3</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('.cds--structured-list-row--selected').exists({ count: 2 });
    assert.dom('[value="row-1"]').isChecked();
    assert.dom('[value="row-2"]').isChecked();
    assert.dom('[value="row-3"]').isNotChecked();
  });

  test('onMultiSelectionChange is called with the full set of selected row ids', async function (assert) {
    const changes: string[][] = [];
    const onMultiSelectionChange = (ids: string[]) => changes.push(ids);

    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @multiSelection={{true}}
          @onMultiSelectionChange={{onMultiSelectionChange}}
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    await click('[value="row-1"]');
    await click('[value="row-2"]');
    await click('[value="row-1"]');

    assert.deepEqual(changes, [['row-1'], ['row-1', 'row-2'], ['row-2']]);
  });

  test('@selectedRows lets a consumer fully control multi-selection alongside onMultiSelectionChange', async function (assert) {
    class State {
      @tracked selectedRows: string[] = ['row-1'];
    }
    const state = new State();
    const onMultiSelectionChange = (ids: string[]) =>
      (state.selectedRows = ids);

    await render(
      <template>
        <StructuredList
          @selection={{true}}
          @multiSelection={{true}}
          @selectedRows={{state.selectedRows}}
          @onMultiSelectionChange={{onMultiSelectionChange}}
          as |SL|
        >
          <SL.Body>
            <SL.Row @id='row-1' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
            <SL.Row @id='row-2' as |Row|>
              <Row @name='rows' />
              <SL.Cell>Row 2</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert.dom('[value="row-1"]').isChecked('starts at the controlled value');

    await click('[value="row-2"]');

    assert.deepEqual(
      state.selectedRows,
      ['row-1', 'row-2'],
      'onMultiSelectionChange updated the external state',
    );
    assert
      .dom('[value="row-2"]')
      .isChecked('the controlled @selectedRows reflects the update');
  });

  test('clicking a row calls the provided onClick handler', async function (assert) {
    let clicked = 0;
    const onClick = () => clicked++;

    await render(
      <template>
        <StructuredList as |SL|>
          <SL.Body>
            <SL.Row @onClick={{onClick}}>
              <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    await click('.cds--structured-list-row');

    assert.strictEqual(clicked, 1);
  });

  test('noWrap adds the nowrap content class to a cell', async function (assert) {
    await render(
      <template>
        <StructuredList as |SL|>
          <SL.Body>
            <SL.Row>
              <SL.Cell @noWrap={{true}}>Row 1</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </template>,
    );

    assert
      .dom('.cds--structured-list-td.cds--structured-list-content--nowrap')
      .exists();
  });
});
