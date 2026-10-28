/**
 * Writes the barrels: src/components.ts, src/ai-chat.ts, src/charts.ts,
 * src/ibm-products.ts and src/icons.ts, which apps import as
 * `carbon-components-ember/components`, `/ai-chat`, `/charts`,
 * `/ibm-products` and `/icons` (dist/*.js, via the package.json `./*`
 * export). Run it after icons.mjs, which writes the icon components;
 * `pnpm generate` runs both.
 */

import fs from 'node:fs';
import path from 'node:path';

function createIndexFiles() {
  // Sorted, so the generated barrels are the same on every OS.
  const files = fs.readdirSync('./src', { recursive: true }).sort();
  const groups = {
    components: [],
    aiChat: [],
    charts: [],
    ibmProducts: [],
    icons: [],
  };
  for (const addonFilename of files) {
    if (!addonFilename.includes('.')) continue;
    if (addonFilename.includes('.gitkeep')) continue;
    if (/\.stories\.[gt]?[jt]s$|\.mdx$/.test(addonFilename)) continue;
    // Components' own stylesheets, imported by the components themselves.
    if (/\.s?css$/.test(addonFilename)) continue;
    if (addonFilename.includes('render-svg-part.ts')) continue;
    if (
      addonFilename.startsWith('components/icons') &&
      !addonFilename.includes('/-')
    ) {
      groups.icons.push(addonFilename);
      continue;
    }
    if (
      addonFilename.startsWith('components/') &&
      !addonFilename.includes('/-')
    ) {
      // AI Chat, the charts and Carbon for IBM Products have their own
      // barrels, as upstream's are packages of their own
      // (`@carbon/ai-chat-components`, `@carbon/charts-react`,
      // `@carbon/ibm-products`), so they keep upstream's names (`Card`,
      // `CodeSnippet`).
      const group = addonFilename.startsWith('components/ai-chat/')
        ? groups.aiChat
        : addonFilename.startsWith('components/charts/')
          ? groups.charts
          : addonFilename.startsWith('components/ibm-products/')
            ? groups.ibmProducts
            : groups.components;
      group.push(addonFilename);
    }
  }
  if (groups.icons.length === 0) {
    throw new Error(
      'src/components/icons/ has no icon components; run scripts/icons.mjs first',
    );
  }
  writeBarrel(groups.components, './src/components.ts');
  writeBarrel(groups.aiChat, './src/ai-chat.ts');
  writeBarrel(groups.charts, './src/charts.ts');
  writeBarrel(groups.ibmProducts, './src/ibm-products.ts');
  writeBarrel(groups.icons, './src/icons.ts');
}

/**
 * Writes a barrel exporting each component under its file name in
 * PascalCase (`text-input.gts` is `TextInput`), so name the file after the
 * export. A top-level `ai-` or `ui-` file spells the acronym as Carbon React
 * does (`AILabel`, `UIShell`).
 */
function writeBarrel(components, file) {
  const lines = [];
  const exportedFrom = new Map();
  for (const comp of components) {
    const camelCased = path
      .basename(comp)
      .replace(/\..*$/, '')
      .split('-')
      .map((word, i) =>
        i === 0 && /^(ai|ui)$/.test(word) && path.dirname(comp) === 'components'
          ? word.toUpperCase()
          : word[0].toUpperCase() + word.slice(1),
      )
      .join('');
    if (exportedFrom.has(camelCased)) {
      throw new Error(
        `${comp} and ${exportedFrom.get(camelCased)} would both export ${camelCased} from ${file}; rename one`,
      );
    }
    exportedFrom.set(camelCased, comp);
    const relativePath = comp.replace('components/', '');
    const source = fs
      .readFileSync(path.join('./src/components', relativePath))
      .toString();
    const namedExports = [
      ...source.matchAll(/^export (?:class|const|function) ([A-Za-z0-9_]+)/gm),
    ].map((m) => m[1]);
    const specifiers = [`default as ${camelCased}`, ...namedExports];
    lines.push(
      `export { ${specifiers.join(', ')} } from './components/${relativePath}'`,
    );
  }
  fs.writeFileSync(file, lines.join('\n'));
}

createIndexFiles();
