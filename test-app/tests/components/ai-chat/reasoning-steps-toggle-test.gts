import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ReasoningStepsToggle from 'carbon-components-ember/components/ai-chat/reasoning-steps-toggle';

module('Integration | Component | ai-chat/ReasoningStepsToggle', (hooks) => {
  setupRenderingTest(hooks);

  test('it toggles its own label/aria-expanded on click and calls @onToggle', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template>
        <ReasoningStepsToggle @panelId='my-panel' @onToggle={{onToggle}} />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-expanded', 'false');
    assert.dom('button').hasAttribute('aria-controls', 'my-panel');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Show reasoning steps');

    await click('button');
    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Hide reasoning steps');
    assert.deepEqual(calls, [true]);
  });

  test('custom labels and disabled state', async function (assert) {
    await render(
      <template>
        <ReasoningStepsToggle
          @open={{true}}
          @openLabelText='Custom open'
          @closedLabelText='Custom closed'
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Custom open');
    assert.dom('button').isDisabled();
  });
});
