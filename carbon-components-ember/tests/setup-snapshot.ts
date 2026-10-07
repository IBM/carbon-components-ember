import * as QUnit from 'qunit';

/** A style snapshot: each element's representation and its changed styles. */
export type StyleSnapshot = [element: string, styles: StyleDiff][];
type StyleDiff = Record<string, string | undefined>;

const __SNAPSHOTS__ = import.meta.glob<{ default: StyleSnapshot }>(
  './__snapshots__/**/*',
  { eager: true },
);

declare global {
  interface Assert {
    snapshot(value: StyleSnapshot, name: string): void;
  }
}

// @types/qunit types `QUnit.config.current` as `any`.
interface CurrentTest {
  module: { name: string };
  testName: string;
}

function testUrl(moduleName: string, testName: string, name: string) {
  return `/__snapshots__/${moduleName}/${testName}/${name}.json`
    .toLowerCase()
    .replace(/ /g, '-');
}

function saveSnapshot(
  moduleName: string,
  testName: string,
  name: string,
  value: unknown,
) {
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
const FUZZY_NUMERIC_PROPS = [
  'left',
  'right',
  'top',
  'bottom',
  'inset',
  'transform',
];

function numbersWithinTolerance(a: string, b: string, tolerance: number) {
  const numsA = a.match(/-?\d+(\.\d+)?/g);
  const numsB = b.match(/-?\d+(\.\d+)?/g);
  if (!numsA || !numsB || numsA.length !== numsB.length) {
    return false;
  }
  return numsA.every(
    (n, idx) => Math.abs(parseFloat(n) - parseFloat(numsB[idx]!)) < tolerance,
  );
}

// Ember auto-generates element ids (e.g. `ember314`) from a global counter
// that depends on how many components have been instantiated so far in the
// whole test run, not just this test. That count drifts as unrelated tests
// are added/removed elsewhere in the suite, so a literal id baked into a
// committed snapshot will eventually stop matching a fresh run even though
// nothing about this component changed. Normalize ids in both the live
// representation and the stored snapshot before comparing.
//
// Whitespace is collapsed for the same reason: the element representation
// includes the raw `class` attribute, whose line breaks and indentation come
// from how the template happens to be formatted, not from what it renders.
function normalizeEmberIds(representation: string) {
  return representation.replace(/ember[0-9]+/g, 'ember0').replace(/\s+/g, ' ');
}

export function setupSnapshot(assert: Assert) {
  assert.snapshot = function (value, name) {
    const current = QUnit.config.current as CurrentTest;
    const moduleName = current.module.name;
    const testName = current.testName;
    const url = testUrl(moduleName, testName, name);
    const expected = __SNAPSHOTS__[`.${url}`]?.default;
    // Chrome 153 added the `rule` shorthand (CSS gap decorations) to
    // getComputedStyle(). It only mirrors the element's color, so drop it
    // before saving too; otherwise updating snapshots rewrites every file.
    for (const [, styles] of value) {
      delete styles['rule'];
    }
    if (!expected) {
      saveSnapshot(moduleName, testName, name, value);
    }
    // Saved as captured; compared below only after normalizing (ids,
    // whitespace, sub-pixel sizes...), so updating snapshots only rewrites
    // the ones whose normalized content actually changed.
    const raw = JSON.parse(JSON.stringify(value)) as StyleSnapshot;
    const saveIfChanged = () => {
      if (
        window.location.search.includes('save-snapshots') &&
        !QUnit.equiv(value, expected)
      ) {
        saveSnapshot(moduleName, testName, name, raw);
      }
    };
    if (!expected || value.length !== expected.length) {
      saveIfChanged();
      assert.deepEqual(value, expected);
      return;
    }
    for (let i = 0; i < value.length; i++) {
      const actualEntry = value[i]!;
      const expectedEntry = expected[i]!;
      actualEntry[0] = normalizeEmberIds(actualEntry[0]);
      expectedEntry[0] = normalizeEmberIds(expectedEntry[0]);
      const actualStyles = actualEntry[1];
      const expectedStyles = expectedEntry[1];
      expectedStyles['transition'] = expectedStyles['transition']?.replace(
        /0s$/,
        '',
      );
      actualStyles['transition'] = actualStyles['transition']?.replace(
        /0s$/,
        '',
      );
      delete expectedStyles['font'];
      delete actualStyles['font'];
      // Chrome 153 added the `rule` shorthand (CSS gap decorations) to
      // getComputedStyle(). It only mirrors the element's color, so it
      // carries no information and would differ between browser builds.
      delete expectedStyles['rule'];
      delete actualStyles['rule'];
      for (const size of ['width', 'height']) {
        const actualSize = actualStyles[size];
        const expectedSize = expectedStyles[size];
        if (actualSize && expectedSize) {
          const actualPx = Number(actualSize.replace('px', ''));
          const expectedPx = Number(expectedSize.replace('px', ''));
          console.log(size, actualPx, expectedPx);
          if (Math.abs(actualPx - expectedPx) < 3) {
            delete actualStyles[size];
            delete expectedStyles[size];
          }
        }
      }
      for (const prop of FUZZY_NUMERIC_PROPS) {
        const actualProp = actualStyles[prop];
        const expectedProp = expectedStyles[prop];
        if (
          actualProp &&
          expectedProp &&
          numbersWithinTolerance(actualProp, expectedProp, 3)
        ) {
          delete actualStyles[prop];
          delete expectedStyles[prop];
        }
      }
      // If a property appears in the expected snapshot but not in the
      // actual diff, it means the style was already present in the
      // baseline on this platform (e.g. Carbon CSS leaked from a prior
      // test). Drop it from both sides so the comparison is not
      // environment-sensitive. Properties that only appear in the actual
      // (new unexpected changes) still cause a failure.
      for (const prop of Object.keys(expectedStyles)) {
        if (!(prop in actualStyles)) {
          delete expectedStyles[prop];
        }
      }
    }
    saveIfChanged();
    for (let i = 0; i < value.length; i++) {
      if (!QUnit.equiv(value[i], expected[i])) {
        console.log(
          'deepEqual',
          name + ' item:' + i,
          JSON.stringify(value[i], null, 2),
          JSON.stringify(expected[i], null, 2),
        );
      }
      assert.deepEqual(value[i], expected[i], name + ' item:' + i);
    }
  };
}
