/*jshint node:true*/
/* global require, module */

const { Webpack } = require('@embroider/webpack');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const nodeSass = require('sass-embedded');


module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    sassOptions: {
      // moving from compass compiler to node gave huge improvement
      implementation: nodeSass, //implementation here is node-sass
    },
    cssModules: {
      includeExtensionInModulePath: true,
      extension: 'module.scss',
      intermediateOutputPath: 'app/styles/_modules.scss'
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // return app.toTree();
  return require('@embroider/compat').compatBuild(app, Webpack, {
    packageRules: [],
    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /app\/ui\/styles\/app.scss$/i,
              use: [
                // Creates `style` nodes from JS strings
                { loader: 'style-loader' },
                // Translates CSS into CommonJS
                { loader: 'css-loader', options: {
                    modules: {
                      mode: 'global',
                    }
                  } },
                // Compiles Sass to CSS
                { loader: 'sass-loader' }
              ],
            },
            {
              test: /\.scoped\.scss$/i,
              use: [
                // Creates `style` nodes from JS strings
                { loader: 'style-loader' },
                // Translates CSS into CommonJS
                { loader: 'css-loader', options: {
                    modules: {
                      mode: 'local',
                      /**
                       *
                       * @param context {LoaderContext}
                       * @param localIdentName
                       * @param localName
                       */
                      getLocalIdent(context, localIdentName, localName) {
                        const name = localName;
                        let namespace = context.resourcePath.split('node_modules').slice(-1)[0];
                        if (namespace.startsWith('@')) {
                          namespace = namespace.split('/').slice(0, 2).join('/');
                        } else {
                          namespace = namespace.split('/')[0];
                        }
                        let relativePath = context.resourcePath;
                        relativePath = relativePath.replace(/\\/g, '/');
                        const prefix = context.context;
                        const hashKey = `${namespace}_${prefix}_${name}`;
                        return `${namespace}_${prefix}_${name}_${spark_md5.hash(hashKey).slice(0, 5)}`;
                      }
                    }
                  } },
                // Compiles Sass to CSS
                { loader: 'sass-loader' }
              ],
            },
          ],
        },
      }
    }
  });
};
