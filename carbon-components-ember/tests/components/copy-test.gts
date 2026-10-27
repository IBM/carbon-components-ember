import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  rerender,
  find,
  waitUntil,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import Copy from '#src/components/copy.gts';

const BUTTON = 'button.cds--copy';

// The tooltip names the button, as in Carbon React.
const label = () =>
  find(
    `#${find(BUTTON)?.getAttribute('aria-labelledby')}`,
  )?.textContent?.trim();

// Dispatched rather than click()ed, whose settled() would also wait out the
// feedback.
const press = () =>
  find(BUTTON)!.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  );

module('Integration | Component | Copy', (hooks) => {
  setupRenderingTest(hooks);

  test('renders its block in a button its tooltip names', async function (assert) {
    await render(
      <template>
        <Copy @ariaLabel="Copy the command" data-test-copy>npm install</Copy>
      </template>,
    );

    assert
      .dom(BUTTON)
      .hasText('npm install')
      .hasAttribute('data-test-copy')
      .doesNotHaveAttribute('aria-label');
    assert.strictEqual(label(), 'Copy the command');
  });

  test('a click shows the feedback for @feedbackTimeout', async function (assert) {
    await render(
      <template>
        <Copy
          @ariaLabel="Copy"
          @feedback="Done!"
          @feedbackTimeout={{50}}
        >npm</Copy>
      </template>,
    );

    press();
    await waitUntil(() => label() === 'Done!');
    await settled();

    assert.strictEqual(label(), 'Copy');
  });

  test('a click handler that prevents the default skips the feedback, as in Carbon React', async function (assert) {
    const prevent = (event: MouseEvent) => event.preventDefault();
    await render(
      <template>
        <Copy @ariaLabel="Copy" {{on "click" prevent}}>npm</Copy>
      </template>,
    );

    press();
    // Before the feedback could have timed out.
    await rerender();

    assert.strictEqual(label(), 'Copy');
  });

  test('the tooltip keeps the feedback up for @feedbackTimeout after the pointer leaves', async function (assert) {
    await render(
      <template>
        <Copy @ariaLabel="Copy" @feedbackTimeout={{1000}}>npm</Copy>
      </template>,
    );
    await triggerEvent('.cds--tooltip', 'mouseenter');
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    press();
    await waitUntil(() => label() === 'Copied!');
    find('.cds--tooltip')!.dispatchEvent(new MouseEvent('mouseleave'));
    // Longer than the 100ms it waits to close without feedback.
    const left = performance.now();
    await waitUntil(() => performance.now() - left > 200);
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    await settled();
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
    assert.strictEqual(label(), 'Copy');
  });

  test('@disabled disables the button and its tooltip', async function (assert) {
    await render(
      <template>
        <Copy @ariaLabel="Copy" @disabled={{true}}>npm</Copy>
      </template>,
    );

    assert.dom(BUTTON).isDisabled().hasClass('cds--btn--disabled');
    assert.dom('.cds--icon-tooltip').hasClass('cds--icon-tooltip--disabled');
  });
});
