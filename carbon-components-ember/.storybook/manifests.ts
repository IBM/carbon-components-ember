/**
 * A Storybook preset that points the components manifest's imports, which
 * agents read, at the barrel that exports each component:
 * `carbon-components-ember/components`, or `/ai-chat`, `/charts` and
 * `/ibm-products`. Every component is a named export there, including those that
 * aren't their file's default export.
 */

import { readFileSync } from 'node:fs';

import type { Manifests } from 'storybook/internal/types';

// Written by `pnpm generate`.
const BARRELS = {
  components: '../src/components.ts',
  'ai-chat': '../src/ai-chat.ts',
  charts: '../src/charts.ts',
  'ibm-products': '../src/ibm-products.ts',
};

/**
 * Each component file's barrel and exported names. Read on every call, so
 * the dev server picks up a component added while it runs.
 */
function barrelExports() {
  const byFile = new Map<string, { barrel: string; names: Set<string> }>();
  for (const [barrel, file] of Object.entries(BARRELS)) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    for (const [, specifiers = '', path = ''] of source.matchAll(
      /export \{([^}]*)\} from '\.\/components\/([^']+?)\.g?[jt]s'/g,
    )) {
      const names = specifiers
        .split(',')
        .map((name) => name.replace(/^\s*default as /, '').trim());
      byFile.set(path, { barrel, names: new Set(names) });
    }
  }
  return byFile;
}

export const experimental_manifests = (manifests: Manifests | undefined) => {
  const byFile = barrelExports();
  for (const component of Object.values(
    manifests?.components?.components ?? {},
  )) {
    // The framework imports each component from its file:
    // `import Name from 'carbon-components-ember/components/<file>';`.
    const file = component.import?.match(
      /carbon-components-ember\/components\/([^'"]+)/,
    )?.[1];
    const exported = file ? byFile.get(file) : undefined;
    if (exported?.names.has(component.name)) {
      component.import = `import { ${component.name} } from 'carbon-components-ember/${exported.barrel}';`;
    }
  }
  return manifests;
};
