'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { prebuild } = require('@embroider/compat/src/default-pipeline');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    snippetExtensions: ['js', 'ts', 'gjs', 'gts'],
    autoImport: {
      watchDependencies: ['carbon-components-ember'],
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../carbon-components-ember',
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  if (process.env.EMBROIDER_TEST_SETUP_FORCE === 'classic') {
    return app.toTree();
  }

  return require('@embroider/compat').prebuild(
    app,
    {
      staticAddonTrees: true,
      staticAddonTestSupportTrees: true,
      staticComponents: true,
      staticHelpers: true,
      staticModifiers: true,
      staticEmberSource: true,
      amdCompatibility: {
        es: [['fetch', ['default', 'setupFastboot']]],
      },
    },
  );
};
