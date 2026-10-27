import { module, test } from 'qunit';
import { fieldState } from '#src/components/-private/field.gts';

module('Unit | Utility | fieldState', function () {
  test('gives the texts ids from the control id', function (assert) {
    const field = fieldState('name', {});
    assert.strictEqual(field.invalidId, 'name-error-msg');
    assert.strictEqual(field.warnId, 'name-warn-msg');
    assert.strictEqual(field.helperId, 'name-helper-text');
  });

  test('works out the state as Carbon React does', function (assert) {
    const state = (args: Parameters<typeof fieldState>[1]) => {
      const { disabled, invalid, warn } = fieldState('name', args);
      return { disabled, invalid, warn };
    };
    assert.deepEqual(
      state({ invalid: true, warn: true }),
      { disabled: false, invalid: true, warn: false },
      'invalid beats warn',
    );
    assert.deepEqual(
      state({ disabled: true, invalid: true, warn: true }),
      { disabled: true, invalid: false, warn: false },
      'disabled clears both',
    );
    assert.deepEqual(
      state({ readOnly: true, disabled: true, invalid: true }),
      { disabled: false, invalid: false, warn: false },
      'read-only beats disabled, and clears both too',
    );
  });
});
