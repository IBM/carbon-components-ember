/**
 * Writes an Ember component for each `@carbon/icons` icon into
 * src/components/icons/, and the module declarations for their SVG data
 * into unpublished-development-types/carbon-icons.d.ts. barrels.mjs then
 * exports them from `carbon-components-ember/icons`.
 */

import fs from 'node:fs';
import path from 'node:path';

function createIconComponents() {
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

createIconComponents();
