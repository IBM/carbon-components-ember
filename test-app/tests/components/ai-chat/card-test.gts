import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AiChatCard from 'carbon-components-ember/components/ai-chat/card';

module('Integration | Component | ai-chat/AiChatCard', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the header/body/footer named blocks', async function (assert) {
    await render(
      <template>
        <AiChatCard>
          <:header>Header content</:header>
          <:body>Body content</:body>
          <:footer>Footer content</:footer>
        </AiChatCard>
      </template>,
    );

    assert.dom('.cds-aichat-card').hasText('Header content Body content Footer content');
  });

  test('it applies is-layered/is-flush modifier classes', async function (assert) {
    await render(
      <template>
        <AiChatCard @isLayered={{true}} @isFlush={{true}}>
          <:body>Content</:body>
        </AiChatCard>
      </template>,
    );

    assert.dom('.cds-aichat-card').hasClass('cds-aichat-card--layered');
    assert.dom('.cds-aichat-card').hasClass('cds-aichat-card--flush');
  });

  test('it applies neither modifier class by default', async function (assert) {
    await render(
      <template>
        <AiChatCard>
          <:body>Content</:body>
        </AiChatCard>
      </template>,
    );

    assert.dom('.cds-aichat-card').doesNotHaveClass('cds-aichat-card--layered');
    assert.dom('.cds-aichat-card').doesNotHaveClass('cds-aichat-card--flush');
  });
});
