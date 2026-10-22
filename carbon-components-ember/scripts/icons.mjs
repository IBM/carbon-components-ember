/**
 * Writes an Ember component for each `@carbon/icons` icon into
 * src/components/icons/, and the module declarations for their SVG data
 * into unpublished-development-types/carbon-icons.d.ts. barrels.mjs then
 * exports them from `carbon-components-ember/icons`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// An icon size's drawing, to tell which sizes have artwork of their own.
async function artwork(iconPath, size) {
  const file = path.resolve('./node_modules', `${iconPath}/${size}.js`);
  const { default: svg } = await import(pathToFileURL(file).href);
  return JSON.stringify([svg.attrs.viewBox, svg.content]);
}

async function createIconComponents() {
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
    // Strip the size from the end only: `Terminal_327032` is `Terminal_3270`.
    const name = exportName.endsWith(size)
      ? exportName.slice(0, -size.length)
      : exportName;
    iconNames[commonPath] = name.replace('Glyph', '');
  }
  // Start clean, so icons renamed or removed upstream don't leave stale files.
  fs.rmSync('./src/components/icons', { recursive: true, force: true });
  fs.mkdirSync('./src/components/icons', { recursive: true });
  fs.writeFileSync('./src/components/icons/.gitkeep', 'auto generated icons\n');
  for (const [icon, sizes] of Object.entries(icons)) {
    // As in @carbon/icons-react: a size with no artwork of its own scales the
    // 32px drawing, so only the sizes that have one are imported, and an
    // `index` beside them is the `glyph` size. A few shapes come only as `index`.
    const baseSize = sizes.includes('32') ? '32' : 'index';
    const base = await artwork(icon, baseSize);
    const own = [];
    for (const size of ['16', '20', '24']) {
      if (sizes.includes(size) && (await artwork(icon, size)) !== base) {
        own.push([size, size]);
      }
    }
    if (baseSize === '32' && sizes.includes('index')) {
      own.push(['glyph', 'index']);
    }
    const imports = [
      `import icon from '${icon}/${baseSize}';`,
      ...own.map(
        ([size, file]) => `import icon_${size} from '${icon}/${file}';`,
      ),
    ].join('\n');
    // React also takes '16px' for 16.
    const svg = own.length
      ? `sized[String(this.size).replace(/px$/, '')] ?? icon`
      : 'icon';
    const sized = own.length
      ? `\nconst sized: Record<string, typeof icon | undefined> = {\n${own
          .map(([size]) => `  ${size}: icon_${size},`)
          .join('\n')}\n};\n`
      : '';
    const content = `
import Icon from '../icon.gts';
${imports}
${sized}
export default class ${iconNames[icon]} extends Icon {
  get svg() {
    return ${svg};
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

await createIconComponents();
