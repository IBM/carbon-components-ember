import EmberRouter from '@ember/routing/router';
import type { TestContext } from '@ember/test-helpers';

/**
 * Gives each test a router with `settings` and `users/:id` routes, set up
 * so `LinkTo` renders their URLs and transitions to them. `settled()`
 * doesn't wait for transitions here, as it does after `visit()`; these
 * routes finish within the click, but a route with an async `model` hook
 * would need a waiter.
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
    const owner = this.owner as unknown as {
      register(name: string, factory: unknown): void;
      unregister(name: string): void;
      setupRouter(): void;
    };
    owner.unregister('router:main');
    owner.register('router:main', Router);
    owner.setupRouter();
  });
}
