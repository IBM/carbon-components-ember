import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import Launcher from 'carbon-components-ember/components/ai-chat/launcher';

module('Integration | Component | ai-chat/Launcher', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the closed-state aria label and no badge by default', async function (assert) {
    await render(
      <template><Launcher @closedLabel='Open chat' /></template>,
    );

    assert.dom('.cds-aichat-launcher__button').hasAttribute('aria-label', 'Open chat');
    assert.dom('.cds-aichat-launcher__count-indicator').doesNotExist();
  });

  test('it appends the unread label to the aria label', async function (assert) {
    await render(
      <template>
        <Launcher @closedLabel='Open chat' @unreadLabel='3 unread messages' />
      </template>,
    );

    assert
      .dom('.cds-aichat-launcher__button')
      .hasAttribute('aria-label', 'Open chat. 3 unread messages');
  });

  test('it shows a count badge when @unreadMessageCount is greater than 0', async function (assert) {
    await render(
      <template><Launcher @unreadMessageCount={{3}} /></template>,
    );

    assert.dom('.cds-aichat-launcher__count-indicator').exists();
    assert.dom('.cds-aichat-launcher__count-indicator').hasText('3');
  });

  test('it shows an empty badge when @showUnreadIndicator is true and the count is 0', async function (assert) {
    await render(
      <template><Launcher @showUnreadIndicator={{true}} /></template>,
    );

    assert.dom('.cds-aichat-launcher__count-indicator').exists();
    assert.dom('.cds-aichat-launcher__count-indicator').hasText('');
  });

  test('it renders an avatar image instead of the icon when @launcherAvatarUrl is set', async function (assert) {
    await render(
      <template>
        <Launcher @launcherAvatarUrl='https://example.com/avatar.png' />
      </template>,
    );

    assert
      .dom('.cds-aichat-launcher__avatar')
      .hasAttribute('src', 'https://example.com/avatar.png');
    assert.dom('.cds-aichat-launcher__icon-holder svg').doesNotExist();
  });

  test('it calls @onToggle when clicked', async function (assert) {
    let calls = 0;
    const onToggle = () => calls++;

    await render(<template><Launcher @onToggle={{onToggle}} /></template>);

    await click('.cds-aichat-launcher__button');
    assert.strictEqual(calls, 1);
  });
});
