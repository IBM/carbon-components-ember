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

// Ember auto-generates element ids (e.g. `ember314`) from a global counter
// that depends on how many components have been instantiated so far in the
// whole test run, not just this test. That count drifts as unrelated tests
// are added/removed elsewhere in the suite, so a literal id baked into a
// committed snapshot will eventually stop matching a fresh run even though
// nothing about this component changed. Normalize ids in both the live
// representation and the stored snapshot before comparing.
function normalizeEmberIds(representation: string) {
  return representation.replace(/ember[0-9]+/g, 'ember0');
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
          if (typeof value[i][0] === 'string') {
            value[i][0] = normalizeEmberIds(value[i][0]);
          }
          if (typeof expected[i]?.[0] === 'string') {
            expected[i][0] = normalizeEmberIds(expected[i][0]);
          }
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
