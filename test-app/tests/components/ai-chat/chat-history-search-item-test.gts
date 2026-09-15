import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ChatHistorySearchItem from 'carbon-components-ember/components/ai-chat/chat-history-search-item';

module('Integration | Component | ai-chat/ChatHistorySearchItem', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the name and date, and calls @onSelect with itemId/itemName on click', async function (assert) {
    const calls: Array<{ itemId?: string; itemName?: string }> = [];
    const onSelect = (detail: { itemId?: string; itemName?: string }) => calls.push(detail);

    await render(
      <template>
        <ChatHistorySearchItem @id='chat-1' @name='My chat' @date='Sep 12' @onSelect={{onSelect}} />
      </template>,
    );

    assert.dom('.cds--side-nav__link-text').hasText('My chat');
    assert.dom('.cds--side-nav__link-subtitle').hasText('Sep 12');

    await click('.cds--side-nav__link');
    assert.deepEqual(calls, [{ itemId: 'chat-1', itemName: 'My chat' }]);
  });

  test('@disabled prevents @onSelect from firing', async function (assert) {
    let calls = 0;
    const onSelect = () => calls++;

    await render(
      <template><ChatHistorySearchItem @name='My chat' @disabled={{true}} @onSelect={{onSelect}} /></template>,
    );

    assert.dom('.cds--side-nav__link').isDisabled();
    assert.strictEqual(calls, 0);
  });
});
