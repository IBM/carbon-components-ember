import { module, test } from 'qunit';
import {
  defaultCompareItems,
  defaultItemToString,
  defaultSortItems,
  enabledIndex,
  isEqual,
  isItemDisabled,
  isSelectAllItem,
  nextEnabledIndex,
  withoutUndefinedValues,
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

  test('nextEnabledIndex can stop at the ends instead of wrapping, as a select does', function (assert) {
    const items = ['a', 'b', { disabled: true }];
    const noLoop = { loop: false };
    assert.strictEqual(nextEnabledIndex(items, 1, 1, noLoop), 1, 'stays put');
    assert.strictEqual(nextEnabledIndex(items, 0, -1, noLoop), 0);
    assert.strictEqual(nextEnabledIndex(items, -1, 1, noLoop), 0);
    assert.strictEqual(
      nextEnabledIndex(items, 0, 10, noLoop),
      0,
      'past the end is the last item, which is disabled, so it stays put',
    );
  });

  test('isSelectAllItem is true only for isSelectAll: true', function (assert) {
    assert.true(isSelectAllItem({ isSelectAll: true }));
    assert.false(isSelectAllItem({ isSelectAll: false }));
    assert.false(isSelectAllItem({}));
    assert.false(isSelectAllItem(null));
  });

  test('isEqual compares values, arrays and plain objects', function (assert) {
    assert.true(isEqual('a', 'a'));
    assert.true(isEqual(Number.NaN, Number.NaN));
    assert.true(isEqual({ id: 1, tags: ['x'] }, { id: 1, tags: ['x'] }));
    assert.false(isEqual({ id: 1 }, { id: 2 }));
    assert.false(isEqual({ id: 1 }, { id: 1, extra: true }));
    assert.false(isEqual([1, 2], [2, 1]));
    assert.false(isEqual([1], { 0: 1 }));
    assert.false(isEqual(null, {}));
  });

  test('isEqual compares dates by time, and other objects by identity', function (assert) {
    const first = new Date('2026-01-01');
    assert.true(isEqual(first, new Date('2026-01-01')));
    assert.false(isEqual(first, new Date('2026-02-01')));
    assert.false(
      isEqual({ id: 1, when: first }, { id: 1, when: new Date('2026-02-01') }),
    );
    assert.true(isEqual(/a/g, /a/g));
    assert.false(isEqual(new Map([[1, 1]]), new Map([[1, 2]])));
    class Record {
      id: number;
      constructor(id: number) {
        this.id = id;
      }
    }
    const record = new Record(1);
    assert.true(isEqual(record, record));
    assert.false(isEqual(record, new Record(1)));
  });

  test('withoutUndefinedValues drops objects with an undefined value', function (assert) {
    const kept = { text: 'Kept' };
    assert.deepEqual(
      withoutUndefinedValues(['a', kept, { text: undefined }, null]),
      ['a', kept, null],
    );
  });

  test('defaultSortItems puts select-all, then the given selection, then the rest by text', function (assert) {
    const all = { text: 'All', isSelectAll: true };
    const ten = { text: 'Item 10' };
    const two = { text: 'Item 2' };
    const apple = { text: 'Apple' };
    const items = [ten, apple, all, two];
    const sorted = defaultSortItems(items, {
      selectedItems: [two],
      itemToString: (item) => item.text,
      compareItems: defaultCompareItems,
      locale: 'en',
    });
    assert.deepEqual(sorted, [all, two, apple, ten], 'numbers by value');
    assert.deepEqual(
      items,
      [ten, apple, all, two],
      "the items aren't sorted in place",
    );
  });
});
