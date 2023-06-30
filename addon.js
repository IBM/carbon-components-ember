/* eslint-env node */


module.exports = {
  name: require('./package').name,

  options: {
    cssModules: {
      includeExtensionInModulePath: true,
      extension: 'module.scss',
      intermediateOutputPath: 'app/styles/_modules.scss'
    }
  }
};
