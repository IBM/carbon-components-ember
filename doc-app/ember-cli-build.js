'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { resolve } = require('path');
const { Resolver } = require('@embroider/core');


const componentTemplateCandidates = Resolver.prototype.componentTemplateCandidates;
Resolver.prototype.componentTemplateCandidates = function () {
  return [...componentTemplateCandidates.call(this)].concat([{ prefix: '/', suffix: '/template' }]);
}

const componentJSCandidates = Resolver.prototype.componentJSCandidates;
Resolver.prototype.componentJSCandidates = function () {
  const extensions = ['.js', '.ts', '.gjs', '.gts'];
  const result = [...componentJSCandidates.call(this)];
  for (const ext of extensions) {
    result.push(...[
      { prefix: '/', suffix: ext },
      { prefix: '/', suffix: `/index${ext}` },
      { prefix: '/', suffix: `/component${ext}` }
    ]);
  }
  return result;
}


const parseGlobalPath = Resolver.prototype.parseGlobalPath;
Resolver.prototype.parseGlobalPath = function (path, inEngine) {
  if (path.includes('__hbs__import_')) {
    const parts = path.replace('__hbs__import_', '').split('/');
    let packageName = parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
    try {
      // packageName = this.packageCache.resolve(packageName, inEngine).root;
    } catch (e) {
      //
    }
    const memberName = parts.join('/').replace(packageName + '/', '');
    return {
      packageName,
      memberName,
      from: resolve(inEngine.root, 'package.json')
    }
  }
  return parseGlobalPath.call(this, path, inEngine);
}

const resolveHelper = Resolver.prototype.resolveHelper;
Resolver.prototype.resolveHelper = function (path, inEngine, request) {
  if (path.includes('__hbs__import_')) {
    let target = this.parseGlobalPath(path, inEngine);
    return request.alias(`${target.packageName}/${target.memberName}`).rehome((0, path_1.resolve)(inEngine.root, 'package.json'));
  }
  return resolveHelper.call(this, path, inEngine, request);
}

const resolveModifier = Resolver.prototype.resolveModifier;
Resolver.prototype.resolveModifier = function (path, inEngine, request) {
  if (path.includes('__hbs__import_')) {
    let target = this.parseGlobalPath(path, inEngine);
    return request.alias(`${target.packageName}/${target.memberName}`).rehome((0, path_1.resolve)(inEngine.root, 'package.json'));
  }
  return resolveModifier.call(this, path, inEngine, request);
}

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['carbon-components-ember'],
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../carbon-components-ember'
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  return require('@embroider/compat').compatBuild(app, require('@embroider/webpack').Webpack, {
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticComponents: true,
    staticHelpers: true,
    staticModifiers: true,
    staticEmberSource: true,
    amdCompatibility: {
      es: [],
    },
  });
};
