'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['carbon-components-ember2'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  return require('@embroider/compat').compatBuild(app, null, {
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
