import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import ChatButton from '#src/components/ai-chat/chat-button.gts';

module('Integration | Component | ai-chat/ChatButton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a primary button by default', async function (assert) {
    await render(
      <template>
        <ChatButton>Click me</ChatButton>
      </template>,
    );

    assert.dom('.cds-aichat-button').hasClass('cds--btn--primary');
    assert.dom('.cds-aichat-button').hasText('Click me');
  });

  test('@isQuickAction forces sm size and ghost kind by default', async function (assert) {
    await render(
      <template>
        <ChatButton @isQuickAction={{true}}>Option</ChatButton>
      </template>,
    );

    assert
      .dom('.cds-aichat-button')
      .hasClass('cds-aichat-button--quick-action');
    assert.dom('.cds-aichat-button').hasClass('cds--btn--ghost');
    assert.dom('.cds-aichat-button').hasClass('cds--layout--size-sm');
  });

  test('@isSelected on a quick action blocks clicks and marks data-is-selected', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;

    await render(
      <template>
        <ChatButton
          @isQuickAction={{true}}
          @isSelected={{true}}
          @onClick={{onClick}}
        >Option</ChatButton>
      </template>,
    );

    assert.dom('.cds-aichat-button').hasAttribute('data-is-selected');
    assert.dom('.cds-aichat-button').hasAttribute('inert');

    await click('.cds-aichat-button');
    assert.strictEqual(clicks, 0, 'click was blocked');
  });

  test('@isSelected has no effect without @isQuickAction', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;

    await render(
      <template>
        <ChatButton @isSelected={{true}} @onClick={{onClick}}>Go</ChatButton>
      </template>,
    );

    assert.dom('.cds-aichat-button').doesNotHaveAttribute('inert');

    await click('.cds-aichat-button');
    assert.strictEqual(clicks, 1);
  });

  test('an explicit @kind is respected even for a quick action', async function (assert) {
    await render(
      <template>
        <ChatButton
          @isQuickAction={{true}}
          @kind="secondary"
        >Option</ChatButton>
      </template>,
    );

    assert.dom('.cds-aichat-button').hasClass('cds--btn--secondary');
  });

  test('@kind="danger" renders as a danger button', async function (assert) {
    await render(
      <template>
        <ChatButton @kind="danger">Delete</ChatButton>
      </template>,
    );

    assert.dom('.cds-aichat-button').hasClass('cds--btn--danger');
    assert.dom('.cds-aichat-button').doesNotHaveClass('cds--btn--primary');
    assert.dom('.cds-aichat-button').doesNotHaveClass('cds--btn--secondary');
  });
});
