import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Card from '#src/components/ai-chat/card.gts';

module('Integration | Component | ai-chat/Card', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the header/body/footer named blocks', async function (assert) {
    await render(
      <template>
        <Card>
          <:header>Header content</:header>
          <:body>Body content</:body>
          <:footer>Footer content</:footer>
        </Card>
      </template>,
    );

    assert
      .dom('.cds-aichat-card')
      .hasText('Header content Body content Footer content');
  });

  test('it applies is-layered/is-flush modifier classes', async function (assert) {
    await render(
      <template>
        <Card @isLayered={{true}} @isFlush={{true}}>
          <:body>Content</:body>
        </Card>
      </template>,
    );

    assert.dom('.cds-aichat-card').hasClass('cds-aichat-card--layered');
    assert.dom('.cds-aichat-card').hasClass('cds-aichat-card--flush');
  });

  test('it applies neither modifier class by default', async function (assert) {
    await render(
      <template>
        <Card>
          <:body>Content</:body>
        </Card>
      </template>,
    );

    assert.dom('.cds-aichat-card').doesNotHaveClass('cds-aichat-card--layered');
    assert.dom('.cds-aichat-card').doesNotHaveClass('cds-aichat-card--flush');
  });
});
