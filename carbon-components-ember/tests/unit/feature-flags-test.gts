import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { FeatureFlags } from '@carbon/feature-flags';
import { FEATURE_FLAGS } from '#src/services/feature-flags.ts';

module('Unit | Service | feature-flags', (hooks) => {
  setupRenderingTest(hooks);

  test('knows every flag @carbon/feature-flags defines', function (assert) {
    assert.deepEqual(
      [...FEATURE_FLAGS].sort(),
      [...FeatureFlags.flags.keys()].sort(),
    );
  });

  test("starts from Carbon's defaults", function (assert) {
    const flags = this.owner.lookup('service:carbon.feature-flags');

    assert.true(flags.enabled('enable-v11-release'));
    assert.false(flags.enabled('enable-v12-release'));
    assert.false(flags.enabled('enable-v12-autoalign'));
  });

  test('enables, disables and merges flags', function (assert) {
    const flags = this.owner.lookup('service:carbon.feature-flags');

    flags.enable('enable-v12-tile-radio-icons');
    assert.true(flags.enabled('enable-v12-tile-radio-icons'));
    flags.disable('enable-v12-tile-radio-icons');
    assert.false(flags.enabled('enable-v12-tile-radio-icons'));

    flags.merge({ 'enable-presence': true, 'enable-dialog-element': true });
    assert.true(flags.enabled('enable-presence'));
    assert.true(flags.enabled('enable-dialog-element'));
  });

  test('enable-v12-release turns on every v12 flag', function (assert) {
    const flags = this.owner.lookup('service:carbon.feature-flags');

    flags.enable('enable-v12-release');
    assert.true(flags.enabled('enable-v12-autoalign'));
    assert.true(flags.enabled('enable-v12-overflowmenu'));
    assert.true(flags.enabled('enable-focus-wrap-without-sentinels'));
    assert.false(flags.enabled('enable-presence'), 'not a v12 flag');
  });

  test("takes the flags set on @carbon/feature-flags' global scope", function (assert) {
    FeatureFlags.enable('enable-v12-release');
    try {
      const flags = this.owner.lookup('service:carbon.feature-flags');
      assert.true(flags.enabled('enable-v12-autoalign'));
    } finally {
      FeatureFlags.disable('enable-v12-release');
    }
  });

  test('re-renders what reads a flag when it changes', async function (assert) {
    const flags = this.owner.lookup('service:carbon.feature-flags');
    const autoAlign = () => String(flags.enabled('enable-v12-autoalign'));

    await render(
      <template>
        <output>{{(autoAlign)}}</output>
      </template>,
    );
    assert.dom('output').hasText('false');

    flags.enable('enable-v12-autoalign');
    await settled();
    assert.dom('output').hasText('true');

    flags.disable('enable-v12-autoalign');
    await settled();
    assert.dom('output').hasText('false');

    flags.merge({ 'enable-v12-autoalign': true });
    await settled();
    assert.dom('output').hasText('true');
  });

  test('takes a flag set while rendering, before anything reads it', async function (assert) {
    const flags = this.owner.lookup('service:carbon.feature-flags');
    const enablePresence = () => {
      flags.enable('enable-presence');
      return '';
    };

    await render(<template>{{(enablePresence)}}</template>);
    assert.true(flags.enabled('enable-presence'));
  });
});
