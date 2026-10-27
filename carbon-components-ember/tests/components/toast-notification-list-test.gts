import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  findAll,
  render,
  settled,
  waitUntil,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Modal from '#src/components/modal.gts';
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

  test('moves into an open Modal, so its toasts can be used over it', async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    const open = tracked(false);
    await render(
      <template>
        <ToastNotificationList class="app-toasts" />
        <Modal @open={{open.value}} @modalHeading="Edit" />
      </template>,
    );
    const home = find('.cds--ember-toast-notification-list__home');
    service.error({ title: 'Failed' });
    await waitUntil(() => find('.cds--toast-notification'));
    const toast = find('.cds--toast-notification');

    open.value = true;
    await settled();
    const dialog = find('dialog');
    assert.strictEqual(
      find('.app-toasts')?.parentElement,
      dialog,
      'the list is in the modal',
    );
    assert.strictEqual(
      find('.cds--toast-notification'),
      toast,
      'its toasts are not rendered again',
    );
    // Nothing outside an open modal dialog can take focus.
    const close = toast!.querySelector('button')!;
    close.focus();
    assert.dom(close).isFocused();

    service.warning({ title: 'Quota' });
    await waitUntil(() => findAll('.cds--toast-notification').length === 2);
    assert.dom('.cds--toast-notification', dialog).exists({ count: 2 });

    open.value = false;
    await settled();
    assert.strictEqual(find('.app-toasts')?.parentElement, home, 'and back');
  });

  test('goes back when an open Modal goes away', async function (assert) {
    const service = this.owner.lookup('service:carbon.notifications');
    const shown = tracked(true);
    await render(
      <template>
        <ToastNotificationList class="app-toasts" />
        {{#if shown.value}}
          <Modal @open={{true}} @modalHeading="Edit" />
        {{/if}}
      </template>,
    );
    service.error({ title: 'Failed' });
    await waitUntil(() => find('dialog .cds--toast-notification'));

    shown.value = false;
    await settled();
    assert.strictEqual(
      find('.app-toasts')?.parentElement,
      find('.cds--ember-toast-notification-list__home'),
    );
    assert.dom('.cds--toast-notification').exists();
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
