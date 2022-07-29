/*jshint node:true*/
/* global require, module */


var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const nodeSass = require('sass-embedded');


module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
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
