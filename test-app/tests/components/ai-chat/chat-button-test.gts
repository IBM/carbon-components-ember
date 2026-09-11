import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import AiChatChatButton from 'carbon-components-ember/components/ai-chat/chat-button';

module('Integration | Component | ai-chat/AiChatChatButton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a primary button by default', async function (assert) {
    await render(<template><AiChatChatButton>Click me</AiChatChatButton></template>);

    assert.dom('.cds-aichat-button').hasClass('cds--btn--primary');
    assert.dom('.cds-aichat-button').hasText('Click me');
  });

  test('@isQuickAction forces sm size and ghost kind by default', async function (assert) {
    await render(<template><AiChatChatButton @isQuickAction={{true}}>Option</AiChatChatButton></template>);

    assert.dom('.cds-aichat-button').hasClass('cds-aichat-button--quick-action');
    assert.dom('.cds-aichat-button').hasClass('cds--btn--ghost');
    assert.dom('.cds-aichat-button').hasClass('cds--layout--size-sm');
  });

  test('@isSelected on a quick action blocks clicks and marks data-is-selected', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;

    await render(
      <template>
        <AiChatChatButton @isQuickAction={{true}} @isSelected={{true}} @onClick={{onClick}}>Option</AiChatChatButton>
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

    await render(<template><AiChatChatButton @isSelected={{true}} @onClick={{onClick}}>Go</AiChatChatButton></template>);

    assert.dom('.cds-aichat-button').doesNotHaveAttribute('inert');

    await click('.cds-aichat-button');
    assert.strictEqual(clicks, 1);
  });

  test('an explicit @kind is respected even for a quick action', async function (assert) {
    await render(
      <template><AiChatChatButton @isQuickAction={{true}} @kind='secondary'>Option</AiChatChatButton></template>,
    );

    assert.dom('.cds-aichat-button').hasClass('cds--btn--secondary');
  });
});
