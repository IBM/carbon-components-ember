import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  focus,
  render,
  triggerKeyEvent,
} from '@ember/test-helpers';
import ActionableNotification from '#src/components/notification/actionable-notification.gts';

module('Integration | Component | ActionableNotification', (hooks) => {
  setupRenderingTest(hooks);

  test('is an alert dialog that moves focus to its action', async function (assert) {
    const onActionButtonClick = () => assert.step('action');
    await render(
      <template>
        <ActionableNotification
          @title="Session expiring"
          @subtitle="Save your work."
          @actionButtonLabel="Stay signed in"
          @onActionButtonClick={{onActionButtonClick}}
        />
      </template>,
    );

    assert
      .dom('.cds--actionable-notification')
      .hasAttribute('role', 'alertdialog')
      .hasClass('cds--actionable-notification--toast')
      .hasAria('labelledby', find('.cds--actionable-notification__title')!.id);
    assert
      .dom('.cds--actionable-notification__action-button')
      .isFocused()
      .hasClass('cds--btn--tertiary');

    await click('.cds--actionable-notification__action-button');
    assert.verifySteps(['action']);
  });

  test('is labelled by its subtitle without a title', async function (assert) {
    await render(
      <template>
        <ActionableNotification @subtitle="Save your work." />
      </template>,
    );

    assert
      .dom('.cds--actionable-notification')
      .hasAria(
        'labelledby',
        find('.cds--actionable-notification__subtitle')!.id,
      );
    assert.dom('.cds--actionable-notification__action-button').doesNotExist();
  });

  test('Tab wraps around inside it', async function (assert) {
    await render(
      <template>
        <ActionableNotification @title="Expiring" @actionButtonLabel="Stay" />
      </template>,
    );
    const close = '.cds--actionable-notification__close-button';
    await focus(close);

    await triggerKeyEvent(close, 'keydown', 'Tab');
    assert.dom('.cds--actionable-notification__action-button').isFocused();

    await triggerKeyEvent(
      '.cds--actionable-notification__action-button',
      'keydown',
      'Tab',
      { shiftKey: true },
    );
    assert.dom(close).isFocused();
  });

  test('another @role neither moves nor keeps focus', async function (assert) {
    await render(
      <template>
        <ActionableNotification
          @role="status"
          @title="Expiring"
          @actionButtonLabel="Stay"
        />
      </template>,
    );

    assert.dom('.cds--actionable-notification').hasAttribute('role', 'status');
    assert.dom('.cds--actionable-notification__action-button').isNotFocused();

    const close = '.cds--actionable-notification__close-button';
    await focus(close);
    await triggerKeyEvent(close, 'keydown', 'Tab');
    assert.dom(close).isFocused();
  });

  test('Escape closes it, unless @closeOnEscape is false', async function (assert) {
    const onCloseButtonClick = () => assert.step('onCloseButtonClick');
    const onClose = () => assert.step('onClose');
    await render(
      <template>
        <ActionableNotification
          @title="Expiring"
          @closeOnEscape={{false}}
          @onClose={{onClose}}
        />
      </template>,
    );
    await triggerKeyEvent('.cds--actionable-notification', 'keydown', 'Escape');
    assert.dom('.cds--actionable-notification').exists();

    await render(
      <template>
        <ActionableNotification
          @title="Expiring"
          @onClose={{onClose}}
          @onCloseButtonClick={{onCloseButtonClick}}
        />
      </template>,
    );
    await triggerKeyEvent('.cds--actionable-notification', 'keydown', 'Escape');
    assert.dom('.cds--actionable-notification').doesNotExist();
    assert.verifySteps(['onCloseButtonClick', 'onClose']);
  });

  test('@inline', async function (assert) {
    await render(
      <template>
        <ActionableNotification
          @inline={{true}}
          @title="Expiring"
          @actionButtonLabel="Stay"
        />
      </template>,
    );

    assert
      .dom('.cds--actionable-notification')
      .doesNotHaveClass('cds--actionable-notification--toast');
    assert
      .dom('.cds--actionable-notification__action-button')
      .hasClass('cds--btn--ghost');
  });
});
