#!/usr/bin/env node

/**
 * Compares each component's arguments with its Carbon React counterpart's
 * props, reading both libraries' TypeScript types. Run with --help for usage.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

import ts from 'typescript';

const ADDON = path.resolve(import.meta.dirname, '../carbon-components-ember');
export const KNOWN_FILE = path.join(
  import.meta.dirname,
  'known-arg-differences.json',
);
export const ACCEPTED_FILE = path.join(
  import.meta.dirname,
  'accepted-arg-differences.json',
);

// React props that Ember expresses another way: blocks, the class
// attribute and {{#each}} keys.
export const IDIOMS = new Set(['children', 'className', 'key']);

/**
 * Whether Ember takes a React prop some other way: an idiom above, a ref
 * (Ember passes an element or a modifier), or an HTML attribute or DOM
 * event (`{{on}}`) through `...attributes`.
 */
export const isIdiom = (name, prop) =>
  IDIOMS.has(name) ||
  /^ref$|Ref$/.test(name) ||
  /^(aria|data)-|^(role|style|tabIndex)$/.test(name) ||
  prop.domEvent;

const CATEGORIES = ['missing', 'extra', 'values'];

const USAGE = `Usage: pnpm --filter dom-parity args [options]

Compares each component's arguments with the props of the Carbon React
component of the same name, in the @carbon/react version dom-parity pins:

  missing  props Carbon React declares that we don't take as an argument or
           a block. Deprecated props don't count, nor do props Ember takes
           another way: children (blocks), refs (elements or modifiers),
           DOM event handlers ({{on}}), and className, aria-*, data-*, role,
           style, tabIndex and the HTML attributes React inherits
           (...attributes)
  extra    arguments React has no prop for, other than those a parent binds
           when it yields the component
  values   arguments whose values differ from React's

Known differences are listed in known-arg-differences.json, and deliberate
ones, with the reason, in accepted-arg-differences.json.

  --component <name>    Only show this component, e.g. Button
  --check               Fail on differences that aren't listed as known, and
                        on listed ones that are fixed
  --update              Rewrite known-arg-differences.json to match
  --declarations <dir>  Read the addon's types from this declarations
                        directory instead of emitting them
  --json                Print the comparison as JSON
  --help                Show this message`;

/** Emits the addon's declarations, which takes ember-tsc a few seconds. */
export function emitDeclarations() {
  const out = path.join(ADDON, 'node_modules/.cache/arg-parity');
  fs.rmSync(out, { recursive: true, force: true });
  try {
    execFileSync(
      path.join(ADDON, 'node_modules/.bin/ember-tsc'),
      [
        ...['-p', 'tsconfig.publish.json', '--declaration'],
        ...['--emitDeclarationOnly', '--noEmit', 'false'],
        ...['--declarationMap', 'false', '--declarationDir', out],
      ],
      { cwd: ADDON, stdio: 'pipe' },
    );
  } catch (error) {
    if (!fs.existsSync(path.join(out, 'components.d.ts'))) throw error;
    // Type errors still emit every file, but the comparison may be off.
    process.stderr.write(error.stdout?.toString() ?? '');
    console.error('ember-tsc reported the errors above.\n');
  }
  fixDeclarations(out);
  return out;
}

/**
 * As @embroider/addon-dev's build does: names emitted declarations .d.ts,
 * and drops .gts and .gjs from their imports so TypeScript resolves them.
 */
export function fixDeclarations(out) {
  for (const file of fs.readdirSync(out, { recursive: true })) {
    const from = path.join(out, file);
    const to = from.replace(/\.d\.(gts|gjs)\.ts$/, '.d.ts');
    if (!to.endsWith('.d.ts')) continue;
    if (to !== from) fs.renameSync(from, to);
    fs.writeFileSync(
      to,
      fs
        .readFileSync(to, 'utf-8')
        .replace(/(from\s+|import\()(['"])([^'"]+)\.(gts|gjs)\2/g, '$1$2$3$2'),
    );
  }
}

/** The components a declarations directory's barrel exports, by name. */
export function emberComponents(declarations) {
  const barrel = fs.readFileSync(
    path.join(declarations, 'components.d.ts'),
    'utf-8',
  );
  const components = new Map();
  for (const [, name, from] of barrel.matchAll(
    /export \{ default as (\w+)(?:, [^}]*)? \} from '\.\/(.+?)(?:\.gts|\.ts)?';/g,
  )) {
    components.set(name, path.join(declarations, `${from}.d.ts`));
  }
  return components;
}

/** A prop or argument's type: its kind, and its values if they're fixed. */
function describe(type) {
  const parts = (type.isUnion() ? type.types : [type]).filter(
    (part) => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  const every = (flag) => parts.every((part) => part.flags & flag);
  if (parts.length && parts.every((part) => part.isStringLiteral())) {
    return { kind: 'string', values: parts.map((part) => part.value).sort() };
  }
  if (every(ts.TypeFlags.BooleanLike)) return { kind: 'boolean' };
  if (every(ts.TypeFlags.StringLike)) return { kind: 'string' };
  if (every(ts.TypeFlags.NumberLike)) return { kind: 'number' };
  // A tag name or a component, like React's `as`.
  if (parts.some((part) => part.flags & ts.TypeFlags.StringLike)) {
    return { kind: 'other' };
  }
  if (parts.some((part) => part.getCallSignatures().length)) {
    return { kind: 'function' };
  }
  return { kind: 'other' };
}

/**
 * Whether a prop is a DOM event handler (one React's `DOMAttributes` has)
 * that takes only the event, so `{{on}}` can stand in for it.
 */
function isDomEvent(checker, domEvents, name, type) {
  if (!domEvents.has(name)) return false;
  const signatures = (type.isUnion() ? type.types : [type]).flatMap((part) =>
    part.getCallSignatures(),
  );
  return (
    signatures.length > 0 &&
    signatures.every(
      (signature) =>
        signature.parameters.length === 1 &&
        /Event\b/.test(
          checker.typeToString(
            checker.getTypeOfSymbol(signature.parameters[0]),
          ),
        ),
    )
  );
}

/**
 * The arguments a parent binds when it yields a component, as
 * `WithBoundArgs<typeof Component, 'a' | 'b'>`, by the component's file.
 */
function boundArgs(program, checker, declarations) {
  const bound = new Map();
  const visit = (node) => {
    if (
      ts.isTypeReferenceNode(node) &&
      ts.isIdentifier(node.typeName) &&
      node.typeName.text === 'WithBoundArgs' &&
      node.typeArguments?.length === 2 &&
      ts.isTypeQueryNode(node.typeArguments[0])
    ) {
      const [component, names] = node.typeArguments;
      let symbol = checker.getSymbolAtLocation(component.exprName);
      if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
        symbol = checker.getAliasedSymbol(symbol);
      }
      const file = symbol?.declarations?.[0]?.getSourceFile().fileName;
      if (file) {
        const args = bound.get(file) ?? new Set();
        for (const type of ts.isUnionTypeNode(names) ? names.types : [names]) {
          if (ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)) {
            args.add(type.literal.text);
          }
        }
        bound.set(file, args);
      }
    }
    ts.forEachChild(node, visit);
  };
  for (const file of program.getSourceFiles()) {
    if (file.fileName.startsWith(declarations)) visit(file);
  }
  return bound;
}

const isDeprecated = (symbol) =>
  symbol.getJsDocTags().some((tag) => tag.name === 'deprecated');

const declaredIn = (symbol) =>
  (symbol.declarations ?? []).map((d) => d.getSourceFile().fileName);

const isReactOwn = (symbol) =>
  !declaredIn(symbol).every((file) =>
    file.includes('/node_modules/@types/react/'),
  );

/**
 * The props of `<Name>Props` or `<Name>BaseProps`, declared next to a
 * component, and whether `<Name>Props` is polymorphic (takes `as`).
 * TypeScript loses a polymorphic component's own props when it expands them
 * over every element type, as for Layer.
 */
function declaredProps(checker, reactModule, name) {
  const symbol = exported(checker, reactModule, name);
  const file = symbol?.declarations?.[0]?.getSourceFile();
  const statements = file?.statements ?? [];
  const props = statements.find(
    (statement) =>
      ts.isInterfaceDeclaration(statement) &&
      [`${name}Props`, `${name}BaseProps`].includes(statement.name.text),
  );
  const polymorphic = statements.some(
    (statement) =>
      ts.isTypeAliasDeclaration(statement) &&
      statement.name.text === `${name}Props` &&
      statement.type.getText(file).includes('Polymorphic'),
  );
  return {
    props: props
      ? checker.getPropertiesOfType(
          checker.getDeclaredTypeOfSymbol(
            checker.getSymbolAtLocation(props.name),
          ),
        )
      : [],
    polymorphic,
  };
}

/**
 * A props type's properties. Of a union, the member with the component's
 * own `<Name>Props` (Tag's, not those of OperationalTag and the other
 * variants it also accepts), or else every member's.
 */
function unionProps(checker, reactModule, name, type) {
  if (!type.isUnion()) return checker.getPropertiesOfType(type);
  const members = type.types.map((member) =>
    checker.getPropertiesOfType(member),
  );
  const declared = declaredProps(checker, reactModule, name).props.map(
    (prop) => prop.name,
  );
  const own =
    declared.length &&
    members.find((props) =>
      declared.every((prop) => props.some((p) => p.name === prop)),
    );
  return own || [...new Map(members.flat().map((p) => [p.name, p])).values()];
}

const exported = (checker, reactModule, name) => {
  const symbol = checker
    .getExportsOfModule(reactModule)
    .find((s) => s.name === name);
  return symbol && symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
};

/**
 * The props a polymorphic component passes on to the component it renders
 * by default (`<T extends ElementType = typeof Popover>` for Tooltip).
 * TypeScript reads the component's props for `ElementType` instead.
 */
function passedOnProps(checker, reactModule, name, seen = new Set([name])) {
  const symbol = exported(checker, reactModule, name);
  const declaration = symbol?.getDeclarations()?.[0];
  const fallback = declaration
    ? checker
        .getTypeOfSymbolAtLocation(symbol, declaration)
        .getCallSignatures()[0]?.typeParameters?.[0]?.symbol.declarations?.[0]
        ?.default
    : undefined;
  if (
    !fallback ||
    !ts.isTypeQueryNode(fallback) ||
    !ts.isIdentifier(fallback.exprName) ||
    seen.has(fallback.exprName.text)
  ) {
    return [];
  }
  const renders = fallback.exprName.text;
  seen.add(renders);
  return [
    ...declaredProps(checker, reactModule, renders).props,
    ...passedOnProps(checker, reactModule, renders, seen),
  ];
}

/**
 * Reads both sides' types in one TypeScript program: React's props as
 * `ComponentProps<typeof Component>`, and ours from each component's
 * `<Name>Signature`. Returns the components both libraries have.
 */
export function readTypes({ declarations, react = '@carbon/react' }) {
  declarations = path.resolve(declarations);
  const ember = emberComponents(declarations);
  const entry = path.join(import.meta.dirname, '__arg-parity__.ts');
  const source = [
    "import type { ComponentProps, DOMAttributes } from 'react';",
    `import type * as React from '${react}';`,
    'export type DomEvents = DOMAttributes<Element>;',
    ...[...ember].flatMap(([name, file]) => [
      `export type React_${name} = ComponentProps<typeof React.${name}>;`,
      `export type * as Ember_${name} from '${file.replace(/\.d\.ts$/, '.js')}';`,
    ]),
  ].join('\n');

  const options = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    // As the addon's own build resolves its extensionless imports.
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    types: [],
  };
  const host = ts.createCompilerHost(options);
  const { readFile, fileExists } = host;
  host.readFile = (file) =>
    file === entry ? source : readFile.call(host, file);
  host.fileExists = (file) => file === entry || fileExists.call(host, file);
  const program = ts.createProgram([entry], options, host);
  const checker = program.getTypeChecker();
  const exports = new Map(
    checker
      .getExportsOfModule(
        checker.getSymbolAtLocation(program.getSourceFile(entry)),
      )
      .map((symbol) => [symbol.name, symbol]),
  );

  const bound = boundArgs(program, checker, declarations);
  const reactModule = checker.getAliasedSymbol(
    checker
      .getSymbolsInScope(program.getSourceFile(entry), ts.SymbolFlags.Alias)
      .find((symbol) => symbol.name === 'React'),
  );
  const domEvents = new Set(
    checker
      .getPropertiesOfType(
        checker.getDeclaredTypeOfSymbol(exports.get('DomEvents')),
      )
      .map((prop) => prop.name)
      .filter((name) => /^on[A-Z]/.test(name)),
  );
  const components = new Map();
  for (const [name, file] of ember) {
    const reactType = checker.getDeclaredTypeOfSymbol(
      exports.get(`React_${name}`),
    );
    let reactProps = unionProps(checker, reactModule, name, reactType);
    // Not a React component, or not one React exports.
    if (!reactProps.length || checker.typeToString(reactType) === 'any') {
      continue;
    }
    let polymorphic = false;
    if (!reactProps.some(isReactOwn)) {
      const declared = declaredProps(checker, reactModule, name);
      reactProps = [...reactProps, ...declared.props];
      polymorphic = declared.polymorphic;
    }
    const names = new Set(reactProps.map((prop) => prop.name));
    const passedOn = passedOnProps(checker, reactModule, name).filter(
      (prop) => !names.has(prop.name),
    );
    const passedOnNames = new Set(passedOn.map((prop) => prop.name));
    reactProps = [...reactProps, ...passedOn];

    const props = new Map();
    for (const prop of reactProps) {
      const type = checker.getTypeOfSymbol(prop);
      props.set(prop.name, {
        // Props React only inherits from the HTML element's attributes, or
        // passes on to the component it renders.
        own: isReactOwn(prop) && !passedOnNames.has(prop.name),
        deprecated: isDeprecated(prop),
        domEvent: isDomEvent(checker, domEvents, prop.name, type),
        ...describe(type),
      });
    }
    if (polymorphic) {
      props.set('as', { own: true, deprecated: false, kind: 'other' });
    }

    const module = checker.getExportsOfModule(
      checker.getAliasedSymbol(exports.get(`Ember_${name}`)),
    );
    const signatures = module.filter((s) => s.name.endsWith('Signature'));
    const signature =
      signatures.find((s) => s.name === `${name}Signature`) ?? signatures[0];
    const members = (key) => {
      const type = signature && checker.getDeclaredTypeOfSymbol(signature);
      const member = type?.getProperty(key);
      return member
        ? checker.getPropertiesOfType(checker.getTypeOfSymbol(member))
        : [];
    };

    components.set(name, {
      props,
      args: new Map(
        members('Args').map((arg) => [
          arg.name,
          describe(checker.getTypeOfSymbol(arg)),
        ]),
      ),
      blocks: new Set(members('Blocks').map((block) => block.name)),
      bound: bound.get(file) ?? new Set(),
    });
  }
  return components;
}

function compareValues(prop, arg) {
  if (prop.values && arg.values) {
    const missing = prop.values.filter((v) => !arg.values.includes(v));
    const extra = arg.values.filter((v) => !prop.values.includes(v));
    return missing.length || extra.length ? { missing, extra } : undefined;
  }
  if (prop.kind !== arg.kind && prop.kind !== 'other' && arg.kind !== 'other') {
    return { react: prop.kind, ember: arg.kind };
  }
}

/** One component's differences from React. */
export function compareArgs({ props, args, blocks, bound = new Set() }) {
  const missing = [];
  const extra = [];
  const values = [];
  for (const [name, prop] of props) {
    if (!prop.own || prop.deprecated || isIdiom(name, prop)) continue;
    if (!args.has(name) && !blocks.has(name)) missing.push(name);
  }
  for (const [name, arg] of args) {
    const prop = props.get(name);
    if (!prop) {
      if (!bound.has(name)) extra.push(name);
      continue;
    }
    const difference = compareValues(prop, arg);
    if (difference) values.push({ name, ...difference });
  }
  return {
    missing: missing.sort(),
    extra: extra.sort(),
    values: values.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

const namesOf = (difference, category) =>
  category === 'values'
    ? difference.values.map((value) => value.name)
    : difference[category];

/** The known-differences file's contents for a comparison. */
export function toKnown(differences) {
  const known = {};
  for (const [component, difference] of [...differences].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const entry = {};
    for (const category of CATEGORIES) {
      const names = namesOf(difference, category);
      if (names.length) entry[category] = names;
    }
    if (Object.keys(entry).length) known[component] = entry;
  }
  return known;
}

/** Differences that aren't known, and known ones that are fixed. */
export function diffKnown(differences, known) {
  const current = toKnown(differences);
  const added = [];
  const fixed = [];
  for (const component of new Set([
    ...Object.keys(current),
    ...Object.keys(known),
  ])) {
    for (const category of CATEGORIES) {
      const now = current[component]?.[category] ?? [];
      const was = known[component]?.[category] ?? [];
      for (const name of now) {
        if (!was.includes(name)) added.push({ component, category, name });
      }
      for (const name of was) {
        if (!now.includes(name)) fixed.push({ component, category, name });
      }
    }
  }
  return { added, fixed };
}

/**
 * Drops the differences accepted as deliberate, by component and category
 * (`{ Tag: { missing: { id: 'reason' } } }`), and lists accepted entries
 * that no longer differ.
 */
export function withoutAccepted(differences, accepted) {
  for (const [component, categories] of Object.entries(accepted)) {
    for (const [category, names] of Object.entries(categories ?? {})) {
      const where = `${component}.${category}`;
      if (!CATEGORIES.includes(category)) {
        throw new Error(`${where}: use ${CATEGORIES.join(', ')}.`);
      }
      if (
        typeof names !== 'object' ||
        names === null ||
        Array.isArray(names) ||
        !Object.values(names).every((reason) => typeof reason === 'string')
      ) {
        throw new Error(`${where}: map each name to its reason.`);
      }
    }
  }
  const filtered = new Map();
  for (const [component, difference] of differences) {
    const ok = (category, name) =>
      !Object.hasOwn(accepted[component]?.[category] ?? {}, name);
    filtered.set(component, {
      missing: difference.missing.filter((name) => ok('missing', name)),
      extra: difference.extra.filter((name) => ok('extra', name)),
      values: difference.values.filter(({ name }) => ok('values', name)),
    });
  }
  const unused = [];
  for (const [component, categories] of Object.entries(accepted)) {
    for (const [category, names] of Object.entries(categories)) {
      const current = differences.get(component);
      for (const name of Object.keys(names)) {
        if (!current || !namesOf(current, category).includes(name)) {
          unused.push({ component, category, name });
        }
      }
    }
  }
  return { differences: filtered, unused };
}

const quote = (values) => values.map((v) => `"${v}"`).join(', ');

function formatValues({ name, missing, extra, react, ember }) {
  if (react) return `@${name} (${ember}; React's is ${react})`;
  const parts = [];
  if (missing.length) parts.push(`lacks ${quote(missing)}`);
  if (extra.length) parts.push(`adds ${quote(extra)}`);
  return `@${name} (${parts.join('; ')})`;
}

export function formatComponent(name, difference) {
  const lines = [name];
  if (difference.missing.length) {
    lines.push(
      `  missing: ${difference.missing.map((n) => `@${n}`).join(', ')}`,
    );
  }
  if (difference.extra.length) {
    lines.push(`  extra:   ${difference.extra.map((n) => `@${n}`).join(', ')}`);
  }
  if (difference.values.length) {
    lines.push(`  values:  ${difference.values.map(formatValues).join(', ')}`);
  }
  if (lines.length === 1) lines.push('  matches React');
  return lines.join('\n');
}

const describeEntry = ({ component, category, name }) =>
  `${component}: ${category} @${name}`;

export function main(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    options: {
      component: { type: 'string' },
      check: { type: 'boolean' },
      update: { type: 'boolean' },
      declarations: { type: 'string' },
      json: { type: 'boolean' },
      help: { type: 'boolean' },
    },
  });
  if (values.help) {
    console.log(USAGE);
    return 0;
  }

  const declarations = values.declarations ?? emitDeclarations();
  const accepted = JSON.parse(fs.readFileSync(ACCEPTED_FILE, 'utf-8'));
  let differences, unused;
  try {
    ({ differences, unused } = withoutAccepted(
      new Map(
        [...readTypes({ declarations })].map(([name, types]) => [
          name,
          compareArgs(types),
        ]),
      ),
      accepted,
    ));
  } catch (error) {
    console.error(`${path.basename(ACCEPTED_FILE)}: ${error.message}`);
    return 1;
  }
  const version = createRequire(import.meta.url)(
    '@carbon/react/package.json',
  ).version;

  if (values.update) {
    fs.writeFileSync(
      KNOWN_FILE,
      `${JSON.stringify(toKnown(differences), null, 2)}\n`,
    );
    console.log(`Updated ${path.basename(KNOWN_FILE)}.`);
    return 0;
  }

  const shown = values.component
    ? [[values.component, differences.get(values.component)]]
    : [...differences].sort(([a], [b]) => a.localeCompare(b));
  if (values.component && !shown[0][1]) {
    console.error(
      `${values.component} isn't a component we share with Carbon React.`,
    );
    return 1;
  }

  if (values.json) {
    console.log(JSON.stringify(Object.fromEntries(shown), null, 2));
  } else if (values.component) {
    console.log(formatComponent(...shown[0]));
  } else if (!values.check) {
    const differing = shown.filter(([, d]) =>
      CATEGORIES.some((category) => d[category].length),
    );
    for (const [name, difference] of differing) {
      console.log(`${formatComponent(name, difference)}\n`);
    }
    console.log(
      `${differences.size} components compared with @carbon/react ${version}: ` +
        `${differences.size - differing.length} match, ${differing.length} differ.`,
    );
  }

  if (values.check) {
    const known = JSON.parse(fs.readFileSync(KNOWN_FILE, 'utf-8'));
    const { added, fixed } = diffKnown(differences, known);
    for (const entry of unused) {
      console.error(
        `No longer differs, so remove it from ${path.basename(ACCEPTED_FILE)}: ${describeEntry(entry)}`,
      );
    }
    for (const entry of added) {
      console.error(`New difference from React: ${describeEntry(entry)}`);
    }
    for (const entry of fixed) {
      console.error(
        `Fixed, so remove it from the list: ${describeEntry(entry)}`,
      );
    }
    for (const component of new Set(added.map((entry) => entry.component))) {
      console.error(
        `\n${formatComponent(component, differences.get(component))}`,
      );
    }
    if (added.length || fixed.length || unused.length) {
      console.error(
        `\nMatch React's API, or run \`pnpm --filter dom-parity args --update\` to record the change in ${path.basename(KNOWN_FILE)}. Record a deliberate difference, with the reason, in ${path.basename(ACCEPTED_FILE)}.`,
      );
      return 1;
    }
    console.log(
      `Arguments match @carbon/react ${version}, apart from the known differences.`,
    );
  }
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = main();
}
