import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatButtonSkeleton from '#src/components/ai-chat/chat-button-skeleton.gts';

module('Integration | Component | ai-chat/ChatButtonSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a lg pill by default', async function (assert) {
    await render(<template><ChatButtonSkeleton /></template>);

    assert
      .dom('.cds-aichat-button-skeleton')
      .hasClass('cds-aichat-button-skeleton--lg');
  });

  test('@size changes the size class', async function (assert) {
    await render(<template><ChatButtonSkeleton @size="sm" /></template>);

    assert
      .dom('.cds-aichat-button-skeleton')
      .hasClass('cds-aichat-button-skeleton--sm');
  });
});
