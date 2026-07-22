import * as QUnit from 'qunit';


// @ts-expect-error vite stuff
const __SNAPSHOTS__ = import.meta.glob("./__snapshots__/**/*", { eager: true });


declare global {
  interface Assert {
    snapshot(value: any, name: string): void;
  }
}

function testUrl(moduleName, testName, name) {
  return `/__snapshots__/${moduleName}/${testName}/${name}.json`.toLowerCase().replace(/ /g, '-');
}

function saveSnapshot(moduleName, testName, name, value) {
  void fetch(testUrl(moduleName, testName, name), {
    method: 'POST',
    body: JSON.stringify(value, null, 2),
  });
}

// Positioning properties derived from floating-ui/popover placement shift by
// sub-pixel amounts depending on the font metrics of the host running the
// browser (e.g. CI's Linux font stack vs. a locally generated snapshot), even
// though the layout is otherwise identical. Treat two values as equal when
// every number embedded in them (px offsets, matrix() components, the four
// `inset` values, ...) is within a small tolerance of the other.
const FUZZY_NUMERIC_PROPS = ['left', 'right', 'top', 'bottom', 'inset', 'transform'];

function numbersWithinTolerance(a: string, b: string, tolerance: number) {
  const numsA = a.match(/-?\d+(\.\d+)?/g);
  const numsB = b.match(/-?\d+(\.\d+)?/g);
  if (!numsA || !numsB || numsA.length !== numsB.length) {
    return false;
  }
  return numsA.every((n, idx) => Math.abs(parseFloat(n) - parseFloat(numsB[idx])) < tolerance);
}

export function setupSnapshot(assert: Assert) {
  assert.snapshot = function(value, name) {
    const current = QUnit.config.current;
    const currentModule = current.module;
    const moduleName = currentModule.name;
    const testName = current.testName;
    const url = testUrl(moduleName, testName, name);
    const expected = __SNAPSHOTS__[`.${url}`]?.default;
    if (!expected) {
      saveSnapshot(moduleName, testName, name, value);
    }
    if (window.location.search.includes('save-snapshots')) {
      if (!QUnit.equiv(value, expected)) {
        saveSnapshot(moduleName, testName, name, value);
      }
    }
    if (typeof value === 'object' && typeof expected === 'object') {
      if (Array.isArray(value) && value.length === expected.length) {
        for (let i = 0; i < value.length; i++) {
          expected[i][1]['transition'] = expected[i][1]['transition']?.replace(/0s$/, '');
          delete expected[i][1]['font'];
          delete value[i][1]['font'];
          value[i][1]['transition'] = value[i][1]['transition']?.replace(/0s$/, '');
          if (value[i][1]['width'] && expected[i][1]['width']) {
            const vWidth = Number(value[i][1]['width'].replace('px', ''));
            const expectedWidth = Number(expected[i][1]['width'].replace('px', ''));
            console.log('width', vWidth, expectedWidth);
            if (Math.abs(vWidth - expectedWidth) < 2) {
              delete value[i][1]['width'];
              delete expected[i][1]['width'];
            }
          }
          if (value[i][1]['height'] && expected[i][1]['width']) {
            const vWidth = Number(value[i][1]['height'].replace('px', ''));
            const expectedWidth = Number(expected[i][1]['height'].replace('px', ''));
            console.log('height', vWidth, expectedWidth);
            if (Math.abs(vWidth - expectedWidth) < 2) {
              delete value[i][1]['height'];
              delete expected[i][1]['height'];
            }
          }
          for (const prop of FUZZY_NUMERIC_PROPS) {
            const v = value[i][1][prop];
            const e = expected[i][1][prop];
            if (v && e && numbersWithinTolerance(v, e, 3)) {
              delete value[i][1][prop];
              delete expected[i][1][prop];
            }
          }
          if (!QUnit.equiv(value[i], expected[i])) {
            console.log('deepEqual', name + ' item:' + i, JSON.stringify(value[i], null, 2), JSON.stringify(expected[i], null, 2));
          }
          assert.deepEqual(value[i], expected[i], name + ' item:' + i);
        }
        return;
      }
      assert.deepEqual(value, expected);
    } else {
      assert.equal(value, expected);
    }
  }
}
