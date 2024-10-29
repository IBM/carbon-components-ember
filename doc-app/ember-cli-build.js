'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { maybeEmbroider } = require('@embroider/test-setup');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    snippetExtensions: ['js', 'ts', 'gjs', 'gts'],
    'ember-cli-addon-docs': {
      documentingAddonAt: '../carbon-components-ember',
    },
    'ember-cli-babel': {
      disableDecoratorTransforms: true,
      enableTypeScriptTransform: true,
    },
    autoImport: {
      alias: {
        "ember-composable-helpers": "@nullvoxpopuli/ember-composable-helpers",
      },
    },
  });

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
};
