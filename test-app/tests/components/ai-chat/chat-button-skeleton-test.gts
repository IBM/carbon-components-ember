import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AiChatChatButtonSkeleton from 'carbon-components-ember/components/ai-chat/chat-button-skeleton';

module('Integration | Component | ai-chat/AiChatChatButtonSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a lg pill by default', async function (assert) {
    await render(<template><AiChatChatButtonSkeleton /></template>);

    assert.dom('.cds-aichat-button-skeleton').hasClass('cds-aichat-button-skeleton--lg');
    assert.dom('.cds-aichat-button-skeleton').hasClass('cds--skeleton');
  });

  test('@size changes the size class', async function (assert) {
    await render(<template><AiChatChatButtonSkeleton @size='sm' /></template>);

    assert.dom('.cds-aichat-button-skeleton').hasClass('cds-aichat-button-skeleton--sm');
  });
});
