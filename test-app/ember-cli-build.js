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

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
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
  //return require('@embroider/compat').prebuild(app, );
};
