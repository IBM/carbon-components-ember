import fs from 'fs';
import path from 'path';

function createIndexFiles() {
  // Sorted, so the generated barrels are the same on every OS.
  const files = fs.readdirSync('./src', { recursive: true }).sort();
  const groups = {
    components: [],
    aiChat: [],
    icons: [],
  };
  for (const addonFilename of files) {
    if (!addonFilename.includes('.')) continue;
    if (addonFilename.includes('.gitkeep')) continue;
    if (/\.stories\.[gt]?[jt]s$|\.mdx$/.test(addonFilename)) continue;
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
      // AI Chat has its own barrel, like upstream's separate package, so its
      // components keep upstream's names (`Card`, `CodeSnippet`).
      (addonFilename.startsWith('components/ai-chat/')
        ? groups.aiChat
        : groups.components
      ).push(addonFilename);
    }
  }
  // `carbon-components-ember/components` and `carbon-components-ember/ai-chat`
  // (dist/components.js and dist/ai-chat.js, via the package.json `./*`
  // export).
  writeBarrel(groups.components, './src/components.ts');
  writeBarrel(groups.aiChat, './src/ai-chat.ts');

  const iconsIndexFile = [];
  for (const comp of groups.icons) {
    let camelCased = comp
      .split('/')
      .at(-1)
      .split('.')
      .at()
      .replace(/-([a-zA-Z])/g, function (g) {
        return g[1].toUpperCase();
      });
    camelCased = camelCased[0].toUpperCase() + camelCased.slice(1);
    iconsIndexFile.push(`export { default as ${camelCased} } from './${comp}'`);
  }
  fs.writeFileSync('./src/icons.ts', iconsIndexFile.join('\n'));
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

function createIconIndex() {
  const iconsIndex = path.resolve('./node_modules/@carbon/icons/es/index.js');
  const content = fs.readFileSync(iconsIndex).toString();

  // Step 1: parse all import lines → varName → relative path (without .js)
  const varToPath = {};
  for (const m of content.matchAll(/^import (\S+) from "\.\/([^"]+)";$/gm)) {
    varToPath[m[1]] = m[2].replace('.js', '');
  }

  // Step 2: parse export block → varName → export name
  // The export block is a single line: export { var1 as Name1, var2 as Name2, ... }
  const varToExport = {};
  for (const m of content.matchAll(/\b(\S+?) as ([A-Za-z]\w*)/g)) {
    varToExport[m[1]] = m[2];
  }

  // Step 3: build matchList as [exportName, '@carbon/icons/es/path/size']
  const matchList = [];
  for (const [varName, exportName] of Object.entries(varToExport)) {
    const iconPath = varToPath[varName];
    if (iconPath) {
      matchList.push([exportName, '@carbon/icons/es/' + iconPath]);
    }
  }

  let typesContent = `
type Icon = {
  name: IconNames;
  elem: string;
  attrs: Record<string, string | number>;
  content: {
    elem: string;
    attrs: Record<string, string | number>;
  }[];
  size: number;
};
  `;
  const icons = {};
  const iconNames = {};
  for (const [exportName, fullPath] of matchList) {
    const size = fullPath.split('/').at(-1);
    const commonPath = fullPath.split('/').slice(0, -1).join('/');
    icons[commonPath] = icons[commonPath] || [];
    icons[commonPath].push(size);
    iconNames[commonPath] = exportName.replace(size, '').replace('Glyph', '');
  }
  // Start clean, so icons renamed or removed upstream don't leave stale files.
  fs.rmSync('./src/components/icons', { recursive: true, force: true });
  fs.mkdirSync('./src/components/icons', { recursive: true });
  fs.writeFileSync('./src/components/icons/.gitkeep', 'auto generated icons\n');
  for (const [icon, sizes] of Object.entries(icons)) {
    const iconSizeMap = sizes
      .map(
        (size) =>
          `'${size}': new TrackedPromise(() => import('${icon}/${size}')),`,
      )
      .join('\n  ');
    const index = sizes.includes('index') ? 'index' : '32';
    const content = `
import Icon from '../icon.gts';
import { TrackedPromise } from '../../utils/tracked.ts';

const icons = {
  ${iconSizeMap}
};

export default class ${iconNames[icon]} extends Icon {
  get svg() {
    return (icons[(this.args.size || 24).toString() as keyof typeof icons] || icons['${index}']).getValue()?.default;
  }
}
    `;
    let dashed = iconNames[icon]
      .replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
      .replace(/^-/, '');
    fs.writeFileSync(`./src/components/icons/${dashed}.ts`, content);
  }
  for (const [, fullPath] of matchList) {
    typesContent += '\n';
    typesContent += `declare module '${fullPath}' { export default {} as Icon };\n`;
  }
  fs.writeFileSync(
    './unpublished-development-types/carbon-icons.d.ts',
    typesContent,
  );
}

createIconIndex();
createIndexFiles();
