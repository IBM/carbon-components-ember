import { module, test } from 'qunit';
import { destroy } from '@ember/destroyable';
import { afterRender } from '#src/utils/after-render.ts';

const microtask = () => Promise.resolve();

module('Unit | Utility | afterRender', function () {
  test('runs the callback after the current synchronous work', async function (assert) {
    let ran = false;
    afterRender({}, () => (ran = true));

    assert.false(ran);
    await microtask();
    assert.true(ran);
  });

  test('cancelling skips the callback', async function (assert) {
    let ran = false;
    const cancel = afterRender({}, () => (ran = true));
    cancel();

    await microtask();
    assert.false(ran);
  });

  test('a destroyed destroyable skips the callback', async function (assert) {
    let ran = false;
    const destroyable = {};
    afterRender(destroyable, () => (ran = true));
    destroy(destroyable);

    await microtask();
    assert.false(ran);
  });
});
