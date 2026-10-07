import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { Task } from '#src/icons.ts';

module('Integration | Component | Icon', (hooks) => {
  setupRenderingTest(hooks);

  test('@iconDescription names the @onClick button', async function (assert) {
    let clicks = 0;
    const onClick = () => {
      clicks++;
    };

    await render(
      <template>
        <Task @onClick={{onClick}} @iconDescription="Add task" />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-label', 'Add task');
    await click('button');
    assert.strictEqual(clicks, 1);
  });

  test('@danger asks for confirmation before calling @onClick', async function (assert) {
    let clicks = 0;
    const onClick = () => {
      clicks++;
    };

    await render(
      <template>
        <Task
          @onClick={{onClick}}
          @iconDescription="Delete task"
          @danger={{true}}
          @confirmText="Really delete?"
        />
        <div id="carbon-components-dialog-id"></div>
      </template>,
    );

    await click('[aria-label="Delete task"]');
    assert.dom('#carbon-components-dialog-id').containsText('Really delete?');
    assert.strictEqual(clicks, 0, 'onClick waits for the confirmation');

    await click('#carbon-components-dialog-id [data-modal-primary-focus]');
    assert.strictEqual(clicks, 1);
    assert.dom('#carbon-components-dialog-id .cds--modal').doesNotExist();
  });

  test('cancelling the @danger confirmation skips @onClick', async function (assert) {
    let clicks = 0;
    const onClick = () => {
      clicks++;
    };

    await render(
      <template>
        <Task
          @onClick={{onClick}}
          @iconDescription="Delete task"
          @danger={{true}}
        />
        <div id="carbon-components-dialog-id"></div>
      </template>,
    );

    await click('[aria-label="Delete task"]');
    assert
      .dom('#carbon-components-dialog-id')
      .containsText('Confirm this operation');

    await click('#carbon-components-dialog-id [data-modal-close]');
    assert.strictEqual(clicks, 0);
    assert.dom('#carbon-components-dialog-id .cds--modal').doesNotExist();
  });
});
