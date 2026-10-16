import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import InlineNotification from '#src/components/notification/inline-notification.gts';

module('Integration | Component | InlineNotification', (hooks) => {
  setupRenderingTest(hooks);

  test('renders its status and text', async function (assert) {
    await render(
      <template>
        <InlineNotification
          @kind="warning"
          @title="Quota"
          @subtitle="You have used 90% of it."
        />
      </template>,
    );

    assert
      .dom('.cds--inline-notification')
      .hasClass('cds--inline-notification--warning')
      .hasAttribute('role', 'status');
    assert.dom('.cds--inline-notification__title').hasText('Quota');
    assert
      .dom('.cds--inline-notification__subtitle')
      .hasText('You have used 90% of it.');
  });

  test('the close button closes it, unless @onClose returns false', async function (assert) {
    const keep = () => false;
    await render(
      <template>
        <InlineNotification @title="Quota" @onClose={{keep}} />
      </template>,
    );
    await click('button');
    assert.dom('.cds--inline-notification').exists();

    await render(<template><InlineNotification @title="Quota" /></template>);
    await click('button');
    assert.dom('.cds--inline-notification').doesNotExist();
  });

  test('@hideCloseButton', async function (assert) {
    await render(
      <template>
        <InlineNotification @title="Quota" @hideCloseButton={{true}} />
      </template>,
    );

    assert
      .dom('.cds--inline-notification')
      .hasClass('cds--inline-notification--hide-close-button');
    assert.dom('button').doesNotExist();
  });
});
