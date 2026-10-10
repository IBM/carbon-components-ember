import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  compareArgs,
  diffKnown,
  fixDeclarations,
  readTypes,
  toKnown,
  withoutAccepted,
} from './arg-parity.mjs';

const fixtures = path.join(import.meta.dirname, 'arg-parity-fixtures');
const compare = () =>
  new Map(
    [
      ...readTypes({
        declarations: path.join(fixtures, 'ember'),
        react: path.join(fixtures, 'react/index.js'),
      }),
    ].map(([name, types]) => [name, compareArgs(types)]),
  );
const none = { missing: [], extra: [], values: [] };

test('compares the components both libraries have', () => {
  // Tag's barrel line also exports a helper; OnlyEmber has no React match.
  assert.deepEqual(
    [...compare().keys()],
    ['Button', 'ButtonSet', 'Layer', 'Tag', 'Tooltip'],
  );
});

test("reports React's props we lack, our extra arguments and values", () => {
  assert.deepEqual(compare().get('Button'), {
    // Not children, className, aria-label, style, containerRef, the inherited HTML
    // attributes, the deprecated light, or onClick (a DOM event, so {{on}});
    // labelText is a block. onChange is a DOM event name but also takes
    // data, and onExpand isn't a DOM event.
    missing: ['hasIconOnly', 'onChange', 'onExpand'],
    // Not set, which ButtonSet binds when it yields Button.
    extra: ['loading'],
    values: [
      { name: 'isExpressive', react: 'boolean', ember: 'string' },
      { name: 'kind', missing: ['ghost'], extra: [] },
      { name: 'size', missing: ['lg'], extra: ['xl'] },
      // The HTML attribute React inherits.
      {
        name: 'type',
        missing: ['button', 'reset', 'submit'],
        extra: ['danger', 'primary'],
      },
    ],
  });
  assert.deepEqual(compare().get('ButtonSet'), none);
});

test("reads polymorphic and union props React's types obscure", () => {
  const differences = compare();
  // Layer's props come from LayerBaseProps, plus `as`.
  assert.deepEqual(differences.get('Layer'), none);
  // Tooltip takes Popover's autoAlign, but doesn't require its open.
  assert.deepEqual(differences.get('Tooltip'), none);
  // Tag's own props, not those of the DismissibleTag it also accepts.
  assert.deepEqual(differences.get('Tag'), {
    missing: ['size'],
    extra: [],
    values: [],
  });
});

test('lists new differences and fixed known ones', () => {
  const differences = compare();
  assert.deepEqual(toKnown(differences), {
    Button: {
      missing: ['hasIconOnly', 'onChange', 'onExpand'],
      extra: ['loading'],
      values: ['isExpressive', 'kind', 'size', 'type'],
    },
    Tag: { missing: ['size'] },
  });

  assert.deepEqual(
    diffKnown(differences, {
      Button: {
        missing: ['hasIconOnly', 'isSelected', 'onChange'],
        extra: ['loading'],
        values: ['isExpressive', 'kind', 'size', 'type'],
      },
      Tag: { missing: ['size'] },
    }),
    {
      added: [{ component: 'Button', category: 'missing', name: 'onExpand' }],
      fixed: [{ component: 'Button', category: 'missing', name: 'isSelected' }],
    },
  );
});

test('leaves out accepted differences, and lists unused ones', () => {
  const { differences, unused } = withoutAccepted(compare(), {
    Tag: { missing: { size: 'A reason.' } },
    Button: { extra: { label: 'No longer an argument.' } },
  });
  assert.deepEqual(differences.get('Tag').missing, []);
  assert.deepEqual(unused, [
    { component: 'Button', category: 'extra', name: 'label' },
  ]);

  assert.throws(
    () => withoutAccepted(compare(), { Tag: { missng: { size: 'x' } } }),
    /Tag\.missng: use missing, extra, values/,
  );
  assert.throws(
    () => withoutAccepted(compare(), { Tag: { missing: ['size'] } }),
    /Tag\.missing: map each name to its reason/,
  );
});

test("fixes emitted declarations as the addon's build does", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arg-parity-'));
  t.after(() => fs.rmSync(dir, { recursive: true }));
  fs.writeFileSync(
    path.join(dir, 'a.d.gts.ts'),
    "import B from './b.gts';\nexport type C = import('./c.gjs').C;\n",
  );

  fixDeclarations(dir);

  assert.deepEqual(fs.readdirSync(dir), ['a.d.ts']);
  assert.equal(
    fs.readFileSync(path.join(dir, 'a.d.ts'), 'utf-8'),
    "import B from './b';\nexport type C = import('./c').C;\n",
  );
});
