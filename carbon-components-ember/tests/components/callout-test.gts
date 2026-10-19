import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import Callout from '#src/components/notification/callout.gts';

module('Integration | Component | Callout', (hooks) => {
  setupRenderingTest(hooks);

  test('is a passive info notification', async function (assert) {
    await render(
      <template>
        <Callout @title="Heads up" @subtitle="Maintenance on Sunday." />
      </template>,
    );

    assert
      .dom('.cds--actionable-notification')
      .hasClass('cds--actionable-notification--callout')
      .hasClass('cds--actionable-notification--info')
      .hasClass('cds--actionable-notification--hide-close-button')
      .doesNotHaveAttribute('role');
    assert.dom('button').doesNotExist();
  });

  test('its action is described by the title', async function (assert) {
    const onActionButtonClick = () => assert.step('action');
    await render(
      <template>
        <Callout
          @kind="warning"
          @title="Heads up"
          @titleId="maintenance"
          @actionButtonLabel="Details"
          @onActionButtonClick={{onActionButtonClick}}
        />
      </template>,
    );

    assert.dom('#maintenance').hasText('Heads up');
    assert
      .dom('.cds--actionable-notification__action-button')
      .hasAria('describedby', 'maintenance')
      .hasClass('cds--btn--ghost');
    await click('.cds--actionable-notification__action-button');
    assert.verifySteps(['action']);
  });
});
