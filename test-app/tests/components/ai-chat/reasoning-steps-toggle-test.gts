import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import ReasoningStepsToggle from 'carbon-components-ember/components/ai-chat/reasoning-steps-toggle';

module('Integration | Component | ai-chat/ReasoningStepsToggle', (hooks) => {
  setupRenderingTest(hooks);

  test('uncontrolled: it toggles its own label/aria-expanded on click', async function (assert) {
    await render(
      <template>
        <ReasoningStepsToggle @panelId='my-panel' />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-expanded', 'false');
    assert.dom('button').hasAttribute('aria-controls', 'my-panel');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Show reasoning steps');

    await click('button');
    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Hide reasoning steps');
  });

  test('@onToggle makes it controlled: it follows @open and reports clicks instead of managing its own state', async function (assert) {
    const open = cell(false);
    let reportedOpen: boolean | undefined;
    const onToggle = (value: boolean) => {
      reportedOpen = value;
    };

    await render(
      <template>
        <ReasoningStepsToggle @open={{open.current}} @onToggle={{onToggle}} />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-expanded', 'false');

    await click('button');

    // Clicking reports the intended next state, but does not itself change
    // the rendered state — the consumer must feed it back via @open.
    assert.strictEqual(reportedOpen, true);
    assert.dom('button').hasAttribute('aria-expanded', 'false');

    open.current = true;
    await rerender();

    assert.dom('button').hasAttribute('aria-expanded', 'true');
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

  test('an @open seed without @onToggle is only an initial value, not a permanent lock', async function (assert) {
    await render(
      <template><ReasoningStepsToggle @open={{true}} /></template>,
    );

    assert.dom('button').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Hide reasoning steps');

    await click('button');
    assert
      .dom('button')
      .hasAttribute('aria-expanded', 'false', 'click flips it, unlike a truly controlled usage');
    assert.dom('.cds-aichat-reasoning-steps-toggle__label').hasText('Show reasoning steps');
  });
});
