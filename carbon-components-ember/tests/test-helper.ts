import EmberApp from '@ember/application';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setTesting } from '@embroider/macros';
import { setupSnapshot } from './setup-snapshot.ts';

import {
  enableCarbonStyles,
  failOnCspViolations,
  installCarbonStyles,
} from './helpers/index.ts';

// `@carbon/styles` itself, ahead of the components' own stylesheets (which
// they import) as in an app.
// Style snapshots turn it off for their unstyled baseline; turn it back on
// after every test in case one failed before doing so itself.
installCarbonStyles();
QUnit.hooks.afterEach(() => enableCarbonStyles());

failOnCspViolations();

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

// Apps get the addon's services through its app-tree re-exports, which
// namespace them under `carbon/` (e.g. `service:carbon.dialog-manager`).
// Register them the same way here.
const services = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: unknown }>('../src/services/*.ts', {
      eager: true,
    }),
  ).map(([path, module]) => [
    path.replace('../src/services/', './services/carbon/'),
    module,
  ]),
);

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    ...services,
  };
}

Router.map(function () {});

export function start() {
  setTesting(true);
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupSnapshot(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
