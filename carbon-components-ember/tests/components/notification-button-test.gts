import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render, waitUntil } from '@ember/test-helpers';
import NotificationButton from '#src/components/notification/notification-button.gts';
import Add from '#src/components/icons/add.ts';

module('Integration | Component | NotificationButton', (hooks) => {
  setupRenderingTest(hooks);

  test('labels the close button', async function (assert) {
    await render(<template><NotificationButton /></template>);

    assert
      .dom('button')
      .hasClass('cds--toast-notification__close-button')
      .hasAttribute('type', 'button')
      .hasAttribute('aria-label', 'close notification')
      .hasAttribute('title', 'close notification');

    await render(
      <template>
        <NotificationButton @notificationType="inline" @ariaLabel="Dismiss" />
      </template>,
    );

    assert
      .dom('button')
      .hasClass('cds--inline-notification__close-button')
      .hasAttribute('aria-label', 'Dismiss')
      .hasAttribute('title', 'Dismiss');
  });

  test('@renderIcon replaces the close icon', async function (assert) {
    await render(
      <template><NotificationButton @renderIcon={{Add}} /></template>,
    );
    await waitUntil(() => find('svg'));

    assert
      .dom('svg')
      .hasClass('cds--toast-notification__close-icon')
      .hasAttribute('width', '16');
    assert.false(
      find('svg path')!.getAttribute('d')!.startsWith('M17.4141 16 24'),
      'not the close icon',
    );
  });
});
