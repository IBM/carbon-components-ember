import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { TrackedPromise } from 'carbon-components-ember/utils/tracked';

module('Unit | Utility | tracked-promise', function () {
  test('getValue() resolves once the underlying promise resolves', async function (assert) {
    const tracked = new TrackedPromise(() => Promise.resolve('loaded'));

    assert.strictEqual(tracked.getValue(), undefined);
    await settled();
    assert.strictEqual(tracked.getValue(), 'loaded');
  });

  test('a rejected load() does not permanently wedge the value — a later getValue() retries', async function (assert) {
    let attempt = 0;
    const tracked = new TrackedPromise(() => {
      attempt++;
      return attempt === 1
        ? Promise.reject(new Error('transient failure'))
        : Promise.resolve('loaded-on-retry');
    });

    tracked.getValue();
    await settled();
    assert.strictEqual(
      tracked.getValue(),
      undefined,
      'value stays undefined after a rejected load',
    );

    // A later render calling getValue() again should retry rather than
    // being stuck forever because `promise` was never cleared.
    tracked.getValue();
    await settled();
    assert.strictEqual(tracked.getValue(), 'loaded-on-retry');
    assert.strictEqual(attempt, 2);
  });
});
