import { join } from 'path';
import { existsSync } from 'fs';
import { ResolverLoader } from '@embroider/core';

const pathsImporter = () => {
  const addons = [];

  function getAddons() {
    const resolverLoader = new ResolverLoader(process.cwd());
    for (const engine of resolverLoader.resolver.options.engines) {
      for (const activeAddon of engine.activeAddons) {
        const stylesFolder = join(activeAddon.root, '_app_styles_');
        if (existsSync(stylesFolder)) {
          addons.push(stylesFolder);
        } else {
          addons.push(activeAddon.root);
        }
      }
    }
  }

  async function search(url) {
    if (!addons.length) {
      getAddons();
    }
    if (existsSync(url)) {
      return null;
    }
    for (const p of addons) {
      let newPath = join(p, url);
      if (
        !newPath.endsWith('.scss') &&
        !newPath.endsWith('.sass') &&
        !newPath.endsWith('.css')
      ) {
        newPath += '.scss';
      }
      if (existsSync(newPath)) {
        return {
          file: newPath,
        };
      }
    }
    return null;
  }
  return (url, prev, done) => {
    search(url)
      .then(done)
      .catch((e) => done(null));
  };
};

export const sassOptions = {
  alias: [],
  importer: [pathsImporter()],
};
