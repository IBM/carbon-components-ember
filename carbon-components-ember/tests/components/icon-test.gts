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
});
