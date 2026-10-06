import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Notification from '#src/components/notification.gts';
import type { NotificationOptions } from '#src/services/notifications.ts';

module('Integration | Component | Notification', (hooks) => {
  setupRenderingTest(hooks);

  test('a queued @notification keeps its own type and display', async function (assert) {
    const notification: NotificationOptions = {
      title: 'Saved',
      type: 'success',
      display: 'inline',
    };

    await render(
      <template><Notification @notification={{notification}} /></template>,
    );

    assert
      .dom('.cds--inline-notification')
      .hasClass('cds--inline-notification--success');
    assert.dom('.cds--toast-notification').doesNotExist();
  });

  test('an explicit argument wins over @notification', async function (assert) {
    const notification: NotificationOptions = {
      title: 'Saved',
      type: 'success',
    };

    await render(
      <template>
        <Notification @notification={{notification}} @kind="warning" />
      </template>,
    );

    assert
      .dom('.cds--toast-notification')
      .hasClass('cds--toast-notification--warning');
  });

  test('defaults to an error toast', async function (assert) {
    await render(<template><Notification @title="Failed" /></template>);

    assert
      .dom('.cds--toast-notification')
      .hasClass('cds--toast-notification--error');
  });
});

module('Unit | Service | notifications', (hooks) => {
  setupRenderingTest(hooks);

  test("the caller's timeout is kept over the default", function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');

    service.success({ title: 'Saved', timeout: 0 });
    service.info({ title: 'Default timeout' });

    assert.strictEqual(service.queue[0]?.timeout, 0);
    assert.strictEqual(service.queue[0]?.type, 'success');
    assert.strictEqual(service.queue[1]?.timeout, 5000, 'defaults still apply');

    service.queue.clear();
  });
});
