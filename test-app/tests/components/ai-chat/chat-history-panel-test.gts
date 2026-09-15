import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatHistoryPanel from 'carbon-components-ember/components/ai-chat/chat-history-panel';

module('Integration | Component | ai-chat/ChatHistoryPanel', (hooks) => {
  setupRenderingTest(hooks);

  test('renders as a nav with the side-nav classes, expanded by default', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanel as |Items|>
          <Items as |Item|>
            <Item @name='Chat 1' />
          </Items>
        </ChatHistoryPanel>
      </template>,
    );

    assert.dom('.cds-aichat-history-panel').exists();
    assert.dom('.cds-aichat-history-panel').hasClass('cds--side-nav--expanded');
    assert.dom('.cds-aichat-history-panel .cds-aichat-history-panel-items').exists();
    assert.dom('.cds-aichat-history-panel').containsText('Chat 1');
  });

  test('@expanded={{false}} switches to the collapsed class', async function (assert) {
    await render(<template><ChatHistoryPanel @expanded={{false}} as |Items|><Items /></ChatHistoryPanel></template>);

    assert.dom('.cds-aichat-history-panel').hasClass('cds--side-nav--collapsed');
    assert.dom('.cds-aichat-history-panel').doesNotHaveClass('cds--side-nav--expanded');
  });

  test('@showActions propagates all the way down through Items to a rendered Item', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanel @showActions={{true}} as |Items|>
          <Items as |Item|>
            <Item @name='Chat 1' />
          </Items>
        </ChatHistoryPanel>
      </template>,
    );

    assert.dom('.cds-aichat-history-panel-item__actions').hasClass('cds-aichat-history-panel-item__actions--always-show');
  });
});
