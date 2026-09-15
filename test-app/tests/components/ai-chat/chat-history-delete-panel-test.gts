import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ChatHistoryDeletePanel from 'carbon-components-ember/components/ai-chat/chat-history-delete-panel';

module('Integration | Component | ai-chat/ChatHistoryDeletePanel', (hooks) => {
  setupRenderingTest(hooks);

  test('renders default title/description and Cancel/Delete labels', async function (assert) {
    await render(<template><ChatHistoryDeletePanel /></template>);

    assert.dom('.cds-aichat-history-delete-panel__content h1').hasText('Confirm Delete');
    assert
      .dom('.cds-aichat-history-delete-panel__content span')
      .hasText('This conversation will be permanently deleted.');
    assert.dom('.cds-aichat-history-delete-panel__actions').containsText('Cancel');
    assert.dom('.cds-aichat-history-delete-panel__actions').containsText('Delete');
  });

  test(':title/:description blocks override the defaults', async function (assert) {
    await render(
      <template>
        <ChatHistoryDeletePanel>
          <:title>Delete "My chat"?</:title>
          <:description>This can't be undone.</:description>
        </ChatHistoryDeletePanel>
      </template>,
    );

    assert.dom('.cds-aichat-history-delete-panel__content h1').hasText('Delete "My chat"?');
    assert.dom('.cds-aichat-history-delete-panel__content span').hasText("This can't be undone.");
  });

  test('Cancel calls @onCancel, Delete calls @onConfirm with @itemId', async function (assert) {
    const cancelCalls: number[] = [];
    const confirmCalls: Array<{ itemId?: string }> = [];
    const onCancel = () => cancelCalls.push(1);
    const onConfirm = (detail: { itemId?: string }) => confirmCalls.push(detail);

    await render(
      <template>
        <ChatHistoryDeletePanel @itemId='chat-1' @onCancel={{onCancel}} @onConfirm={{onConfirm}} />
      </template>,
    );

    await click('.cds-aichat-history-delete-panel__actions button:last-child');
    assert.deepEqual(confirmCalls, [{ itemId: 'chat-1' }]);
    assert.strictEqual(cancelCalls.length, 0);

    await click('.cds-aichat-history-delete-panel__actions button:first-child');
    assert.strictEqual(cancelCalls.length, 1);
  });
});
