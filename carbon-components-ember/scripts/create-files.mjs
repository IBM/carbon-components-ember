import fs from 'fs';
import path from 'path';


function createIndexFiles() {
  const files = fs.readdirSync('./src', { recursive: true });
  const groups = {
    components: [],
    helpers: [],
    icons: [],
  };
  for (const addonFilename of files) {
    if (!addonFilename.includes('.')) continue;
    if (addonFilename.includes('.gitkeep')) continue;
    if (addonFilename.includes('components/index.ts')) continue;
    if (addonFilename.includes('helpers/index.ts')) continue;
    if (addonFilename.includes('render-svg-part.ts')) continue;
    if (addonFilename.startsWith('components/icons') && !addonFilename.includes('/-')) {
      groups.icons.push(addonFilename);
      continue
    }
    if (addonFilename.startsWith('components/') && !addonFilename.includes('/-')) {
      groups.components.push(addonFilename);
    }
    if (addonFilename.startsWith('helpers/') && !addonFilename.includes('/-')) {
      groups.helpers.push(addonFilename);
    }
  }
  const componentIndexFile = [];
  for (const comp of groups.components) {
    let camelCased = comp.split('/').at(-1).split('.').at().replace(/-([a-zA-Z])/g, function (g) { return g[1].toUpperCase(); });
    camelCased = camelCased[0].toUpperCase() + camelCased.slice(1);
    if (comp.includes('charts')) {
      camelCased += 'Chart';
    }
    if (comp.includes('dialogs')) {
      camelCased += 'Dialog';
    }
    if (comp.includes('radio/group')) {
      camelCased = 'RadioGroup';
    }
    if (comp.split('/').at(-1) === 'ui-shell.gts') {
      camelCased = 'UIShell';
    }
    componentIndexFile.push(`export { default as ${camelCased} } from './${comp.replace('components/', '')}'`);
  }
  fs.writeFileSync('./src/components/index.ts', componentIndexFile.join('\n'));

  const iconsIndexFile = [];
  for (const comp of groups.icons) {
    let camelCased = comp.split('/').at(-1).split('.').at().replace(/-([a-zA-Z])/g, function (g) { return g[1].toUpperCase(); });
    camelCased = camelCased[0].toUpperCase() + camelCased.slice(1);
    iconsIndexFile.push(`export { default as ${camelCased} } from './${comp}'`);
  }
  fs.writeFileSync('./src/icons.ts', iconsIndexFile.join('\n'));

  const helpersIndexFile = [];
  for (const comp of groups.helpers) {
    let camelCased = comp.split('/').at(-1).split('.').at().replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    helpersIndexFile.push(`export { default as ${camelCased} } from './${comp.replace('helpers/', '')}'`);
  }
  fs.writeFileSync('./src/helpers/index.ts', helpersIndexFile.join('\n'));
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
  attrs: Record<string,string>;
  content: {
    elem: string;
    attrs: Record<string,string>;
  },
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
  fs.mkdirSync('./src/components/icons', { recursive: true });
  for (const [icon, sizes] of Object.entries(icons)) {
    const iconSizeMap = sizes.map(size => `'${size}': new TrackedPromise(() => import('${icon}/${size}')),`).join('\n  ');
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
    let dashed = iconNames[icon].replace(/[A-Z]/g, m => "-" + m.toLowerCase()).replace(/^-/, '');
    fs.writeFileSync(`./src/components/icons/${dashed}.ts`, content);
  }
  for (const [, fullPath] of matchList) {
    typesContent += '\n';
    typesContent += `declare module '${fullPath}' { export default {} as Icon };\n`;
  }
  fs.writeFileSync('./types/carbon-icons.d.ts', typesContent);
}

createIconIndex();
createIndexFiles();
