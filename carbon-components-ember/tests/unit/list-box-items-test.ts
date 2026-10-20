import { module, test } from 'qunit';
import {
  defaultItemToString,
  enabledIndex,
  isItemDisabled,
  nextEnabledIndex,
} from '#src/components/-private/list-box/items.ts';

module('Unit | ListBox | items', function () {
  test('defaultItemToString reads a string, a number or a label', function (assert) {
    assert.strictEqual(defaultItemToString('Apple'), 'Apple');
    assert.strictEqual(defaultItemToString(3), '3');
    assert.strictEqual(defaultItemToString({ label: 'Cherry' }), 'Cherry');
    assert.strictEqual(defaultItemToString({ text: 'Cherry' }), '');
    assert.strictEqual(defaultItemToString(null), '');
  });

  test('isItemDisabled is true only for disabled: true', function (assert) {
    assert.true(isItemDisabled({ disabled: true }));
    assert.false(isItemDisabled({ disabled: 'yes' }));
    assert.false(isItemDisabled({}));
    assert.false(isItemDisabled('disabled'));
    assert.false(isItemDisabled(null));
  });

  test('enabledIndex finds the next enabled item either way', function (assert) {
    const items = [{ disabled: true }, 'b', { disabled: true }, 'd'];
    assert.strictEqual(enabledIndex(items, 0), 1);
    assert.strictEqual(enabledIndex(items, 2), 3);
    assert.strictEqual(enabledIndex(items, 2, true), 1);
    assert.strictEqual(enabledIndex(items, 0, true), -1);
    assert.strictEqual(enabledIndex([], 0), -1);
  });

  test('nextEnabledIndex steps, wraps around and skips disabled items', function (assert) {
    const items = ['a', { disabled: true }, 'c', 'd'];
    assert.strictEqual(
      nextEnabledIndex(items, -1, 1),
      0,
      'from none, the first',
    );
    assert.strictEqual(
      nextEnabledIndex(items, -1, -1),
      3,
      'from none, the last',
    );
    assert.strictEqual(nextEnabledIndex(items, 0, 1), 2, 'skips the disabled');
    assert.strictEqual(nextEnabledIndex(items, 2, -1), 0);
    assert.strictEqual(nextEnabledIndex(items, 3, 1), 0, 'wraps to the start');
    assert.strictEqual(nextEnabledIndex(items, 0, -1), 3, 'wraps to the end');
  });

  test('nextEnabledIndex jumps past either end to the other one, as downshift pages', function (assert) {
    const items = Array.from({ length: 15 }, (_, index) => index);
    assert.strictEqual(nextEnabledIndex(items, 3, 10), 13);
    assert.strictEqual(nextEnabledIndex(items, 10, 10), 0);
    assert.strictEqual(nextEnabledIndex(items, 3, -10), 14);
  });

  test('nextEnabledIndex finds nothing when every item is disabled', function (assert) {
    const items = [{ disabled: true }, { disabled: true }];
    assert.strictEqual(nextEnabledIndex(items, -1, 1), -1);
    assert.strictEqual(nextEnabledIndex([], 0, 1), -1);
  });
});
