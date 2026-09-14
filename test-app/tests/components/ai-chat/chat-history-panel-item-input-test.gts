import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerKeyEvent, blur } from '@ember/test-helpers';
import ChatHistoryPanelItemInput from 'carbon-components-ember/components/ai-chat/chat-history-panel-item-input';

module('Integration | Component | ai-chat/ChatHistoryPanelItemInput', (hooks) => {
  setupRenderingTest(hooks);

  test('seeds the input from @value, and the save button starts disabled', async function (assert) {
    await render(<template><ChatHistoryPanelItemInput @value='My chat' /></template>);

    assert.dom('.cds-aichat-history-panel-item-input input').hasValue('My chat');
    assert.dom('.cds-aichat-history-panel-item-input__save').isDisabled();
  });

  test('typing calls @onChange and enables save once the value differs from the seed', async function (assert) {
    const calls: string[] = [];
    const onChange = (value: string) => calls.push(value);

    await render(
      <template><ChatHistoryPanelItemInput @value='My chat' @onChange={{onChange}} /></template>,
    );

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    assert.deepEqual(calls, ['New name']);
    assert.dom('.cds-aichat-history-panel-item-input__save').isNotDisabled();

    await fillIn('.cds-aichat-history-panel-item-input input', 'My chat');
    assert.dom('.cds-aichat-history-panel-item-input__save').isDisabled();
  });

  test('clicking save calls @onSave with the new value', async function (assert) {
    const calls: string[] = [];
    const onSave = (value: string) => calls.push(value);

    await render(<template><ChatHistoryPanelItemInput @value='My chat' @onSave={{onSave}} /></template>);

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    await click('.cds-aichat-history-panel-item-input__save');
    assert.deepEqual(calls, ['New name']);
  });

  test('clicking cancel calls @onCancel', async function (assert) {
    let calls = 0;
    const onCancel = () => calls++;

    await render(<template><ChatHistoryPanelItemInput @value='My chat' @onCancel={{onCancel}} /></template>);

    await click('.cds-aichat-history-panel-item-input__cancel');
    assert.strictEqual(calls, 1);
  });

  test('Escape cancels, Enter saves when the value has changed and is valid', async function (assert) {
    const cancelCalls: number[] = [];
    const saveCalls: string[] = [];
    const onCancel = () => cancelCalls.push(1);
    const onSave = (value: string) => saveCalls.push(value);

    await render(
      <template>
        <ChatHistoryPanelItemInput @value='My chat' @onCancel={{onCancel}} @onSave={{onSave}} />
      </template>,
    );

    await triggerKeyEvent('.cds-aichat-history-panel-item-input input', 'keydown', 'Escape');
    assert.strictEqual(cancelCalls.length, 1);

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    await triggerKeyEvent('.cds-aichat-history-panel-item-input input', 'keydown', 'Enter');
    assert.deepEqual(saveCalls, ['New name']);
  });

  test('Enter cancels instead of saving when the value has not changed', async function (assert) {
    const cancelCalls: number[] = [];
    const saveCalls: string[] = [];
    const onCancel = () => cancelCalls.push(1);
    const onSave = (value: string) => saveCalls.push(value);

    await render(
      <template>
        <ChatHistoryPanelItemInput @value='My chat' @onCancel={{onCancel}} @onSave={{onSave}} />
      </template>,
    );

    await triggerKeyEvent('.cds-aichat-history-panel-item-input input', 'keydown', 'Enter');
    assert.strictEqual(cancelCalls.length, 1);
    assert.strictEqual(saveCalls.length, 0);
  });

  test('blurring out (without a button click) saves when the value changed', async function (assert) {
    const saveCalls: string[] = [];
    const onSave = (value: string) => saveCalls.push(value);

    await render(<template><ChatHistoryPanelItemInput @value='My chat' @onSave={{onSave}} /></template>);

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    await blur('.cds-aichat-history-panel-item-input input');
    assert.deepEqual(saveCalls, ['New name']);
  });

  test('@invalid disables save and shows @invalidMessage', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanelItemInput @value='My chat' @invalid={{true}} @invalidMessage='Name already used' />
      </template>,
    );

    assert.dom('.cds-aichat-history-panel-item-input__save').isDisabled();
    assert.dom('.cds-aichat-history-panel-item-input__invalid-message').hasText('Name already used');
  });
});
