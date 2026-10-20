import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { TrackedPromise } from '#src/utils/tracked.ts';

module('Unit | Utility | tracked-promise', function (hooks) {
  setupRenderingTest(hooks);

  test('getValue() resolves once the underlying promise resolves', async function (assert) {
    const tracked = new TrackedPromise(() => Promise.resolve('loaded'));

    assert.strictEqual(tracked.getValue(), undefined);
    await settled();
    assert.strictEqual(tracked.getValue(), 'loaded');
  });

  test('render() waits for the value to load', async function (assert) {
    // A timer settled() knows nothing about, as a chunk loading would be.
    const value = new TrackedPromise(
      () =>
        new Promise<string>((resolve) =>
          setTimeout(() => resolve('Loaded'), 50),
        ),
    );
    const text = () => value.getValue();

    await render(
      <template>
        <p>{{(text)}}</p>
      </template>,
    );

    assert.dom('p').hasText('Loaded');
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
