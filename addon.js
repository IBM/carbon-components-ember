/* eslint-env node */

module.exports = {
  name: require('./package').name,

  included(app) {
    app.import('node_modules/@carbon/charts/styles.css');
    app.import('node_modules/carbon-components/css/carbon-components.css');
  }
};
