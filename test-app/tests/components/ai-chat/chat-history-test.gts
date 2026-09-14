import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatHistory from 'carbon-components-ember/components/ai-chat/chat-history';

module('Integration | Component | ai-chat/ChatHistory', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the header/toolbar/content blocks in order', async function (assert) {
    await render(
      <template>
        <ChatHistory>
          <:header><div class='my-header'>Header</div></:header>
          <:toolbar><div class='my-toolbar'>Toolbar</div></:toolbar>
          <:content><div class='my-content'>Content</div></:content>
        </ChatHistory>
      </template>,
    );

    assert.dom('.cds-aichat-history-shell').exists();
    const children = Array.from(document.querySelectorAll('.cds-aichat-history-shell > div')).map((el) =>
      el.className,
    );
    assert.deepEqual(children, ['my-header', 'my-toolbar', 'my-content']);
  });

  test('renders with no blocks passed', async function (assert) {
    await render(<template><ChatHistory /></template>);
    assert.dom('.cds-aichat-history-shell').exists();
  });
});
