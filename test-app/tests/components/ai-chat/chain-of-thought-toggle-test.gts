import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ChainOfThoughtToggle from 'carbon-components-ember/components/ai-chat/chain-of-thought-toggle';

module('Integration | Component | ai-chat/ChainOfThoughtToggle', (hooks) => {
  setupRenderingTest(hooks);

  test('it toggles its own label/aria-expanded on click and calls @onToggle', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template>
        <ChainOfThoughtToggle @panelId='my-panel' @onToggle={{onToggle}} />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-expanded', 'false');
    assert.dom('button').hasAttribute('aria-controls', 'my-panel');
    assert.dom('.cds-aichat-chain-of-thought-toggle__label').hasText('Show chain of thought');

    await click('button');
    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-chain-of-thought-toggle__label').hasText('Hide chain of thought');
    assert.deepEqual(calls, [true]);
  });

  test('custom labels and disabled state', async function (assert) {
    await render(
      <template>
        <ChainOfThoughtToggle
          @open={{true}}
          @openLabelText='Custom open'
          @closedLabelText='Custom closed'
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom('.cds-aichat-chain-of-thought-toggle__label').hasText('Custom open');
    assert.dom('button').isDisabled();
  });
});
