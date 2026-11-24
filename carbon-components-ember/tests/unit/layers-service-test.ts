import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

module('Unit | Service | layers', function (hooks) {
  setupTest(hooks);

  test('layers render in the topmost modal, else the root, else document.body', async function (assert) {
    const layers = this.owner.lookup('service:carbon.layers');
    assert.strictEqual(layers.target, document.body);

    const root = document.createElement('div');
    layers.root = root;
    assert.strictEqual(layers.target, root);

    const dialog = document.createElement('dialog');
    const close = layers.addModal(dialog);
    await settled();
    assert.strictEqual(layers.target, dialog);

    close();
    await settled();
    assert.strictEqual(layers.target, root);
  });
});
