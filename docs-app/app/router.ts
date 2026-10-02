// I reject this lint

import EmberRouter from '@ember/routing/router';

import config from 'docs-app/config/environment';
import { properLinks } from 'ember-primitives/proper-links';
import { addRoutes } from 'kolay';

@properLinks({
  ignore: ['/tests'],
})
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Registered before addRoutes()'s `/*page` wildcard so its static segment
  // wins by route-recognizer specificity either way - kept first anyway so
  // the ordering isn't relying on that alone.
  this.route('ai-chat-demo');
  addRoutes(this);
});
