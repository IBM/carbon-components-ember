import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ChatHistoryHeader from 'carbon-components-ember/components/ai-chat/chat-history-header';

module('Integration | Component | ai-chat/ChatHistoryHeader', (hooks) => {
  setupRenderingTest(hooks);

  test('shows the default title and no close button by default', async function (assert) {
    await render(<template><ChatHistoryHeader /></template>);

    assert.dom('.cds-aichat-history-header__title').hasText('Chats');
    assert.dom('.cds-aichat-history-header__close-button').doesNotExist();
  });

  test('@headerTitle overrides the default title', async function (assert) {
    await render(<template><ChatHistoryHeader @headerTitle='My Chats' /></template>);

    assert.dom('.cds-aichat-history-header__title').hasText('My Chats');
  });

  test('@showCloseAction renders a close button that calls @onClose on click', async function (assert) {
    let calls = 0;
    const onClose = () => calls++;

    await render(
      <template><ChatHistoryHeader @showCloseAction={{true}} @onClose={{onClose}} /></template>,
    );

    assert.dom('.cds-aichat-history-header__close-button').exists();

    await click('.cds-aichat-history-header__close-button');
    assert.strictEqual(calls, 1);
  });
});
