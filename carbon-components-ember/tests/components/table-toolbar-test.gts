import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  fillIn,
  findAll,
  focus,
  render,
  triggerEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import TableActionList from '#src/components/table/table-action-list.gts';
import TableBatchAction from '#src/components/table/table-batch-action.gts';
import TableBatchActions from '#src/components/table/table-batch-actions.gts';
import TableToolbar from '#src/components/table/table-toolbar.gts';
import TableToolbarSearch from '#src/components/table/table-toolbar-search.gts';
import Delete from '#src/components/icons/delete.ts';

const noop = () => {};

module('Integration | Component | TableToolbar', (hooks) => {
  setupRenderingTest(hooks);

  test('it is a group, and takes aria-label and a size for its parts', async function (assert) {
    await render(
      <template>
        <TableToolbar @size="sm" aria-label="Actions" as |Content|>
          <Content as |Search Menu|>
            <Search />
            <Menu as |Action|><Action>Refresh</Action></Menu>
          </Content>
        </TableToolbar>
      </template>,
    );

    assert
      .dom('section')
      .hasAttribute('role', 'group')
      .hasAttribute('aria-label', 'Actions')
      .hasClass('cds--table-toolbar--sm');
    assert
      .dom('.cds--toolbar-content .cds--search')
      .hasClass('cds--search--sm');
    assert
      .dom('.cds--toolbar-content button.cds--overflow-menu')
      .hasClass('cds--overflow-menu--sm')
      .hasClass('cds--toolbar-action');
  });

  test('a part takes its own size over the toolbar', async function (assert) {
    await render(
      <template>
        <TableToolbar @size="sm" as |Content|>
          <Content as |Search|><Search @size="lg" /></Content>
        </TableToolbar>
      </template>,
    );

    assert.dom('.cds--search').hasClass('cds--search--lg');
  });

  test('the search expands on focus and collapses on blur while empty', async function (assert) {
    const events: Array<[boolean]> = [];
    const onExpand = (_event: Event, value: boolean) => events.push([value]);
    await render(
      <template><TableToolbarSearch @onExpand={{onExpand}} /></template>,
    );

    assert
      .dom('.cds--search')
      .hasClass('cds--toolbar-search-container-expandable')
      .doesNotHaveClass('cds--toolbar-search-container-active');
    assert.dom('input').hasAttribute('tabindex', '0');

    await focus('input');
    assert.dom('.cds--search').hasClass('cds--toolbar-search-container-active');
    await triggerEvent('input', 'blur');
    assert
      .dom('.cds--search')
      .doesNotHaveClass('cds--toolbar-search-container-active');
    assert.deepEqual(events, [[true], [false]]);
  });

  test('the search stays expanded on blur with a value', async function (assert) {
    await render(<template><TableToolbarSearch /></template>);

    await focus('input');
    await fillIn('input', 'Load');
    await triggerEvent('input', 'blur');
    assert.dom('.cds--search').hasClass('cds--toolbar-search-container-active');
  });

  test('a persistent search is never expanded by focus', async function (assert) {
    await render(
      <template><TableToolbarSearch @persistent={{true}} /></template>,
    );

    await focus('input');
    assert
      .dom('.cds--search')
      .hasClass('cds--toolbar-search-container-persistent')
      .doesNotHaveClass('cds--toolbar-search-container-active');
  });

  test('@expanded wins over focus', async function (assert) {
    await render(
      <template><TableToolbarSearch @expanded={{false}} /></template>,
    );

    await focus('input');
    assert
      .dom('.cds--search')
      .doesNotHaveClass('cds--toolbar-search-container-active');
  });

  test('@onFocus replaces expanding, and gets the handler', async function (assert) {
    let received: unknown;
    const onFocus = (
      _event: FocusEvent,
      handleExpand: (event: Event, value?: boolean) => void,
    ) => {
      received = handleExpand;
    };
    await render(
      <template><TableToolbarSearch @onFocus={{onFocus}} /></template>,
    );

    await focus('input');
    assert.strictEqual(typeof received, 'function');
    assert
      .dom('.cds--search')
      .doesNotHaveClass('cds--toolbar-search-container-active');
  });

  test('a disabled search does not expand', async function (assert) {
    await render(
      <template><TableToolbarSearch @disabled={{true}} /></template>,
    );

    assert
      .dom('.cds--search')
      .hasClass('cds--toolbar-search-container-disabled');
    assert.dom('input').isDisabled();
  });

  test('@onChange gets the event and value, and @defaultValue once at first', async function (assert) {
    const calls: Array<[string, string | undefined]> = [];
    const onChange = (event: '' | Event, value?: string) =>
      calls.push([typeof event === 'string' ? event : event.type, value]);
    await render(
      <template>
        <TableToolbarSearch @defaultValue="Load" @onChange={{onChange}} />
      </template>,
    );

    assert.dom('input').hasValue('Load');
    assert.dom('.cds--search').hasClass('cds--toolbar-search-container-active');
    assert.deepEqual(calls, [['', 'Load']]);
    await fillIn('input', 'Load b');
    assert.deepEqual(calls.at(-1), ['input', 'Load b']);
  });

  test('clearing calls @onClear', async function (assert) {
    let cleared = 0;
    const onClear = () => cleared++;
    await render(
      <template>
        <TableToolbarSearch @defaultValue="Load" @onClear={{onClear}} />
      </template>,
    );

    await click('.cds--search-close');
    assert.strictEqual(cleared, 1);
    assert.dom('input').hasValue('');
  });

  test('label, placeholder and translateWithId', async function (assert) {
    const translate = (id: string) => `t:${id}`;
    await render(
      <template>
        <TableToolbarSearch @translateWithId={{translate}} />
        <TableToolbarSearch @labelText="Mine" @placeholder="Find" />
      </template>,
    );

    assert.dom('label').hasText('t:carbon.table.toolbar.search.label');
    assert
      .dom('input')
      .hasAttribute('placeholder', 't:carbon.table.toolbar.search.placeholder');
    assert.dom(findAll('label')[1]).hasText('Mine');
  });

  test('the menu opens, runs an action and closes', async function (assert) {
    let clicked = 0;
    const refresh = () => clicked++;
    await render(
      <template>
        <TableToolbar as |Content|>
          <Content as |Search Menu|>
            <Menu as |Action|>
              <Action {{on "click" refresh}}>Refresh data</Action>
              <Action @isDelete={{true}} @disabled={{true}}>Delete</Action>
            </Menu>
          </Content>
        </TableToolbar>
      </template>,
    );

    assert
      .dom('button.cds--overflow-menu svg')
      .hasAttribute('aria-label', 'Settings');
    await click('button.cds--overflow-menu');
    assert
      .dom('.cds--overflow-menu-options')
      .hasClass('cds--toolbar-action__menu');
    assert
      .dom('.cds--overflow-menu-options__option-content')
      .hasText('Refresh data');
    await click('.cds--overflow-menu-options__btn');
    assert.strictEqual(clicked, 1);
    assert.dom('.cds--overflow-menu-options').doesNotExist();
  });

  test("a menu action takes the menu item's arguments", async function (assert) {
    await render(
      <template>
        <TableToolbar as |Content|>
          <Content as |Search Menu|>
            <Menu as |Action|>
              <Action
                @requireTitle={{true}}
                @title="Export every row"
                @wrapperClassName="export"
              >
                Export
              </Action>
            </Menu>
          </Content>
        </TableToolbar>
      </template>,
    );

    await click('button.cds--overflow-menu');
    assert
      .dom('li.export .cds--overflow-menu-options__btn')
      .hasAttribute('title', 'Export every row');
  });

  test("the batch bar shows the count with React's messages", async function (assert) {
    class State {
      @tracked selected = 0;
    }
    const state = new State();
    const cancel = () => (state.selected = 0);
    await render(
      <template>
        <TableBatchActions
          @shouldShowBatchActions={{true}}
          @totalSelected={{state.selected}}
          @totalCount={{8}}
          @onCancel={{cancel}}
          @onSelectAll={{noop}}
        >
          <TableBatchAction @renderIcon={{Delete}}>Delete</TableBatchAction>
        </TableBatchActions>
      </template>,
    );

    assert.dom('.cds--batch-summary__para').hasText('0 items selected');
    state.selected = 1;
    await render(
      <template>
        <TableBatchActions
          @shouldShowBatchActions={{true}}
          @totalSelected={{state.selected}}
          @onCancel={{cancel}}
        />
      </template>,
    );
    assert.dom('.cds--batch-summary__para').hasText('1 item selected');
    assert.dom('.cds--batch-summary__divider').doesNotExist();
  });

  test('the batch bar hides itself, and its buttons leave the tab order', async function (assert) {
    await render(
      <template>
        <TableBatchActions
          @totalSelected={{0}}
          @onCancel={{noop}}
          @onSelectAll={{noop}}
          class="mine"
        />
      </template>,
    );

    assert
      .dom('.cds--batch-actions')
      .hasAria('hidden', 'true')
      .hasClass('mine')
      .doesNotHaveClass('cds--batch-actions--active');
    assert.dom('.cds--batch-summary > button').hasAttribute('tabindex', '-1');
    assert.dom('.cds--batch-summary__cancel').hasAttribute('tabindex', '-1');
  });

  test('Select all and Cancel call their handlers, and translateWithId translates', async function (assert) {
    const calls: string[] = [];
    const cancel = () => calls.push('cancel');
    const selectAll = () => calls.push('selectAll');
    const translate = (id: string) => `t:${id}`;
    await render(
      <template>
        <TableBatchActions
          @shouldShowBatchActions={{true}}
          @totalSelected={{3}}
          @onCancel={{cancel}}
          @onSelectAll={{selectAll}}
          @translateWithId={{translate}}
        />
      </template>,
    );

    assert
      .dom('.cds--batch-summary__para')
      .hasText('t:carbon.table.batch.items.selected');
    await click('.cds--batch-summary > button');
    await click('.cds--batch-summary__cancel');
    assert.deepEqual(calls, ['selectAll', 'cancel']);
  });

  test('a batch action has an add icon by default', async function (assert) {
    await render(
      <template>
        <TableActionList><TableBatchAction
          >Add</TableBatchAction></TableActionList>
      </template>,
    );

    assert.dom('.cds--action-list > button.cds--btn--primary').hasText('Add');
    assert.dom('.cds--action-list svg.cds--btn__icon').exists();
  });
});
