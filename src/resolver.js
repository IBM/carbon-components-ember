// eslint-disable no-undef global-require
import Resolver from 'ember-resolver/resolvers/fallback';
import { capitalize } from '@ember/string';


export default Resolver.extend({

  resolve(name, referrer) {
    const root = name.split(':')[1].split('/')[0];
    let al = null;
    const methodName = `resolve${capitalize(name.split(':')[0])}`;
    let result;
    if (this[methodName]) {
      try {
        const parsedName = this.parseName(name);
        result = this[methodName](parsedName, [root, al]);
      } catch (e) {}
    }
    try {
      result = this._super(name, referrer);
    } catch (e) {}
    return result;
  },

  resolveService(parsedName) {
    if (parsedName.fullNameWithoutType.includes('@')) {
      let [pkg, name] = parsedName.fullNameWithoutType.split('@');
      const muPath = `${pkg}/src/services/${name}/service`;
      if (requirejs.has(muPath)) {
        return require(muPath).default;
      }
      [pkg, name] = parsedName.fullNameWithoutType.split('@');
      const classicPath = `${pkg}/app/services/${name}`;
      if (requirejs.has(classicPath)) {
        return require(classicPath).default;
      }
    }
    return null;
  },

  resolveTemplate(parsedName) {
    let path = parsedName.fullNameWithoutType.replace('components/', '');
    path = `${path}/template`;
    if (requirejs.has(path)) {
      return require(path).default;
    }
    return null;
  },

  resolveComponent(parsedName) {
    let path = parsedName.fullNameWithoutType;
    let path2 = path;
    if (requirejs.has(path2)) {
      if (!require(path2).helper) {
        return require(path2).default;
      }
    }
    path2 = `${path}/component`;
    if (requirejs.has(path2)) {
      return require(path2).default;
    }

    path2 = `demoapp${path}`;
    if (requirejs.has(path2)) {
      return require(path2).default;
    }
    return null;
  },

  resolveHelper(parsedName, [root, al]) {
    let path = parsedName.fullNameWithoutType;
    if (parsedName.fullNameWithoutType.includes('/')) {
      // eslint-disable-next-line prefer-const
      let [pkg, name] = parsedName.fullNameWithoutType.split('/');
      if (al) {
        pkg = pkg.replace(root, al);
      }
      path = `${pkg}/src/ui/components/${name}`;

      if (requirejs.has(path)) {
        if (require(path).helper) return require(path).helper;
        return require(path).default;
      }
      path = `${pkg}/helpers/${name}`;
      if (requirejs.has(path)) {
        if (require(path).helper) return require(path).helper;
        return require(path).default;
      }
    }
    path = `${parsedName.fullNameWithoutType}/component`;
    if (requirejs.has(path)) {
      if (require(path).helper) return require(path).helper;
      return require(path).default;
    }
    path = parsedName.fullNameWithoutType;
    if (requirejs.has(path)) {
      if (require(path).helper) return require(path).helper;
      return require(path).default;
    }
    return null;
  },

  parseName(name) {
    if (name.includes('/') && !name.includes('@ember-data')) {
      const [, path] = name.split(':');
      return {
        fullName: name,
        fullNameWithoutType: path
      };
    }
    return this._super(name);
  }
});
