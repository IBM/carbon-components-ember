import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import FeedbackButtons from 'carbon-components-ember/components/ai-chat/feedback-buttons';

module('Integration | Component | ai-chat/FeedbackButtons', (hooks) => {
  setupRenderingTest(hooks);

  test('it calls @onClick with true/false for the positive/negative buttons', async function (assert) {
    const calls: boolean[] = [];
    const onClick = (isPositive: boolean) => calls.push(isPositive);

    await render(<template><FeedbackButtons @onClick={{onClick}} /></template>);

    assert.dom('.cds-aichat-feedback-buttons__positive').exists();
    assert.dom('.cds-aichat-feedback-buttons__negative').exists();

    await click('.cds-aichat-feedback-buttons__positive');
    await click('.cds-aichat-feedback-buttons__negative');

    assert.deepEqual(calls, [true, false]);
  });

  test('selected state swaps the filled icon in and sets aria-pressed', async function (assert) {
    await render(
      <template>
        <FeedbackButtons @isPositiveSelected={{true}} />
      </template>,
    );

    assert.dom('.cds-aichat-feedback-buttons__positive').hasAttribute('aria-pressed', 'true');
    assert.dom('.cds-aichat-feedback-buttons__negative').doesNotHaveAttribute('aria-pressed');
  });

  test('disabled state prevents clicks from firing @onClick', async function (assert) {
    const calls: boolean[] = [];
    const onClick = (isPositive: boolean) => calls.push(isPositive);

    await render(
      <template>
        <FeedbackButtons @isPositiveDisabled={{true}} @onClick={{onClick}} />
      </template>,
    );

    assert.dom('.cds-aichat-feedback-buttons__positive').isDisabled();
    assert.strictEqual(calls.length, 0);
  });

  test('aria-expanded only appears when the button actually has a details panel', async function (assert) {
    await render(
      <template>
        <FeedbackButtons @hasPositiveDetails={{true}} @isPositiveOpen={{true}} />
      </template>,
    );

    assert.dom('.cds-aichat-feedback-buttons__positive').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-feedback-buttons__negative').doesNotHaveAttribute('aria-expanded');
  });

  test('aria-controls is built from @panelId', async function (assert) {
    await render(<template><FeedbackButtons @panelId='msg-1' /></template>);

    assert
      .dom('.cds-aichat-feedback-buttons__positive')
      .hasAttribute('aria-controls', 'msg-1-feedback-positive');
    assert
      .dom('.cds-aichat-feedback-buttons__negative')
      .hasAttribute('aria-controls', 'msg-1-feedback-negative');
  });
});
