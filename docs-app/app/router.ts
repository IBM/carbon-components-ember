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
  addRoutes(this);
});
