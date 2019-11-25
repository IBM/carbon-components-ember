import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  docsRoute(this, function () {
    this.route('getting-started', function () {
      this.route('installation');
    });

    this.route('components', function () {
      this.route('button');
    });
  });
});

export default Router;
