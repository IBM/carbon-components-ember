import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, findAll, render, waitUntil } from '@ember/test-helpers';
import ToastNotificationList from '#src/components/notification/toast-notification-list.gts';

module('Unit | Service | notifications', (hooks) => {
  setupRenderingTest(hooks);

  test('adds toasts newest first and removes them', function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');

    const saved = service.success({ title: 'Saved' });
    const failed = service.error({ title: 'Failed' });
    assert.deepEqual(
      service.toasts.map((toast) => toast.title),
      ['Failed', 'Saved'],
    );
    assert.strictEqual(saved.kind, 'success');

    service.remove(failed);
    assert.deepEqual(service.toasts, [saved]);
    service.clear();
    assert.deepEqual(service.toasts, []);
  });

  test('only info and success toasts time out by default', function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');

    assert.strictEqual(service.info({}).timeout, 5000);
    assert.strictEqual(service.add({ kind: 'info-square' }).timeout, 5000);
    assert.strictEqual(service.success({}).timeout, 5000);
    assert.strictEqual(service.warning({}).timeout, 0);
    assert.strictEqual(service.add({ kind: 'warning-alt' }).timeout, 0);
    assert.strictEqual(service.error({}).timeout, 0);
    assert.strictEqual(service.add({}).timeout, 0, 'kind defaults to error');
    assert.strictEqual(
      service.success({ actionButtonLabel: 'Undo' }).timeout,
      0,
      'toasts with an action stay',
    );
    assert.strictEqual(service.error({ timeout: 3000 }).timeout, 3000);
    assert.strictEqual(service.success({ timeout: 0 }).timeout, 0);
  });
});

module('Integration | Component | ToastNotificationList', (hooks) => {
  setupRenderingTest(hooks);

  test("renders the service's toasts and removes closed ones", async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    await render(<template><ToastNotificationList /></template>);
    assert.dom('.cds--ember-toast-notification-list').exists();

    service.error({
      title: 'Upload failed',
      onClose: () => assert.step('onClose'),
    });
    service.warning({ title: 'Quota', role: 'alert' });
    await waitUntil(() => findAll('.cds--toast-notification').length === 2);

    const [quota, upload] = findAll('.cds--toast-notification');
    assert.dom(quota).hasAttribute('role', 'alert');
    assert.dom('.cds--toast-notification__title', quota).hasText('Quota');
    assert.dom(upload).hasAttribute('role', 'status');
    assert
      .dom('.cds--toast-notification__title', upload)
      .hasText('Upload failed');

    await click(upload!.querySelector('button')!);
    assert.verifySteps(['onClose']);
    assert.deepEqual(
      service.toasts.map((toast) => toast.title),
      ['Quota'],
    );
    assert.dom('.cds--toast-notification').exists({ count: 1 });
  });

  test('keeps a toast whose onClose returns false', async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    await render(<template><ToastNotificationList /></template>);
    service.error({ title: 'Failed', onClose: () => false });
    await waitUntil(() => find('.cds--toast-notification'));

    await click('.cds--toast-notification button');
    assert.dom('.cds--toast-notification').exists();
    assert.strictEqual(service.toasts.length, 1);
  });

  test('removes a toast once it times out', async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    await render(<template><ToastNotificationList /></template>);
    service.success({ title: 'Saved', timeout: 20 });

    await waitUntil(() => service.toasts.length === 0);
    assert.dom('.cds--toast-notification').doesNotExist();
  });

  test('a toast with an action is an ActionableNotification', async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    await render(<template><ToastNotificationList /></template>);
    const toast = service.info({
      title: 'Project deleted',
      actionButtonLabel: 'Undo',
      onActionButtonClick: () => service.remove(toast),
    });
    await waitUntil(() => find('.cds--actionable-notification'));

    assert
      .dom('.cds--actionable-notification')
      .hasClass('cds--actionable-notification--toast')
      .hasAttribute('role', 'alertdialog');
    await click('.cds--actionable-notification__action-button');
    assert.dom('.cds--actionable-notification').doesNotExist();
  });
});
