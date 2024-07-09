'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['carbon-components-ember'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  return require('@embroider/compat').prebuild(app, {
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticComponents: true,
    staticHelpers: true,
    staticModifiers: true,
    staticEmberSource: true,
    amdCompatibility: {
      es: [['fetch', ['default', 'setupFastboot']]],
    },
  });
};
