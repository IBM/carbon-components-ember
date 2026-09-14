import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { array, hash } from '@ember/helper';
import ChatHistoryPanelItem from 'carbon-components-ember/components/ai-chat/chat-history-panel-item';
import { Delete } from 'carbon-components-ember/icons';

module('Integration | Component | ai-chat/ChatHistoryPanelItem', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the name and calls @onSelect with itemId/itemName on click', async function (assert) {
    const calls: Array<{ itemId?: string; itemName?: string }> = [];
    const onSelect = (detail: { itemId?: string; itemName?: string }) => calls.push(detail);

    await render(
      <template><ChatHistoryPanelItem @id='chat-1' @name='My chat' @onSelect={{onSelect}} /></template>,
    );

    assert.dom('.cds--side-nav__link-text').hasText('My chat');

    await click('.cds--side-nav__link');
    assert.deepEqual(calls, [{ itemId: 'chat-1', itemName: 'My chat' }]);
  });

  test('@selected adds the current-link class', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' @selected={{true}} /></template>);

    assert.dom('.cds--side-nav__link').hasClass('cds--side-nav__link--current');
  });

  test('@rename swaps the row for a ChatHistoryPanelItemInput', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' @rename={{true}} /></template>);

    assert.dom('.cds--side-nav__link').doesNotExist();
    assert.dom('.cds-aichat-history-panel-item-input').exists();
    assert.dom('.cds-aichat-history-panel-item-input input').hasValue('My chat');
  });

  test('canceling a rename exits rename mode locally and calls @onRenameCancel', async function (assert) {
    let cancelCalls = 0;
    const onRenameCancel = () => cancelCalls++;

    await render(
      <template>
        <ChatHistoryPanelItem @name='My chat' @rename={{true}} @onRenameCancel={{onRenameCancel}} />
      </template>,
    );

    await click('.cds-aichat-history-panel-item-input__cancel');
    assert.dom('.cds-aichat-history-panel-item-input').doesNotExist('rename mode exits on its own');
    assert.dom('.cds--side-nav__link').exists();
    assert.strictEqual(cancelCalls, 1);
  });

  test('saving a rename (after changing the value) exits rename mode locally and calls @onRenameSave', async function (assert) {
    const saveCalls: string[] = [];
    const onSave = (value: string) => saveCalls.push(value);

    await render(
      <template><ChatHistoryPanelItem @name='My chat' @rename={{true}} @onRenameSave={{onSave}} /></template>,
    );

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    await click('.cds-aichat-history-panel-item-input__save');
    assert.dom('.cds-aichat-history-panel-item-input').doesNotExist('rename mode exits on its own');
    assert.dom('.cds--side-nav__link').exists();
    assert.deepEqual(saveCalls, ['New name']);
  });

  test('renders one overflow-menu action per entry in @actions, and calls @onMenuAction with the clicked action', async function (assert) {
    const calls: Array<{ action?: string; itemId?: string; itemName?: string }> = [];
    const onMenuAction = (detail: { action?: string; itemId?: string; itemName?: string }) =>
      calls.push(detail);

    await render(
      <template>
        <ChatHistoryPanelItem
          @id='chat-1'
          @name='My chat'
          @actions={{array (hash text='Rename') (hash text='Delete' icon=Delete delete=true)}}
          @onMenuAction={{onMenuAction}}
        />
      </template>,
    );

    await click('.cds--overflow-menu');
    assert.dom('.cds--overflow-menu-options__option').exists({ count: 2 });
    assert.dom('.cds--overflow-menu-options__option--danger').exists({ count: 1 });

    await click('.cds--overflow-menu-options__option:last-child button');
    assert.deepEqual(calls, [{ action: 'Delete', itemId: 'chat-1', itemName: 'My chat' }]);
  });

  test('the overflow menu is hidden by default and shown via @showActions', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' /></template>);
    assert
      .dom('.cds-aichat-history-panel-item__actions')
      .doesNotHaveClass('cds-aichat-history-panel-item__actions--always-show');

    await render(<template><ChatHistoryPanelItem @name='My chat' @showActions={{true}} /></template>);
    assert
      .dom('.cds-aichat-history-panel-item__actions')
      .hasClass('cds-aichat-history-panel-item__actions--always-show');
  });
});
