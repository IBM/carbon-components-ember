import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil } from '@ember/test-helpers';
import AiChatCardSteps, {
  type CardStep,
} from 'carbon-components-ember/components/ai-chat/card-steps';

module('Integration | Component | ai-chat/AiChatCardSteps', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders a title/description per step', async function (assert) {
    const steps: CardStep[] = [
      { title: 'Step 1', description: 'First step' },
      { title: 'Step 2' },
    ];

    await render(<template><AiChatCardSteps @steps={{steps}} /></template>);

    assert.dom('.cds-aichat-card-step').exists({ count: 2 });
    assert.dom('.cds-aichat-card-step:first-child .cds-aichat-card-step-title').hasText('Step 1');
    assert
      .dom('.cds-aichat-card-step:first-child .cds-aichat-card-step-description')
      .hasText('First step');
    assert
      .dom('.cds-aichat-card-step:last-child .cds-aichat-card-step-description')
      .doesNotExist();
  });

  test('it renders a plain label for a step with no kind', async function (assert) {
    const steps: CardStep[] = [{ title: 'Step', label: 'Queued' }];

    await render(<template><AiChatCardSteps @steps={{steps}} /></template>);

    assert.dom('.cds-aichat-card-step-indicator').doesNotExist();
    assert.dom('.cds-aichat-card-step').hasText('Queued Step');
  });

  test('it renders an IconIndicator for a kind other than in-progress', async function (assert) {
    const steps: CardStep[] = [{ title: 'Step', kind: 'succeeded', label: 'Done' }];

    await render(<template><AiChatCardSteps @steps={{steps}} /></template>);
    await waitUntil(() => find('.cds-aichat-card-step-indicator svg'));

    assert.dom('.cds-aichat-card-step-indicator svg').exists();
    assert.dom('.cds-aichat-card-step-indicator').hasText('Done');
  });

  test('it renders a loading spinner for the in-progress kind', async function (assert) {
    const steps: CardStep[] = [
      { title: 'Step', kind: 'in-progress', label: 'Working' },
    ];

    await render(<template><AiChatCardSteps @steps={{steps}} /></template>);

    assert.dom('.cds-aichat-card-step-indicator .cds--loading').exists();
    assert.dom('.cds-aichat-card-step-indicator').hasText('Loading Working');
  });
});
