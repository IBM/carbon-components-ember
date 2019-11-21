module.exports = function (environment) {
  return {
    modulePrefix: 'dummy',
    rootURL: '/',
    locationType: 'auto',
    environment,
    podModulePrefix: 'dummy/pods',
    'ember-cli-addon-docs': {
      snippetSearchPaths: ['tests/dummy/src']
    },
    'ember-component-css': {
      namespaceStyles: true,
      componentRootPaths: [],
      routeRootPaths: []
    }
  };
};
