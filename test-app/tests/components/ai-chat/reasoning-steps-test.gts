import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ReasoningSteps from 'carbon-components-ember/components/ai-chat/reasoning-steps';

module('Integration | Component | ai-chat/ReasoningSteps', (hooks) => {
  setupRenderingTest(hooks);

  test('the container panel is fully controlled by @open', async function (assert) {
    await render(
      <template>
        <ReasoningSteps @open={{false}}>
          <p>content</p>
        </ReasoningSteps>
      </template>,
    );

    assert.dom('.cds-aichat-reasoning-steps__wrapper').hasAttribute('aria-hidden', 'true');
    assert.dom('.cds-aichat-reasoning-steps__wrapper').doesNotHaveClass(
      'cds-aichat-reasoning-steps__wrapper--open',
    );
  });

  test('renders each yielded step, static header when no body is passed', async function (assert) {
    await render(
      <template>
        <ReasoningSteps @open={{true}} as |Step|>
          <Step @title='No body' />
          <Step @title='Has body'>Body content</Step>
        </ReasoningSteps>
      </template>,
    );

    assert.dom('.cds-aichat-reasoning-step').exists({ count: 2 });
    assert.dom('.cds-aichat-reasoning-step__static').exists({ count: 1 });
    assert.dom('.cds-aichat-reasoning-step__trigger').exists({ count: 1 });
  });

  test('an uncontrolled step toggles itself on click and calls @onToggle', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template>
        <ReasoningSteps @open={{true}} as |Step|>
          <Step @title='Step' @onToggle={{onToggle}}>Body</Step>
        </ReasoningSteps>
      </template>,
    );

    assert.dom('.cds-aichat-reasoning-step__trigger').hasAttribute('aria-expanded', 'false');

    await click('.cds-aichat-reasoning-step__trigger');
    assert.dom('.cds-aichat-reasoning-step__trigger').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds-aichat-reasoning-step').hasClass('cds-aichat-reasoning-step--open');
    assert.deepEqual(calls, [true]);
  });

  test('a controlled step never toggles itself; @open is the sole source of truth', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template>
        <ReasoningSteps @open={{true}} @controlled={{true}} as |Step|>
          <Step @title='Step' @open={{false}} @onToggle={{onToggle}}>Body</Step>
        </ReasoningSteps>
      </template>,
    );

    await click('.cds-aichat-reasoning-step__trigger');
    assert.deepEqual(calls, [true], 'still reports the requested next state');
    assert
      .dom('.cds-aichat-reasoning-step__trigger')
      .hasAttribute('aria-expanded', 'false', 'but @open never changed, so nothing toggled');
  });
});
