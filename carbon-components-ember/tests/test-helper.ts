import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setTesting } from '@embroider/macros';
import { setConfig as setBasicDropdownConfig } from 'ember-basic-dropdown/config';
import { setupSnapshot } from './setup-snapshot.ts';
import { powerSelectTestModules } from './power-select-modules.ts';

// The addon's own stylesheet (Carbon flex grid, component patches, ai-chat
// partials), loaded the way a consuming app loads `carbon-components-ember/styles.scss`.
import '#src/styles/index.scss';

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
    ...powerSelectTestModules,
  };
}

Router.map(function () {});

export function start() {
  setTesting(true);
  // Render dropdown content inside the test container.
  setBasicDropdownConfig({ rootElement: '#ember-testing' });
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
