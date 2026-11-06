(function() {
  var key = '_embroider_macros_runtime_config';
  if (!window[key]) {
    window[key] = [];
  }
  window[key].push(function(m) {
    m.setGlobalConfig(
      '@embroider/macros',
      Object.assign({}, m.getGlobalConfig()['@embroider/macros'], { isTesting: true })
    );
  });
})();

var runningTests=true;
if (typeof Testem !== 'undefined' && (typeof QUnit !== 'undefined' || typeof Mocha !== 'undefined')) {
  Testem.hookIntoTestFramework();
}