import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatHistoryPanelItems from 'carbon-components-ember/components/ai-chat/chat-history-panel-items';

module('Integration | Component | ai-chat/ChatHistoryPanelItems', (hooks) => {
  setupRenderingTest(hooks);

  test('is a role=list wrapper and yields pre-bound Item/Menu components propagating @showActions', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanelItems @showActions={{true}} as |Item Menu|>
          <Item @name='Top-level chat' />
          <Menu @title='Yesterday' as |NestedItem|>
            <NestedItem @name='Nested chat' />
          </Menu>
        </ChatHistoryPanelItems>
      </template>,
    );

    assert.dom('.cds-aichat-history-panel-items').hasAttribute('role', 'list');
    assert.dom('.cds-aichat-history-panel-items').containsText('Top-level chat');
    assert.dom('.cds-aichat-history-panel-items').containsText('Yesterday');
    assert.dom('.cds-aichat-history-panel-items').containsText('Nested chat');
    assert
      .dom('.cds-aichat-history-panel-item__actions--always-show')
      .exists({ count: 2 }, '@showActions propagates to both the top-level and the nested item');
  });
});
