import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatHistoryLoading from 'carbon-components-ember/components/ai-chat/chat-history-loading';

module('Integration | Component | ai-chat/ChatHistoryLoading', (hooks) => {
  setupRenderingTest(hooks);

  test('renders four short skeleton lines and four two-line skeleton paragraphs', async function (assert) {
    await render(<template><ChatHistoryLoading /></template>);

    assert.dom('.cds-aichat-history-loading__results .cds--skeleton__text').exists({ count: 4 });
    assert.dom('.cds-aichat-history-loading .cds--skeleton__text').exists({ count: 12 });
  });
});
