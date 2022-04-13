'use strict';

const nodeSass = require('node-sass');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const IS_TEST = false;
  const IS_PROD = false;
  const app = new EmberAddon(defaults, {
    hinting: IS_TEST, // Disable linting for all builds but test
    tests: IS_TEST, // Don't even generate test files unless a test build
    'ember-cli-babel': {
      includePolyfill: IS_PROD // Only include babel polyfill in prod
    },
    autoprefixer: {
      sourcemap: false // Was never helpful
    },
    sourcemaps: {
      enabled: !IS_PROD // CMD ALT F in chrome is *almost* as fast as CMD P
    },
    fingerprint: {
      enabled: IS_PROD //Asset rewrite will takes more time and fingerprinting can be omitted in development
    },
    sassOptions: {
      // moving from compass compiler to node gave huge improvement
      implementation: nodeSass, //implementation here is node-sass,
      sourceMap : false //will debug with generated CSS than sourcemap :)
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
