import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  find,
  focus,
  render,
  triggerEvent,
  waitUntil,
} from '@ember/test-helpers';
import ToastNotification from '#src/components/notification/toast-notification.gts';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

module('Integration | Component | ToastNotification', (hooks) => {
  setupRenderingTest(hooks);

  test('renders an error status by default', async function (assert) {
    await render(
      <template>
        <ToastNotification
          @title="Upload failed"
          @subtitle="The file is too large."
          @caption="00:00:00 AM"
        >
          <span data-test-extra>More</span>
        </ToastNotification>
      </template>,
    );
    await waitUntil(() => find('svg[role="img"]'));

    assert
      .dom('.cds--toast-notification')
      .hasClass('cds--toast-notification--error')
      .hasAttribute('role', 'status');
    assert
      .dom('.cds--toast-notification__icon')
      .hasAttribute('aria-label', 'error icon');
    assert.dom('.cds--toast-notification__title').hasText('Upload failed');
    assert
      .dom('.cds--toast-notification__subtitle')
      .hasText('The file is too large.');
    assert.dom('.cds--toast-notification__caption').hasText('00:00:00 AM');
    assert.dom('.cds--toast-notification__details [data-test-extra]').exists();
  });

  test('leaves out what it has no text for', async function (assert) {
    await render(<template><ToastNotification @title="Saved" /></template>);

    assert.dom('.cds--toast-notification__subtitle').doesNotExist();
    assert.dom('.cds--toast-notification__caption').doesNotExist();
  });

  test('the role attribute, @ariaLabel and @lowContrast', async function (assert) {
    await render(
      <template>
        <ToastNotification
          @kind="success"
          @lowContrast={{true}}
          @ariaLabel="Dismiss"
          @statusIconDescription="Done"
          @title="Saved"
          role="alert"
        />
      </template>,
    );
    await waitUntil(() => find('svg[role="img"]'));

    assert
      .dom('.cds--toast-notification')
      .hasAttribute('role', 'alert')
      .doesNotHaveAttribute('aria-label')
      .hasClass('cds--toast-notification--low-contrast');
    assert
      .dom('button')
      .hasAttribute('aria-label', 'Dismiss')
      .hasAttribute('title', 'Dismiss');
    assert
      .dom('.cds--toast-notification__icon')
      .hasAttribute('aria-label', 'Done');
  });

  test('the close button closes it, unless @onClose returns false', async function (assert) {
    let keepOpen = true;
    const onClose = () => {
      assert.step('onClose');
      return keepOpen ? false : undefined;
    };
    const onCloseButtonClick = () => assert.step('onCloseButtonClick');

    await render(
      <template>
        <ToastNotification
          @title="Saved"
          @onClose={{onClose}}
          @onCloseButtonClick={{onCloseButtonClick}}
        />
      </template>,
    );

    await click('button');
    assert.dom('.cds--toast-notification').exists();
    keepOpen = false;
    await click('button');
    assert.dom('.cds--toast-notification').doesNotExist();
    assert.verifySteps([
      'onCloseButtonClick',
      'onClose',
      'onCloseButtonClick',
      'onClose',
    ]);
  });

  test('@hideCloseButton', async function (assert) {
    await render(
      <template>
        <ToastNotification @title="Saved" @hideCloseButton={{true}} />
      </template>,
    );

    assert.dom('button').doesNotExist();
  });

  test('closes after @timeout', async function (assert) {
    const onClose = (event?: Event) => {
      assert.step(event ? 'onClose with an event' : 'onClose');
    };
    await render(
      <template>
        <ToastNotification
          @title="Saved"
          @timeout={{300}}
          @onClose={{onClose}}
        />
      </template>,
    );

    assert.dom('.cds--toast-notification').exists('settled() does not wait');
    await waitUntil(() => !find('.cds--toast-notification'));
    assert.verifySteps(['onClose']);
  });

  test('the timeout pauses while hovered', async function (assert) {
    await render(
      <template>
        <ToastNotification @title="Saved" @timeout={{200}} />
      </template>,
    );

    await triggerEvent('.cds--toast-notification', 'mouseenter');
    await wait(400);
    assert.dom('.cds--toast-notification').exists();

    await triggerEvent('.cds--toast-notification', 'mouseleave');
    await waitUntil(() => !find('.cds--toast-notification'));
    assert.dom('.cds--toast-notification').doesNotExist();
  });

  test('the timeout pauses while focus is inside', async function (assert) {
    await render(
      <template>
        <ToastNotification @title="Saved" @timeout={{200}} />
      </template>,
    );

    await focus('button');
    await wait(400);
    assert.dom('.cds--toast-notification').exists();

    await blur('button');
    await waitUntil(() => !find('.cds--toast-notification'));
    assert.dom('.cds--toast-notification').doesNotExist();
  });
});
