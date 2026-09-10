import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import ChainOfThought from 'carbon-components-ember/components/ai-chat/chain-of-thought';

module('Integration | Component | ai-chat/ChainOfThought', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders each yielded step, with a static (non-interactive) header when no body is passed', async function (assert) {
    await render(
      <template>
        <ChainOfThought @open={{true}} as |Step|>
          <Step @title='No body' />
          <Step @title='Has body'>Body content</Step>
        </ChainOfThought>
      </template>,
    );

    assert.dom('.cds-aichat-chain-of-thought-step').exists({ count: 2 });
    assert.dom('.cds-aichat-chain-of-thought-step__static').exists({ count: 1 });
    assert.dom('.cds-aichat-chain-of-thought-step__header').exists({ count: 1 });
  });

  test('numbers the title from @stepNumber, and @labelText overrides it entirely', async function (assert) {
    await render(
      <template>
        <ChainOfThought as |Step|>
          <Step @title='Searching the web' @stepNumber={{1}}>Body</Step>
          <Step @title='ignored' @labelText='Custom label' @stepNumber={{2}}>Body</Step>
        </ChainOfThought>
      </template>,
    );

    assert
      .dom('.cds-aichat-chain-of-thought-step__header-title')
      .exists({ count: 2 });
    assert.dom(
      '.cds-aichat-chain-of-thought-step:nth-of-type(1) .cds-aichat-chain-of-thought-step__header-title',
    ).hasText('1: Searching the web');
    assert.dom(
      '.cds-aichat-chain-of-thought-step:nth-of-type(2) .cds-aichat-chain-of-thought-step__header-title',
    ).hasText('Custom label');
  });

  test('an uncontrolled step toggles itself on click and calls @onToggle', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template>
        <ChainOfThought as |Step|>
          <Step @title='Step' @onToggle={{onToggle}}>Body</Step>
        </ChainOfThought>
      </template>,
    );

    assert.dom('.cds-aichat-chain-of-thought-step__header').hasAttribute('aria-expanded', 'false');

    await click('.cds-aichat-chain-of-thought-step__header');
    assert.dom('.cds-aichat-chain-of-thought-step__header').hasAttribute('aria-expanded', 'true');

    await click('.cds-aichat-chain-of-thought-step__header');
    assert.dom('.cds-aichat-chain-of-thought-step__header').hasAttribute('aria-expanded', 'false');
    assert.deepEqual(calls, [true, false]);
  });

  test('a step with body content starts collapsed and expands/collapses its content on click', async function (assert) {
    await render(
      <template>
        <ChainOfThought as |Step|>
          <Step @title='Step'>Body content</Step>
        </ChainOfThought>
      </template>,
    );

    assert
      .dom('.cds-aichat-chain-of-thought-step__content')
      .hasAttribute('hidden', '', 'starts collapsed');

    await click('.cds-aichat-chain-of-thought-step__header');
    assert
      .dom('.cds-aichat-chain-of-thought-step__content')
      .doesNotHaveAttribute('hidden', 'expands on click');

    await click('.cds-aichat-chain-of-thought-step__header');
    assert
      .dom('.cds-aichat-chain-of-thought-step__content')
      .hasAttribute('hidden', '', 'collapses again on a second click');
  });

  test('a controlled step never toggles itself; @open is the sole source of truth', async function (assert) {
    class State {
      @tracked open = false;
    }
    const state = new State();
    const calls: boolean[] = [];

    class Host extends Component {
      state = state;
      onToggle = (open: boolean) => calls.push(open);
      <template>
        <ChainOfThought @controlled={{true}} as |Step|>
          <Step @title='Step' @open={{this.state.open}} @onToggle={{this.onToggle}}>Body</Step>
        </ChainOfThought>
      </template>
    }

    await render(<template><Host /></template>);

    assert.dom('.cds-aichat-chain-of-thought-step__header').hasAttribute('aria-expanded', 'false');

    await click('.cds-aichat-chain-of-thought-step__header');
    assert.strictEqual(calls.length, 1, 'still calls onToggle');
    assert.true(calls[0], 'reports the requested next state');
    assert
      .dom('.cds-aichat-chain-of-thought-step__header')
      .hasAttribute('aria-expanded', 'false', 'but the DOM state does not change since @open never did');

    state.open = true;
    await settled();
    assert.dom('.cds-aichat-chain-of-thought-step__header').hasAttribute('aria-expanded', 'true');
  });

  test('status icons render for success (default), failure, and processing', async function (assert) {
    await render(
      <template>
        <ChainOfThought as |Step|>
          <Step @title='S' @status='success'>Body</Step>
          <Step @title='F' @status='failure'>Body</Step>
          <Step @title='P' @status='processing'>Body</Step>
        </ChainOfThought>
      </template>,
    );

    const steps = document.querySelectorAll('.cds-aichat-chain-of-thought-step');
    assert.dom(steps[0]?.querySelector('.cds-aichat-chain-of-thought-step__header-status--success')).exists();
    assert.dom(steps[1]?.querySelector('.cds-aichat-chain-of-thought-step__header-status--failure')).exists();
    assert.dom(steps[2]?.querySelector('.cds--inline-loading')).exists();
  });

  test('the container panel visibility is fully controlled by @open', async function (assert) {
    await render(
      <template>
        <ChainOfThought @open={{false}} @panelId='my-panel'>
          <p>content</p>
        </ChainOfThought>
      </template>,
    );

    assert.dom('#my-panel').hasAttribute('hidden');
    assert.dom('#my-panel').hasAttribute('aria-hidden', 'true');
  });

  test('the container calls @onToggle whenever @open changes after initial render', async function (assert) {
    class State {
      @tracked open = false;
    }
    const state = new State();
    const calls: boolean[] = [];

    class Host extends Component {
      state = state;
      onToggle = (open: boolean) => calls.push(open);
      <template>
        <ChainOfThought @open={{this.state.open}} @onToggle={{this.onToggle}}>
          <p>content</p>
        </ChainOfThought>
      </template>
    }

    await render(<template><Host /></template>);
    assert.deepEqual(calls, [], 'not called on initial render');

    state.open = true;
    await settled();
    assert.deepEqual(calls, [true]);

    state.open = false;
    await settled();
    assert.deepEqual(calls, [true, false]);
  });
});
