import Application from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

// Apps get the addon's services through its app-tree re-exports, which
// namespace them under `carbon/` (e.g. `service:carbon.dialog-manager`).
// Register them the same way here, as tests/test-helper.ts does.
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

class App extends Application {
  modules = {
    './router': Router,
    ...services,
  };
}

Router.map(function () {});

export function createApp(options: Record<string, unknown> = {}) {
  return App.create({ ...options, autoboot: false }).buildInstance();
}
