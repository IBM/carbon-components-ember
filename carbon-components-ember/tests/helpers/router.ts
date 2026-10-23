import EmberRouter from '@ember/routing/router';
import { visit } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';

interface Registry {
  register(name: string, factory: unknown): void;
  unregister(name: string): void;
}

/**
 * For an application test of links that navigate: a router with
 * `settings` and `users/:id` routes. Render what the test needs with
 * `visitWith`.
 */
export function setupRoutes(hooks: NestedHooks) {
  hooks.beforeEach(function (this: TestContext) {
    class Router extends EmberRouter {
      location = 'none';
      rootURL = '/';
    }
    Router.map(function () {
      this.route('settings');
      this.route('user', { path: '/users/:id' });
    });
    const owner = this.owner as unknown as Registry;
    owner.unregister('router:main');
    owner.register('router:main', Router);
  });
}

/**
 * Renders `template` as the application template and visits `/`. Unlike
 * `render()`'s, it stays on the page while the router transitions, on
 * every Ember version.
 */
export async function visitWith(context: TestContext, template: object) {
  (context.owner as unknown as Registry).register(
    'template:application',
    template,
  );
  await visit('/');
}
